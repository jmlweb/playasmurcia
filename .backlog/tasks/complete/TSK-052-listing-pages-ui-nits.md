---
id: TSK-052
title: Listing Pages UI Nits (Post–UI Review)
status: complete
priority: P3
tags: [styling]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Listing Pages UI Nits (Post–UI Review)

## Description

As a visitor on municipality, collection, and explorer listings, I want responsive layouts and data labels to stay readable without raw machine strings or cramped grids.

## Acceptance Criteria

- [x] **Municipios index**: Services use `service.name` (proper Spanish names from data) — no raw IDs visible
- [x] **Municipio detail**: Added `flex-wrap gap-3` to count + sort toolbar to prevent overlap at narrow widths
- [x] **Explorar**: Filter panel is modal below `lg`, results grid stacks at `sm` — no cramping between `md`-`lg`; toolbar already uses `flex-wrap gap-3`
- [x] **Colecciones index** (optional): Cards use distinct hues per collection — adequate separation

## Context

UI review 2026-03-29. Page directives: `.backlog/reports/complete/RPT-019-municipios-index-municipios-ui-review.md`, `.backlog/reports/complete/RPT-018-municipality-detail-municipiosslug-ui-review.md`, `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md`, `.backlog/reports/complete/RPT-006-coleccin-detail-design-directive-ui.md`, `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md`. Spanish spelling for shared components is task **#050**.

## Notes

- Task **035** may supersede part of municipios card layout; avoid conflicting edits.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #052)
