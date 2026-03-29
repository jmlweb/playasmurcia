# Task #060: Global Shell UI Review Follow-up

## Metadata

- **Status**: done
- **Priority**: P2 - Next
- **Slice**: Styling
- **Created**: 2026-03-29
- **Completed**: 2026-03-29
- **Blocked by**: -

## User Story

As a visitor, I want global pages (404, navigation, metadata) and municipality service chips to look polished, readable, and orthographically correct in Spanish.

## Context

UI review 2026-03-29. See `reports/done/cross-cutting.md` for full directives (404 contrast, `ServiceIcon` lookup, nav focus). See `reports/done/coleccion-detail.md` for meta title accent. Beach orientation copy: `reports/done/beach-detail.md`. Listing follow-ups remain in **#052**; beach layout in **#051**.

## Acceptance Criteria

- [x] **404 page**: `notFoundComponent` in `src/routes/__root.tsx` — replace `text-ocean-200` on the large “404” with a darker token (`text-ocean-700` or `text-gray-900`) on `bg-sand-50`; keep hierarchy with heading and body copy per `docs/ui-guidelines.md` empty-state contrast goals
- [x] **ServiceIcon**: Resolve SVG by `service.id` first in `src/components/icons.tsx` + call sites (e.g. `src/routes/municipios/index.tsx`); use legacy `icon` field only as fallback; no raw machine tokens visible in chips
- [x] **Nav “Descubrir” trigger**: `NavDropdown` `Popover.Trigger` in `__root.tsx` — add `focus-visible` ring consistent with `docs/ui-guidelines.md` (buttons pattern; offset readable on `bg-nav`)
- [x] **Collection meta orthography**: `src/routes/colecciones/$slug.tsx` — `Coleccion` → `Colección` in meta / not-found title strings
- [x] **Beach orientation**: Map `orientation` to Spanish labels in UI (e.g. `east` → `Este`) via `practical-info-card` or shared helper; do not render raw schema values

## Notes

- **#058**: Consider adding dropdown panel link focus treatment if not covered when implementing modal/dropdown a11y.
- Re-run `pnpm check` and spot-check keyboard focus on nav after changes.
