# Municipality detail (`/municipios/$slug`) — UI review directive

Screenshot: `/tmp/ui-review-municipios-cartagena.png`, `/tmp/ui-review-municipios-cartagena-mobile.png`. Route: `src/routes/municipios/$slug.tsx`.

## Design Directive: Municipio detail

### Critical (must fix)

_None._

### Important (should fix)

- **Beach grid photo gaps**: Same missing-image gray blocks as explorer/collections — covered in `reports/done/cross-cutting.md`.
  **Fix**: Shared `BeachCard` media fallback.

- **Toolbar duplication**: “69 playas” appears near hero context and again above the grid next to sort — acceptable if typographic levels differ; if both use the same weight, **merge** into one strong count next to sort and drop the redundant line.

### Refinement (nice to have)

- **“Volver a municipios”**: Outlined button is clear; align horizontal padding with primary ocean pills elsewhere (`px-8`) for button family consistency.

### What works well

- **Photo hero** with municipality name and aggregate stats feels **local and authoritative**.
- **Pagination** matches explorer styling — good cross-page consistency.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
