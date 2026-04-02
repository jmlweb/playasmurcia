# Explorer (`/explorar`) — UI review directive

Screenshot: `/tmp/ui-review-explorar.png`, `/tmp/ui-review-explorar-mobile.png`. Route: `src/routes/explorar/index.tsx`.

## Design Directive: Explorar

### Critical (must fix)

_None._

### Important (should fix)

- **Hero subtitle vs results count**: See `reports/done/cross-cutting.md` — hero line ~290–291 vs toolbar ~330–334 when search/filters apply.
  **Fix**: Synchronized messaging for total vs filtered counts.

- **Filter sidebar vs content alignment**: Toolbar row mixes `FilterToggleButton`, count, and `SortSelect`. On desktop, vertical alignment with breadcrumb baseline could be tightened so the first screen of results starts higher.
  **Fix**: Set a single `items-baseline` or `items-center` row with consistent `mb-6` to `PageInfo` spacing; match `municipios/$slug` listing header pattern.

### Refinement (nice to have)

- **PageHero image**: `hero-explorar.png` with scrim matches brand; ensure optimized AVIF/WebP variants exist when `PLAYASMURCIA_OPTIMIZED_IMAGES` is on (parity with homepage picture element).

- **Active filter chips**: Chip row is clear; consider `max-h` + scroll on very small screens if many facets are selected.

### What works well

- **Split layout**: Filters + grid is familiar for directory UX; occupancy and weather on cards support scanning.
- **Pagination**: Visible page math (“Página X de Y”) supports orientation.

**Severity summary:** Critical: 0, Important: 2, Refinement: 2
