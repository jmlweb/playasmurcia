# Learnings

Insights and discoveries made during development. Each learning is linked to the task where it was discovered.

## Database & Data

### L001: 33% AEMET → 100% Open-Meteo

**Date**: 2026-03-28 | **Task**: #028 Coordinate-Based Weather for All Beaches
**Context**: Only 65 of 194 beaches have `aemetId`, limiting weather coverage.
**Learning**: Using coordinates (lat/lng) with Open-Meteo as fallback covers 100% without an API key. AEMET remains the primary source where it exists.
**Action**: Implemented dual-source weather: AEMET by ID when available, Open-Meteo by coordinates for the rest.

### L002: Composite recommendation score

**Date**: 2026-03-28 | **Task**: #039 Recommendation Score and "Recomendados" Sort
**Context**: A single metric (e.g. length or services) does not reflect real beach quality.
**Learning**: Combining internal signals (services 30%, accessibility 15%, blue flag 15%, length 15%, children 10%, photos 10%, shade 5%) with external ones (Google Places, OSM) yields a more reliable ranking.
**Action**: Implemented weighted composite score used in "Recomendados" sort option.

## Frontend & UI

### L003: Component modularization — hybrid, not screen-only

**Date**: 2026-03-29 | **Task**: #043 Extract Shared UI Components
**Context**: Organizing everything by "screen" duplicates what `src/routes/` already encodes and splits the listing pattern shared by explorar, municipality, and collection pages.
**Learning**: Adopted layout: `src/components/layout/` (chrome), `src/components/ui/` (generic), `src/features/listing/` (pagination, sorting, filters), `src/features/beaches/` (beach domain). Imports via `@/features/...` and `@/components/layout|ui/...`.
**Action**: Documented in `docs/architecture.md` (project structure and UI-routes flow).

### L004: Low-value sections belong out

**Date**: 2026-03-27 | **Task**: #015/#016 Mediterranean vs Mar Menor / Beach Comparator
**Context**: "Mares" and "Comparar" were added and later removed because they diluted the main flows (explorar, colecciones, municipios).
**Learning**: Prefer folding content into Colecciones over new sections with little payoff.
**Action**: Removed both sections. Documented in INDEX.md "Removed tasks" and in memory.

### L005: Progressive loading > classic pagination

**Date**: 2026-03-28 | **Task**: #038 Large List Pagination
**Context**: Deciding between numbered pagination and progressive loading for beach lists.
**Learning**: "Load more" with progressive batch sizes gives better UX than numbered pagination. Users see results immediately and choose when to load more.
**Action**: Implemented progressive loading across all listing pages.

## Infrastructure & Deploy

### L006: workerd is not Node

**Date**: 2026-03-27 | **Task**: #001/#003 Turso Cloud Setup / Deploy to Production
**Context**: The Cloudflare Vite plugin runs SSR on workerd, not Node.
**Learning**: `@libsql/client` resolves to the web client and only supports remote URLs (`libsql:`, `https:`, `http:`). `file:./local.db` yields `URL_SCHEME_NOT_SUPPORTED`. For local dev use `turso dev --db-file local.db --port 8181`.
**Action**: Configured separate local (turso dev) and production (libsql: remote) database connections.

### L007: Per-isolate cache is ephemeral

**Date**: 2026-03-28 | **Task**: #026 Edge Caching for External API Calls
**Context**: An in-memory `Map` is lost across requests on Workers because each request may hit a new isolate.
**Learning**: Use `caches.default` (Cloudflare Cache API) for durable edge caching, with a `Map` fallback for local dev where `caches` is missing.
**Action**: Implemented dual-layer caching strategy.

### L008: `.env` vs `.dev.vars`

**Date**: 2026-03-27 | **Task**: #001 Turso Cloud Setup
**Context**: Environment variables weren't reaching the runtime.
**Learning**: workerd does not read `.env` automatically; Cloudflare uses `.dev.vars` for secrets in local development.
**Action**: Documented the distinction; use `.dev.vars` for local secrets.

## SEO & Performance

(No learnings yet)

## General

### L009: Diagnose before changing code

**Date**: 2026-03-27 | **Task**: (Debug session)
**Context**: DB connection failures (expired token, schema drift, wrong URL) led to 5+ unnecessary code edits.
**Learning**: First isolate the category: auth (401)? schema (missing column)? runtime (URL scheme)? The fix is usually regenerating the token or syncing the schema, not arbitrary code changes.
**Action**: Documented as a core workflow principle. See also memory: `feedback_diagnose_before_fixing.md`.
