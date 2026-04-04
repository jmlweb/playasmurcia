# Architecture, modularity, and SOLID — improvement proposals

**Scope:** PlayasMurcia (`v3`), TypeScript/React/TanStack Start, data via `src/lib/db-data.ts` and Drizzle.

**Purpose:** Record a concise assessment and actionable improvements to modularity and alignment with SOLID-style design, without prescribing unnecessary abstraction.

---

## Executive summary

The codebase has a **clear folder structure** (`routes/`, `features/`, `components/`, `lib/`, `db/`) and **keeps database access out of presentational components** in favor of server functions and `db-data`. Modularity is **adequate for current scale**.

Improvements should focus on **reducing oversized modules**, **deduplicating cross-route logic**, and **narrowing dependency surfaces** where it improves maintainability. Full “enterprise” SOLID (e.g. dependency injection everywhere) is **not required** for this product.

---

## Current strengths

- **Layering:** Routes orchestrate loaders; reusable UI lives under `features/` and `components/`; persistence is centralized around `src/lib/db-data.ts` and `src/db/`.
- **Domain-oriented UI:** Beach and listing concerns are split into focused components (cards, filters, widgets) with tests in several areas.
- **Pure logic extraction:** Filtering and sorting live in `src/lib/beach-filters.ts`; collections logic is separated in `src/lib/collections.ts`.
- **Documentation:** [docs/architecture.md](../../docs/architecture.md) reflects the intended structure.

---

## Issues and proposed improvements

### 1. `db-data.ts` — multiple responsibilities in one module

**Issue:** `src/lib/db-data.ts` combines DB mapping, query functions, recommendation scoring, occupancy adjustment, and related helpers in a single large file (~500 lines). This strains **single responsibility** and makes navigation and testing harder.

**Proposals:**

- Split into cohesive modules, for example:
  - **`beach-mapper.ts`** (or `mappers/beach.ts`) — `mapBeachFromDB` and related mapping-only code.
  - **`beach-queries.ts`** — exported async getters (`getAllBeaches`, `getBeachBySlug`, `getFeaturedBeaches`, etc.).
  - **`beach-scoring.ts`** (optional) — `computeRecommendationScore` and any scoring-only helpers.
  - **`occupancy.ts`** (optional) — `adjustOccupancy` and seasonal rules if kept separate from mapping.
- Keep **`db-data.ts` as a thin barrel** (`export * from './beach-queries'`, etc.) **only if** the team wants a stable import path; otherwise update imports once and delete the barrel to avoid a second “god” file.

**SOLID tie-in:** Improves **S** (single responsibility) and slightly **I** (smaller, purpose-specific imports).

---

### 2. Large route and root files

**Issue:** `src/routes/index.tsx`, `src/routes/explorar/index.tsx`, and `src/routes/__root.tsx` are large files that mix data orchestration, derived structures (e.g. nav aggregates), and substantial JSX.

**Proposals:**

- Extract **pure data builders** into `src/lib/` (e.g. `municipality-nav.ts`, `nav-characteristics.ts`) so server functions and components only call named functions.
- Split **presentational chunks** into components under `features/` or `components/layout/` (e.g. home sections, explorer layout) with props driven by loader data.
- For `__root.tsx`, separate **shell layout** (header, footer slot, outlet) from **nav data fetching** and **mega-menu / mobile menu** UI into dedicated components + one small `fetchNavData` helper module if desired.

**SOLID tie-in:** Strengthens **S** for route modules; keeps routes as thin orchestration.

---

### 3. Duplicated navigation / statistics logic

**Issue:** Similar patterns appear in more than one place (e.g. municipality nav with beach counts, characteristic counts for collections links), increasing drift risk.

**Proposals:**

- Implement **one function** (or small module) that, given `beaches` and `municipalities`, returns `NavMunicipality[]` (and similarly for “characteristic” counts + hrefs).
- Reuse it from **`__root`** and **`index`** (and any other route that needs the same shape).

**SOLID tie-in:** **DRY** and a single place to change business rules for those counts.

---

### 4. Wide imports from `db-data` (interface segregation)

**Issue:** Route handlers import many named functions from one module. TypeScript does not enforce “minimal dependency” per route.

**Proposals (incremental):**

- After splitting `db-data`, routes import only from **small modules** (queries vs mappers), which naturally narrows the surface.
- Optional: introduce **per-route or per-feature loaders** in `src/lib/loaders/home.ts`, `explorar.ts`, etc., that encapsulate `Promise.all` and return the exact DTO the page needs. Routes then call one function per page.

**SOLID tie-in:** Moves toward **I** (clients depend on smaller, specific APIs) without introducing Java-style interfaces everywhere.

---

### 5. Dependency inversion (pragmatic level)

**Issue:** Everything depends on concrete `db-data`, `open-meteo`, and Drizzle. That is normal for this stack but limits swapability (e.g. tests, alternate weather provider).

**Proposals (only if needed):**

- Prefer **testing** with real functions against **test DB** or **fixtures** (already partially done in `db-data.test.ts`) over heavy abstractions.
- If a second weather backend or mock-heavy CI is needed later, introduce a **small function type** or module boundary (`fetchCardWeather`) implemented by `open-meteo.ts`, rather than a full DI container.

**SOLID tie-in:** **D** only where a real second implementation or test seam is required.

---

## Suggested priority order

1. **Deduplicate** shared nav / municipality / characteristic builders (quick win, fewer bugs).
2. **Split `db-data.ts`** by mapping vs queries vs (optional) scoring/occupancy.
3. **Decompose** the heaviest route files (`__root`, `explorar`, `index`) into lib helpers + subcomponents.
4. **Page-level loaders** in `lib/loaders/*` if orchestration noise remains high after the above.

---

## Out of scope / non-goals

- Rewriting the app around **class-based repositories** or a **DI framework**.
- Changing **TanStack Router** or **data source** architecture without product need.
- Large refactors **without** running `pnpm build`, `pnpm test`, and `pnpm check` after each meaningful step ([AGENTS.md](../../AGENTS.md)).

---

## Next steps (process)

1. Add backlog task(s) under `backlog/pending/` that reference this report once filed.
2. After tasks exist, move this file to `reports/done/` and link the **final path** from each task ([AGENTS.md](../../AGENTS.md) reports workflow).
