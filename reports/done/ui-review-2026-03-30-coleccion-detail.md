# UI review — collection detail (`/colecciones/$slug`)

Sample: `http://localhost:3000/colecciones/mar-mediterraneo`. Source: `src/routes/colecciones/$slug.tsx`.

## Design Directive: Colección detail

### Critical (must fix)

- None.

### Important (should fix)

- **Hero badge “151 playas”** + grid alignment with Explorer listing—consistent module; same placeholder image issue as other listings.
  **Fix**: Shared listing improvements (`078`, `082`, `017`).

- **Pagination** with ellipsis (1 … 13): good density; confirm focus ring on current page button meets visibility on ocean/sand contexts.
  **Fix**: Use same `focus-visible` token as Explorer pagination.

### Refinement (nice to have)

- **Collection description** in hero: line length comfortable; maintain max-width if body copy grows.

### What works well

- **Breadcrumb + sort** row matches municipality detail pattern—good cross-page consistency.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
