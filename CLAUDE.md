# Onomato

## About the Project

Onomato is a book marketplace where authors publish their books and readers buy and read them online. Authors get a public profile and a dashboard to manage their books; readers browse the catalog, purchase via MercadoPago, and read purchased books page by page.

### Core Features

- **Authors & profiles**: public author pages with social media links; dashboard to edit profile and create/manage books.
- **Book catalog & reader**: browse books by author, view detail pages, and read purchased books page by page (`book/[book]/read`).
- **Checkout (MercadoPago)**: pay-per-book flow — create a payment preference, persist the order, and confirm via webhook.
- **Follows & votes**: users follow authors and books; books can be voted.
- **Media upload**: cover and book-page images uploaded via dropzone, processed with `sharp`, deduplicated by content hash, and stored on disk under `public/img/`.
- **Auth**: GitHub and Google OAuth via NextAuth (JWT sessions, Prisma adapter).

### Business Model

Readers pay per book through MercadoPago. Once a payment is confirmed by webhook, the order is marked as bought and the book becomes owned/readable for that user (tracked via `FollowedBook.bought`).

## Project Structure

| Folder | Stack | URL Path | Description |
|--------|-------|----------|-------------|
| `src/app/` | Next.js App Router | `/` | Pages and route handlers (server components by default). |
| `src/app/api/auth/[...nextauth]/` | NextAuth | `/api/auth/*` | NextAuth handler; config lives in `@/utils/auth`. |
| `src/app/api/checkout/` | MercadoPago + Prisma | `/api/checkout/*` | `generateLink` (creates MP preference) and `generateOrder` (persists `Order` + follows). |
| `src/app/api/notifyPayment/` | MercadoPago webhook | `/api/notifyPayment/*` | Receives MP payment notifications; records `Payment`, marks `Order`, upserts `FollowedBook`. |
| `src/app/api/file/` | sharp + object-hash | `/api/file` | Authenticated image upload; resizes and stores hashed files in `public/img/`. |
| `src/app/author/[author]/` | RSC | `/author/:author` | Public author page. |
| `src/app/book/[book]/` | RSC | `/book/:book`, `/book/:book/read` | Book detail and reader. |
| `src/app/dashboard/` | RSC + forms | `/dashboard/*` | Author dashboard: edit profile, create books. |
| `src/components/` | React | — | UI by domain: `actions/`, `author/`, `book/`, `forms/`, `layout/`. |
| `src/providers/` | React context | — | `AuthProvider` (NextAuth session provider). |
| `src/utils/` | — | — | `connect.js` (Prisma singleton), `auth.js` (NextAuth options + `getAuthSession`). |
| `prisma/` | Prisma + PostgreSQL | — | `schema.prisma` and migration history. |
| `public/img/` | — | — | Uploaded media: `books/{id}/`, `authors/{id}/`, `users/{id}/` with content-hashed filenames. |

## Data Model

PostgreSQL via Prisma. Key models (see `prisma/schema.prisma` for full definitions):

- **Auth (NextAuth)**: `User`, `Account`, `Session`, `VerificationToken`.
- **Catalog**: `Author`, `AuthorSocialmedia`, `Book`, `BookPage`, `Tag`, `BookTag`, `File`.
- **Engagement**: `BookVote`, `FollowedAuthor`, `FollowedBook` (`bought` flag = ownership after payment).
- **Commerce**: `Order`, `Payment` (linked to MercadoPago).

## Conventions

- **Path alias**: `@/*` → `./src/*` (see `jsconfig.json`). Import as `@/utils/connect`, `@/components/...`.
- **Prisma client**: always import the singleton from `@/utils/connect` (it reuses a global instance in dev to avoid connection storms). Never instantiate `new PrismaClient()` ad hoc.
- **Auth**: use `getAuthSession()` from `@/utils/auth` in server code; `authOptions` defines providers and the JWT callback that injects `user.id` into the session.
- **Route handlers**: App Router style — export `POST`/`GET` async functions returning `NextResponse`. Protected routes check `getServerSession(authOptions)` and return 401 when absent.
- **Images**: filenames are content hashes (`object-hash`), stored under `public/img/{type}/{id}/`. Reference uploaded files by their stored hash, not original names.
- **Styling**: Tailwind CSS (`globals.css` with `@tailwind` directives); custom theme tokens exist (e.g. `bg-grisBackground`).
- **Component naming**: existing components mix English and Spanish (e.g. `comprarBtn`, `descargarBtn`, `loginBtn`). This is the legacy reality; prefer English for new code but follow nearby files when extending a folder.

## Code Language Rule

- **Code identifiers**: English preferred for new code. Existing code mixes English and Spanish — match the surrounding file when editing.
- **User-facing text**: Spanish (the product targets Spanish-speaking readers).

## Local Setup Gotchas

- **Database**: local PostgreSQL (Homebrew `postgresql@16`). `DATABASE_URL` points to `localhost:5432/onomato`. The original remote Linode DB is dead. Recreate the schema with `npx prisma migrate deploy`.
- **Dependencies**: never copy `node_modules` across machines/OS — it loses Unix exec bits. Run `npm install` after cloning.
- **Dev server**: `npm run dev`; if ports 3000+ are taken it falls through to the next free port.
- **MercadoPago**: uses the legacy v1 SDK (`mercadopago@1.x`); deprecation warnings on install are expected.
- **Env vars**: `DATABASE_URL`, `GITHUB_ID`/`GITHUB_SECRET`, `GOOGLE_ID`/`GOOGLE_SECRET`, `MERCADO_PAGO_ACCESS_TOKEN`, `BASE_FETCH_URL`/`NEXT_PUBLIC_BASE_FETCH_URL`. Kept in `.env` (gitignored — never commit it).

## Documentation Agent

All documentation tasks (creating, updating, or auditing `CLAUDE.md` and `AGENTS.md` files) should be delegated to the `@doc-agents` subagent (`.claude/agents/doc-agents.md`).

**When to invoke `@doc-agents`:**
- A new folder or module is created → `@doc-agents document <path>`
- A folder's code changes significantly → `@doc-agents document <path>`
- Unsure what's documented → `@doc-agents audit the project docs`
- Setting up a new project → `@doc-agents init`

**Prefer delegating** `AGENTS.md`/`CLAUDE.md` work to `@doc-agents`, which follows this project's documentation structure.
