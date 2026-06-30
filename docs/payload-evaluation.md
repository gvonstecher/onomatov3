# Payload CMS Evaluation — Onomato

> Technical evaluation document. Audience: leadership (decision) and engineering (architecture).
> Status: **verified end-to-end (2026-06-30)**. All 12 collections are live in the admin, native auth works, and the PDF pipeline ran in the real admin flow — a 5-page PDF produced 5 BookPages + 5 WebP images and auto-set the cover.

## 1. Goal and context

The goal is to **evaluate Payload CMS 3 as a tool**: understand what it solves, where it shines, and where there's friction, backed by real evidence rather than a "hello world".

The chosen testbed is **onomato**, a book marketplace (Next.js + Prisma + PostgreSQL + NextAuth + MercadoPago) that never reached production and has no data loaded. It's the ideal sandbox:

- Zero risk: no real users or data to protect.
- It's a real product, not a toy example: it exercises serious features (data modeling, relationships, uploads, authentication, background processing).

**Guiding principle of the evaluation:** to evaluate a tool, you have to go all in. A half migration (Payload on one side, half the system on the other) would test Payload with one hand tied behind its back. That's why the decision was to commit fully (see section 3).

## 2. What Payload is (and is not)

Payload is a **code-first, self-hosted, open-source headless CMS** that runs **inside** your own Next.js app (it is not an external service).

The most common misconception is to think the content is hosted on the vendor's platform (like Contentful or WordPress.com). **It is not.** The key distinction:

- **Owner of the data model** (the shape of the tables, the migrations): this moves from Prisma to Payload.
- **Owner of the database and the data**: still yours. Same PostgreSQL, same machine, same `DATABASE_URL`. Not a single byte moves elsewhere.

The right analogy is the **self-hosted WordPress installer**: WordPress defines the structure of its tables (`wp_posts`, etc.), but the database is yours. Payload is identical: it creates its tables in your Postgres and defines their structure, but the database is yours.

The admin panel is served from your own app at `/admin`. Collections are defined in TypeScript files, versioned in git like any other code.

## 3. Architecture decision: full migration

**Rejected:** partial migration (keep auth in NextAuth, the custom file pipeline outside, half the model in Prisma). For an evaluation it's the worst path: you prove nothing.

**Decision:** go full Payload.

- Prisma is removed entirely.
- NextAuth is removed entirely.
- Everything is a Payload Collection.
- Native Payload authentication.

**Side benefit of going all in:** by bringing `Users` inside Payload, all relationships become clean. The "cross-schema" problem disappears (a Payload field cannot reference a Prisma table): no more hacks storing ids as text, because `Author → User`, `Order → User`, etc. are native Payload relationships.

> The migration is done in phases so the app doesn't break: first define the model in Payload (additive, the old app keeps running), then remove the old stack and rewire the frontend.

## 4. The data model

12 Collections recreate what were 13 models in Prisma. Mapping:

| Payload Collection | Prisma origin | Design note |
|--------------------|---------------|-------------|
| `Users` | User + Account + Session | `auth: true` (native email/password) |
| `Media` | File | native upload + resize (sharp) |
| `Tags` | Tag | — |
| `Authors` | Author + AuthorSocialmedia | socialmedias as an `array`; `user` as a clean relationship |
| `Books` | Book + BookTag | `tags` with `hasMany` |
| `BookFiles` | (new) | source PDF, `mimeTypes: application/pdf` |
| `BookPages` | BookPage | image generated from the PDF, not hand-uploaded |
| `BookVotes` | BookVote | — |
| `FollowedAuthors` | FollowedAuthor | composite PK → regular collection |
| `FollowedBooks` | FollowedBook | same; `bought` + `lastPageRead` flags |
| `Orders` | Order | — |
| `Payments` | Payment | `mercadopagoPaymentId` as text (was BigInt) |

**Idiomatic simplifications** (from "tables and FKs" to "fields and relationships"):

- **Junction table `BookTag` → gone.** The many-to-many is a `relationship` field with `hasMany: true` on `Books`. Payload handles the junction under the hood.
- **Table `AuthorSocialmedia` → gone.** It's an `array` field inside `Authors`. Data that only exists hanging off the parent doesn't deserve its own collection.
- **Composite PKs → regular collections** with two relationships (uniqueness, if needed, is added via a hook).

## 5. The central case: PDF → pages pipeline

### Requirement

A book is **a PDF** (downloadable by the buyer) **and** a set of **pages** for the site's online reader. Both.

### Production reference: MadCave

MadCave (a comics publisher, WordPress/WooCommerce) already solved this in production. Transferable lessons:

1. **The PDF is the source of truth; the pages are DERIVED data.** The author uploads a PDF, the system extracts the images. No one uploads pages by hand.
2. **Processing is asynchronous, in the background. Never inline in the upload request.** Rendering a PDF of hundreds of pages is heavy and eats memory; blocking the HTTP request would kill it with a timeout.
3. **Chunked + explicit memory management**: free memory per page; batch size based on book size.
4. **First N pages = cover + free preview.**
5. Conversion: PDF → image ~210 DPI → WebP quality 82.

### Implementation in Payload (pragmatic version)

We chose the pragmatic version: one job per book that renders all pages, freeing memory per page, with no chunking/resume yet. Enough to evaluate Payload's **Jobs Queue** (the feature that proves it handles heavy logic) without over-engineering.

