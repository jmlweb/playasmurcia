# Municipios index design directive (UI review 2026-03-29)

**URL**: `/municipios` — `src/routes/municipios/index.tsx`

## Design Directive: Municipios index

### Critical (must fix)

- **Service chip labels / icons**: See `reports/done/cross-cutting.md` — `ServiceIcon` + `service.icon` mismatch causes raw tokens adjacent to Spanish names.

### Important (should fix)

- **Card visual weight**: White cards with `ring-1 ring-gray-200/60` are on-brand; municipality cards without photography (pending **#035**) still feel slightly “admin table” compared to beach cards. Acceptable short-term if **#035** delivers imagery.

### Refinement (nice to have)

- **Service pill density**: When four services wrap, vertical rhythm tightens; consider `gap-1.5` or smaller type only if line-height stays ≥1.4 for `text-xs`.

### What works well

- Grid responsiveness (`xl:grid-cols-3`), blue-flag callout, and “Ver playas →” pattern are consistent.

**Severity summary**: Critical: 1 (cross-cutting), Important: 1, Refinement: 1

**Note**: Spanish `name` for services in data is already correct in `data/services.json`; the visible bug is icon resolution, tracked with cross-cutting / **#052** overlap.
