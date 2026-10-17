---
id: TSK-073
title: Explorer UX Enhancements
status: complete
priority: P3
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Explorer UX Enhancements

## Description

As a visitor exploring beaches, I want intuitive filters and clear visual feedback so that I can efficiently narrow down my options.

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

## Context

UI audit (2026-03-29) and explorer reports identified several UX gaps: no active filter indication, dual FilterPanel rendering, and flat sidebar surface.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — I9, R6
- `.backlog/reports/complete/RPT-012-design-directive-explorer.md` — EXP1–EXP8
- `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md` — EX1–EX3

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #073)