```
Author uploads PDF to Book.pdf
        │
        ▼  afterChange hook (only if the PDF changed)
payload.jobs.queue({ task: 'extractBookPages', input: { bookId } })
        │
        ▼  autoRun processes the queue in the background (cron, every minute in dev)
extractBookPages:
   reads PDF from disk → pdf-to-img (scale 3, ~210 DPI)
   per page:  sharp → WebP q82  →  creates Media + BookPage
   page 1 → sets cover if none
```

| Piece | File |
|-------|------|
| Source PDF (collection) | `src/collections/BookFiles.ts` |
| `pdf` field + enqueue hook | `src/collections/Books.ts` |
| Generated page (`image`) | `src/collections/BookPages.ts` |
| The task | `src/jobs/extractBookPages.ts` |
| Task registration + `autoRun` | `src/payload.config.ts` |

**Technical decisions:**

- **Render engine: `pdf-to-img` (v5).** Pure npm (uses pdfjs, Firefox's engine, + native canvas), no system dependencies (no `brew` required). The engine is **isolated inside the task**: swapping it for `mupdf` later touches a single file.
- **Idempotent:** re-uploading the PDF deletes the previous pages and regenerates. No duplicates.
- **Memory:** each PNG/WebP buffer dies at the end of its loop iteration.

### Verified end-to-end

Driven through the real admin UI: created the first admin user (native auth), created an Author and a Book, uploaded a 5-page PDF to the `pdf` field, and saved. With no further action, the chain ran on its own — `afterChange` hook → `payload.jobs.queue` → `autoRun` (cron) → the `extractBookPages` task — and produced:

- **5 BookPages**, ordered (page 1 → media 1 … page 5 → media 5).
- **5 WebP images** in Media (render + sharp).
- the Book **cover auto-set** from page 1.

Two real integration issues surfaced and were fixed along the way (see findings): both required small, contained accommodations because the render engine is isolated inside the task.

## 6. Evaluation findings

### What Payload does well

- **Code-first model in TypeScript**, versioned in git. The structure is code, not clicks.
- **Idiomatic relationships, arrays, and uploads**, with native image resizing (sharp included).
- **First-class Jobs Queue**: background processing with no extra infrastructure (no Redis, no separate worker in dev).
- **Auto-generated admin panel** from the Collections.
- **Local API** (server-side, no HTTP) so the Next frontend reads data fast.
- **Declarative access control** per collection (`read`, `create`, `update`, `delete`).
- **Coexists with the existing database**: shares onomato's Postgres, isolated in its own `payload` schema.

### Frictions and things to watch

- **ESM required**: had to switch onomato to `type: module` for the Payload CLI.
- **Coexistence with Prisma**: Payload was isolated in its own schema because **Prisma's composite PKs crash Payload's schema pull** (known issue payloadcms/payload#12858).
- **The scaffold's `importMap` came empty** and broke `/admin`; it had to be generated.
- **Manual type-gen**: after changing the model you must run `payload generate:types`.
- **Duplicate auth during the transition**: old NextAuth and native Payload coexist until Phase 2 is complete.
- **Dev schema push is interactive and blocks.** On ambiguous changes (e.g. a renamed column, create vs rename) Payload's dev `push` prompts on the terminal. In a headless/background process there's no one to answer and it hangs. Fine to resolve by recreating the schema in a sandbox; production should use Payload migrations instead of dev push.
- **pdfjs needed two accommodations to run in the Turbopack server bundle.** (1) `serverExternalPackages: ['pdf-to-img', 'pdfjs-dist']` in `next.config`, so pdfjs loads from `node_modules` and finds its worker file. (2) A guard that normalizes `Array.prototype` (a transitive dependency added an enumerable method, which pdfjs refuses to run alongside). Both fixes are contained because the render engine is isolated inside the task. **For production we recommend `mupdf` (self-contained WASM), which is immune to both issues; swapping is a one-file change.**

## 7. Pending and next steps

- **Phase 2**: remove Prisma and NextAuth, rewire the frontend to the Local API, enable native auth.
- **Pipeline**: chunking/resume for huge books; real access control (PDF download and paid pages only for buyers).
- **Production render engine**: evaluate swapping `pdf-to-img` for `mupdf` (WASM), which sidesteps the two pdfjs integration issues above.

## 8. Preliminary verdict

- Payload **handles real logic**, it's not just a pretty CRUD: the PDF pipeline (hooks + Jobs Queue + file processing) ran end-to-end and proves it.
- Good fit for **content-heavy** products on a Next.js / TypeScript stack, where having admin + model + API in one place saves a lot.
- Entry cost: ESM, the type-gen step, and the learning curve of the jobs and access-control model.

---

### Appendix: how to reproduce locally

```bash
npx payload generate:types   # regenerate payload-types.ts
npm run dev                  # boots; /admin brings up the panel
# create the first admin user, then an Author, then a Book,
# upload a PDF to the `pdf` field and save,
# wait ~1 min (autoRun) → BookPages + WebP images + cover appear
```

### Appendix: screenshots

- `docs/screenshots/payload-dashboard-12-collections.png` — the 12 collections in the admin.
- `docs/screenshots/payload-bookpages-generated.png` — the 5 pages generated from the uploaded PDF.
