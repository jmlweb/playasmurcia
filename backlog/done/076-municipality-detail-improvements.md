# Task #076: Municipality Detail Page Improvements

## Metadata

- **Status**: done
- **Priority**: P2 - Should
- **Slice**: UI
- **Created**: 2026-03-30
- **Completed**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor viewing a municipality's beaches, I want pagination, sorting, and consistent layout so that I can efficiently browse even large municipalities.

## Context

Municipality detail report flagged Cartagena rendering 69 beach cards simultaneously with no pagination — a performance disaster on mobile. Also missing sort functionality and has layout inconsistencies.

## Acceptance Criteria

- [x] Add pagination to municipality detail page (Cartagena has 69 beaches)
- [x] Add `SortSelect` dropdown above the beach grid
- [x] Move breadcrumb out of dark hero to below-hero light content area (currently the only page breaking this pattern)
- [x] Increase hero padding from `py-12 sm:py-16` to `py-14 sm:py-18 lg:py-20`
- [ ] Add municipality description line in hero (requires `description` field in data)
- [x] Fix grid gap inconsistency: `gap-6 sm:gap-5 xl:gap-6` → `gap-5 xl:gap-6`
- [x] Increase "Ver todos los municipios" back link to pill button style
- [x] Align pagination + back link spacing with collection-detail

## Source Reports

- `reports/done/municipality-detail.md` — MUD1–MUD7
- `reports/done/municipio-detail.md` — MD1, MD2

## Notes

Remaining item (municipality description) tracked in #035.
