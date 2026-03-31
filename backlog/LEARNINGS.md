# Learnings

Insights and discoveries made during development. Each learning is linked to the task where it was discovered.

## Database & Data

- **33% AEMET → 100% Open-Meteo** — Only 65 of 194 beaches have `aemetId`. Using coordinates (lat/lng) with Open-Meteo as fallback covers 100% without an API key. AEMET remains the primary source where it exists. _(Task 028)_
- **Composite recommendation score** — A single metric (e.g. length or services) does not reflect real beach quality. Combining internal signals (services 30%, accessibility 15%, blue flag 15%, length 15%, children 10%, photos 10%, shade 5%) with external ones (Google Places, OSM) yields a more reliable ranking. _(Task 039)_

## Frontend & UI

- **Component modularization: hybrid, not screen-only** — Organizing everything by “screen” duplicates what `src/routes/` already encodes and splits the listing pattern shared by explorar, municipality (`$slug`), and collection (`$slug`). Adopted layout: `src/components/layout/` (chrome: breadcrumb, page-hero, site-footer), `src/components/ui/` (generic: icons, responsive-image, empty-state), `src/features/listing/` (pagination, sorting, filters, search, page meta), `src/features/beaches/` (beach domain: card, gallery, map, weather, grids, etc.). Imports via `@/features/...` and `@/components/layout|ui/...`. Colocating pieces used only on beach detail under `routes/playas/` is optional; verify TanStack Router does not treat them as routes. See `docs/architecture.md` (project structure and UI ↔ routes flow).
- **Low-value sections belong out** — “Mares” and “Comparar” were added (Tasks 015/016) and later removed because they diluted the main flows (explorar, colecciones, municipios). Prefer folding content into Colecciones over new sections with little payoff.
- **Progressive loading > classic pagination** — “Load more” with progressive batch sizes gives better UX than numbered pagination on beach lists. Users see results immediately and choose when to load more. _(Task 038)_

## Infrastructure & Deploy

- **workerd is not Node** — The Cloudflare Vite plugin runs SSR on workerd, not Node. `@libsql/client` resolves to the web client and only supports remote URLs (`libsql:`, `https:`, `http:`). `file:./local.db` yields `URL_SCHEME_NOT_SUPPORTED`. For local dev use `turso dev --db-file local.db --port 8181`. _(Tasks 001, 003)_
- **Per-isolate cache is ephemeral** — An in-memory `Map` is lost across requests on Workers because each request may hit a new isolate. Use `caches.default` (Cloudflare Cache API) for durable edge caching, with a `Map` fallback for local dev where `caches` is missing. _(Task 026)_
- **`.env` vs `.dev.vars`** — workerd does not read `.env` automatically; Cloudflare uses `.dev.vars` for secrets in local development. If env vars never reach the runtime, check this first. _(Task 001)_

## SEO & Performance

(No learnings yet)

## General

- **Diagnose before changing code** — DB connection failures (expired token, schema drift, wrong URL) are not fixed by tweaking imports in `client.ts` or `vite.config.ts`. First isolate: auth (401)? schema (missing column)? runtime (URL scheme)? The fix is usually regenerating the token or syncing the schema, not arbitrary code changes. _(After 5+ unnecessary edits in one debug session)_
