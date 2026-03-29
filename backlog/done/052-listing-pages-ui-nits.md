# Task #052: Listing Pages UI Nits (Post–UI Review)

## Metadata

- **Status**: done
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-29
- **Completed**: 2026-03-29
- **Blocked by**: -

## User Story

As a visitor on municipality, collection, and explorer listings, I want responsive layouts and data labels to stay readable without raw machine strings or cramped grids.

## Context

UI review 2026-03-29. Page directives: `reports/done/municipios-index.md`, `reports/done/municipio-detail.md`, `reports/done/colecciones-index.md`, `reports/done/coleccion-detail.md`, `reports/done/explorar.md`. Spanish spelling for shared components is task **#050**.

## Acceptance Criteria

- [x] **Municipios index**: Services use `service.name` (proper Spanish names from data) — no raw IDs visible
- [x] **Municipio detail**: Added `flex-wrap gap-3` to count + sort toolbar to prevent overlap at narrow widths
- [x] **Explorar**: Filter panel is modal below `lg`, results grid stacks at `sm` — no cramping between `md`-`lg`; toolbar already uses `flex-wrap gap-3`
- [x] **Colecciones index** (optional): Cards use distinct hues per collection — adequate separation

## Notes

- Task **035** may supersede part of municipios card layout; avoid conflicting edits.
