# Task #073: Explorer UX Enhancements

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: UI
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor exploring beaches, I want intuitive filters and clear visual feedback so that I can efficiently narrow down my options.

## Context

UI audit (2026-03-29) and explorer reports identified several UX gaps: no active filter indication, dual FilterPanel rendering, and flat sidebar surface.

## Acceptance Criteria

- [x] Give filter sidebar a distinct surface (`bg-white rounded-2xl p-5 shadow-sm` or left border)
- [x] Add horizontal row of removable active filter chips between toolbar and grid
- [x] When filters active, change mobile filter button to "Filtros (3)" with highlighted style
- [x] Default first 2 filter groups (Municipality and Sea) to open on desktop
- [x] Add scroll indicator gradient at bottom of desktop sidebar when content overflows
- [x] Refactor `FilterPanel` to render once with CSS controlling desktop/mobile presentation
- [x] Add breadcrumb to Explorer page ("Inicio / Explorar playas")
- [x] Replace native `<select>` sort with custom Popover/Listbox matching site style
- [x] Validate layout at 900px and 1024px mid-breakpoints

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — I9, R6
- `reports/done/explorer.md` — EXP1–EXP8
- `reports/done/explorar.md` — EX1–EX3
