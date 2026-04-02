# Collection detail (`/colecciones/$slug`) — UI review directive

Screenshot: `/tmp/ui-review-colecciones-mar-mediterraneo.png`, `/tmp/ui-review-colecciones-mar-mediterraneo-mobile.png`. Route: `src/routes/colecciones/$slug.tsx`.

## Design Directive: Collection detail

### Critical (must fix)

_None._

### Important (should fix)

- **Beach count pill in hero**: `colecciones/$slug.tsx` ~131–133 uses a rounded pill with `bg-ocean-500/30` and `text-ocean-100`. Visually this can read like a **link**; ensure it is not confused with navigation.
  **Fix**: If it is non-interactive, use `role="text"` / remove hover styles; optionally prefix with a small beach icon for semantic clarity. If it should jump to results, make it a `button` or `a` with full focus ring.

- **Listing photo gaps**: Same `BeachCard` placeholder issue — see cross-cutting directive.

### Refinement (nice to have)

- **Breadcrumb + sort row**: Sort is right-aligned alone; consider placing sort on the same row as an optional “Vista” toggle later — not required now.

### What works well

- **Hero + long description** for “Mar Mediterráneo” balances romance and utility; count pill reinforces scope.
- **Back link** “Volver a colecciones” gives clear escape hatch.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
