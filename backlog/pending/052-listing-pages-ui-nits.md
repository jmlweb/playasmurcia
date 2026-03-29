# Task #052: Listing Pages UI Nits (Post–UI Review)

## Metadata

- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor on municipality, collection, and explorer listings, I want responsive layouts and data labels to stay readable without raw machine strings or cramped grids.

## Context

UI review 2026-03-29. Page directives: `reports/done/municipios-index.md`, `reports/done/municipio-detail.md`, `reports/done/colecciones-index.md`, `reports/done/coleccion-detail.md`, `reports/done/explorar.md`. Spanish spelling for shared components is task **#050**.

## Acceptance Criteria

- [ ] **Municipios index**: Confirm every `Service` shown in municipality cards has a proper Spanish `name` in data (no raw icon id like `restaurant` visible); fix at DB/seed/schema source if needed
- [ ] **Municipio detail**: At ~375px width, breadcrumbs + “Ordenar por” row does not overlap; adjust flex/wrap/gap if it does
- [ ] **Explorar**: If results grid is cramped between `md` and `lg`, stack filters above results one breakpoint earlier; align spacing under `PageInfo` with municipality/collection listing pages
- [ ] **Colecciones index** (optional): If two adjacent thematic cards are too close in hue, nudge one accent for scanning (see directive)

## Notes

- Task **035** may supersede part of municipios card layout; avoid conflicting edits.
