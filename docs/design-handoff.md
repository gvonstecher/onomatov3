# Design Handoff — Onomato Frontend

For the design pass: adjust existing pages toward the Figma (**"Onomato - pantallas terminadas"**) and create designs for the pages that don't have one yet.

## How the frontend is built

- **Next.js App Router**, server components. Pages live under `src/app/(app)/`.
- **Data comes from Payload** via the Local API (`getPayload` + `payload.find`). Don't change the data fetching — only markup/styles.
- **Styling: Tailwind CSS.** Reusable UI is in `src/components/` (`layout/`, `book/`, `author/`, `actions/`, `forms/`).
- **Custom theme tokens** (see `tailwind.config.cjs`): `rojo`, `amarillo`, `grisBackground`, `grisClaro`, `grisTopo`. Prefer these over raw hex.
- `/admin` is the Payload CMS backend UI — **out of scope** for design.

## Page inventory

| Route | Purpose | Design state |
|-------|---------|--------------|
| `/` | Home / catalog (hero, latest books, latest authors, tags) | Existing — **align to Figma** |
| `/author/[author]` | Public author page (header, books, sidebar) | Existing — **align to Figma** |
| `/book/[book]` | Book detail (cover, credits, buy/read, other titles) | Existing — **align to Figma** |
| `/book/[book]/read` | In-browser page-by-page reader + paywall teaser | Basic/functional — **needs design** |
| `/dashboard/profile` | User dashboard (your books, follows, author sidebar) | Basic — **needs polish** |
| `/dashboard/author/edit` | Author profile form (name, bio, photos, socials) | Plain form — **needs design** |
| `/dashboard/book/create` | Create a book (title, cover, **PDF dropzone**, price) | Plain form — **needs design** |
| `/login` | Native email/password login | Minimal placeholder — **needs design** |
| `/p/[slug]` | Decoupled block-rendered page (ACF-style blocks) | Demo with **inline styles** — **redesign in Tailwind** |

## Notes per area

- **Book detail** now shows a **credits line** (e.g. "Autor (rol)") under the title — multiple authors with roles are possible.
- **Reader** (`/read`) renders every page image and, when not owned, shows free preview pages + a gradient paywall overlay with the buy button. Admin/editor roles bypass the paywall.
- **Block renderers** for `/p/[slug]` live in `src/app/(app)/p/[slug]/blocks/` (`HeroV2Block`, `ProductReelBlock`). They currently use inline styles as a proof of concept — these are the ACF-style blocks (Hero V2, Product Reel) and should be rebuilt to match the Figma block designs.
- **Prices** are stored in cents; the UI divides by 100 for display (pesos).
- **Images**: covers/author photos come from the `media` collection; generated book pages from `page-images`. Both expose a `.url`.
