# Task #084: Collection Detail Page Fixes

## Metadata

- **Status**: completed
- **Priority**: P3 - Nice
- **Slice**: UI
- **Created**: 2026-03-30
- **Started**: 2026-03-30
- **Completed**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor viewing a collection, I want correct Spanish text, sorting, and polished UI so that the page feels complete and professional.

## Context

Collection-detail report and coleccion-detail report identified missing accents in meta titles (SEO impact), no sort functionality, and weak back-link styling.

## Acceptance Criteria

- [x] Fix `Coleccion` → `Colección` (missing accent) in `colecciones/$slug.tsx` lines 77, 82 — affects meta title and SEO
- [x] Ensure hero label also uses accented form in not-found state
- [x] Add `SortSelect` component above grid (especially for collections >15 beaches)
- [x] Remove or replace generic "Coleccion" hero label with descriptive category tag
- [x] Increase beach count prominence from `text-sm text-ocean-300` to badge style
- [x] Style "Volver a colecciones" as pill button instead of weak text link
- [x] Upgrade empty state from plain `<p>` to full component (icon + heading + description + dashed border)
- [x] Align sort + pagination row spacing with Explorer page

**Note:** 6 of 8 items completed in cross-cutting UI fixes (#079). Remaining: hero label replacement and beach count badge styling.

## Source Reports

- `reports/done/collection-detail.md` — COD1–COD5
- `reports/done/coleccion-detail.md` — CD1–CD3
