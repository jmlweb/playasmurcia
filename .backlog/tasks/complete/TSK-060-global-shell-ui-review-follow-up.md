---
id: TSK-060
title: Global Shell UI Review Follow-up
status: complete
priority: P2
tags: [styling]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Global Shell UI Review Follow-up

## Description

As a visitor, I want global pages (404, navigation, metadata) and municipality service chips to look polished, readable, and orthographically correct in Spanish.

## Acceptance Criteria

- [x] **404 page**: `notFoundComponent` in `src/routes/__root.tsx` — replace `text-ocean-200` on the large “404” with a darker token (`text-ocean-700` or `text-gray-900`) on `bg-sand-50`; keep hierarchy with heading and body copy per `docs/ui-guidelines.md` empty-state contrast goals
- [x] **ServiceIcon**: Resolve SVG by `service.id` first in `src/components/icons.tsx` + call sites (e.g. `src/routes/municipios/index.tsx`); use legacy `icon` field only as fallback; no raw machine tokens visible in chips
- [x] **Nav “Descubrir” trigger**: `NavDropdown` `Popover.Trigger` in `__root.tsx` — add `focus-visible` ring consistent with `docs/ui-guidelines.md` (buttons pattern; offset readable on `bg-nav`)
- [x] **Collection meta orthography**: `src/routes/colecciones/$slug.tsx` — `Coleccion` → `Colección` in meta / not-found title strings
- [x] **Beach orientation**: Map `orientation` to Spanish labels in UI (e.g. `east` → `Este`) via `practical-info-card` or shared helper; do not render raw schema values

## Context

UI review 2026-03-29. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` for full directives (404 contrast, `ServiceIcon` lookup, nav focus). See `.backlog/reports/complete/RPT-006-coleccin-detail-design-directive-ui.md` for meta title accent. Beach orientation copy: `.backlog/reports/complete/RPT-004-beach-detail-playasslug-ui-review.md`. Listing follow-ups remain in **#052**; beach layout in **#051**.

## Notes

- **#058**: Consider adding dropdown panel link focus treatment if not covered when implementing modal/dropdown a11y.
- Re-run `pnpm check` and spot-check keyboard focus on nav after changes.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #060)
