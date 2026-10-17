---
id: TSK-076
title: Municipality Detail Page Improvements
status: complete
priority: P2
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Municipality Detail Page Improvements

## Description

As a visitor viewing a municipality's beaches, I want pagination, sorting, and consistent layout so that I can efficiently browse even large municipalities.

## Acceptance Criteria

- [x] Add pagination to municipality detail page (Cartagena has 69 beaches)
- [x] Add `SortSelect` dropdown above the beach grid
- [x] Move breadcrumb out of dark hero to below-hero light content area (currently the only page breaking this pattern)
- [x] Increase hero padding from `py-12 sm:py-16` to `py-14 sm:py-18 lg:py-20`
- [ ] Add municipality description line in hero (requires `description` field in data)
- [x] Fix grid gap inconsistency: `gap-6 sm:gap-5 xl:gap-6` → `gap-5 xl:gap-6`
- [x] Increase "Ver todos los municipios" back link to pill button style
- [x] Align pagination + back link spacing with collection-detail

## Context

Municipality detail report flagged Cartagena rendering 69 beach cards simultaneously with no pagination — a performance disaster on mobile. Also missing sort functionality and has layout inconsistencies.

## Source Reports

- `.backlog/reports/complete/RPT-017-design-directive-municipality-detail.md` — MUD1–MUD7
- `.backlog/reports/complete/RPT-018-municipality-detail-municipiosslug-ui-review.md` — MD1, MD2

## Notes

Remaining item (municipality description) tracked in #035.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #076)
