# Cross-cutting design directives — PlayasMurcia UI review (2026-04-02)

Audited with desktop + mobile full-page screenshots against `http://localhost:3000`. Sources: `src/features/beaches/beach-card.tsx`, `src/features/beaches/nearby-carousel.tsx`, `src/routes/explorar/index.tsx`, `docs/ui-guidelines.md`.

## Design Directive: Cross-cutting

### Critical (must fix)

_None identified in this pass — no broken navigation or illegible primary copy site-wide._

### Important (should fix)

- **Listing cards with missing photos read as “broken”**: On `/explorar`, `/municipios/cartagena`, `/colecciones/mar-mediterraneo`, many `BeachCard` tiles show a flat `bg-gray-100` area (`beach-card.tsx` ~53–61) because `ResponsiveImage` has no asset. The grid looks like failed loads, not intentional empty states.
  **Fix**: Introduce a **designed fallback** inside the 3:2 media frame: subtle wave/sand pattern or low-contrast illustration, optional “Sin foto” caption in `text-xs text-gray-500`, keep exact aspect ratio so the grid does not jump. Apply the same treatment in `nearby-carousel.tsx` (~39–46) where thumbnails are especially prominent on the beach detail page.

- **Explorer hero count vs toolbar count can disagree**: Hero copy uses `beaches.length` (`explorar/index.tsx` ~290–291) while the toolbar shows `allFiltered.length` (~330–334). When the user types in `SearchBar`, the hero still claims the full catalogue size.
  **Fix**: If `filters.q?.trim()` or any facet filter is active, either (a) change hero to “Mostrando **N** de **total** playas” or (b) keep “Filtra entre {total}” but add a second line under the search field with the current result count. Do not show two different numbers without explanation.

### Refinement (nice to have)

- **Dev-only overlays in screenshots**: TanStack Router Devtools can sit above content (e.g. first municipality card on `/municipios`). Ensure z-index/position does not compete with primary content in production builds; document for QA screenshots.

- **Footer data attribution contrast**: `site-footer.tsx` ~106–107 uses `text-ocean-400` / `text-ocean-500` on `bg-ocean-900`. Verify combined contrast ≥ 4.5:1 for the legal line; bump to `text-ocean-200` if measurement fails.

### What works well

- **Card system** is consistent: ring, radius, hover lift, tag pills, and weather/occupancy chips match `docs/ui-guidelines.md` motion and hierarchy.
- **Nav + footer** structure repeats predictably across routes; breadcrumb placement below hero matches guidelines.

**Severity summary:** Critical: 0, Important: 2, Refinement: 2
