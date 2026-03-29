# Code Quality Audit — 2026-03-29

Full code style and architecture review of the PlayasMurcia v3 codebase.

## Overall Assessment

The codebase is in good shape: strict TypeScript, zero `any`, consistent functional patterns with named exports, proper TanStack Router usage, and clean separation of concerns. 20 issues found across 3 severity levels.

## Production Bugs (3)

1. **Batch weather cache collision** (`open-meteo.ts:187-189`) — Cache key is always `'batch'` regardless of which beaches are requested. Home caches ~12 featured beaches; Explorer then receives those 12 results for all 194 beaches. 182 beaches silently get no weather data.

2. **Duplicated slug functions** (`db-data.ts:263-269` + `slugs.ts:3-17`) — `beachToSlug` and `municipalityToSlug` exist identically in both files. Some routes import from one, some from the other. If one copy changes, URL matching breaks silently.

3. **Debounce timer leak** (`search-bar.tsx:15-26`) — Timer not cleared on unmount. If component unmounts during the 300ms window, `onChange` fires against stale parent.

## Architecture Issues (7)

4. **`getBeachBySlug` is O(n)** (`db-data.ts:254-258`) — Loads all beaches and scans linearly on every detail page. Should query by slug column directly.

5. **`<a>` instead of `<Link>`** (multiple files) — Dozens of navigation links use plain `<a>`, causing full page reloads. Affects `__root.tsx`, `colecciones/index.tsx`, `municipios/index.tsx`, `index.tsx`, and detail back-links.

6. **Magic numeric IDs in collections** (`collections.ts:40-166`) — Filter functions use raw numbers (`tags.includes(1)`, `services.includes(6)`) with no named constants. A schema migration that shifts IDs silently breaks all collections.

7. **No `errorComponent` on any route** — Database timeouts or Turso failures produce an uninformative default error boundary.

8. **Unvalidated external data** (`beach-status-112.ts:164-165`) — XML values from 112 service cast directly to TypeScript types without validation.

9. **Modal without focus trap** (`filter-panel.tsx:272-321`) — Mobile filter modal doesn't trap focus or lock body scroll.

10. **Incomplete ARIA on sort dropdown** (`sort-select.tsx:80-103`) — Uses `role="listbox"` promising keyboard navigation but only implements Escape.

## Maintainability (10)

11. **Sole default export** (`leaflet-map.tsx`) — Only file breaking the named-export convention. **Update (2026-03-29):** `LeafletMap` is a named export; `location-map.tsx` uses `lazy(() => import('…').then((m) => ({ default: m.LeafletMap })))`.
12. **Stale `'use client'` directive** (`sort-select.tsx:1`) — Next.js directive, meaningless in TanStack Start.
13. **Duplicated `OccupancyConfig`** (`beach-card.tsx` + `practical-info-card.tsx`) — Same domain concept, different shapes.
14. **Duplicated pagination logic** (3 route files) — Same `PAGE_SIZE`, `useState`, `slice`, `scrollTo` pattern repeated.
15. **Repeated array coercion in `validateSearch`** (`explorar/index.tsx:20-61`) — Same parsing 5 times.
16. **Non-null assertion** (`colecciones/$slug.tsx:98`) — Avoidable with a `Map` lookup.
17. **Truthy env check** (`responsive-image.tsx:33`) — `"false"` string would pass.
18. **Duplicated chevron SVGs** (4+ files) — Should be in `icons.tsx`.
19. **Missing focus indicator** (`photo-gallery.tsx:43`) — `tabIndex={0}` without `focus-visible` styles.
20. **Index as key** (`breadcrumb.tsx:9`) — Could use `item.href ?? item.label`.

## Summary

| Severity | Count |
|----------|-------|
| Production bug | 3 |
| Architecture | 7 |
| Maintainability | 10 |
| **Total** | **20** |

## Generated Tasks

- **#053** — Fix production bugs (cache, slug duplication, debounce)
- **#054** — Replace `<a>` with `<Link>` for client-side navigation
- **#055** — Optimize `getBeachBySlug` to direct DB query
- **#056** — Add error boundaries and validate external data
- **#057** — Fix magic numbers in collections
- **#058** — Accessibility fixes (focus trap, ARIA, keyboard nav)
- **#059** — Code consistency cleanup (exports, duplications, misc)
