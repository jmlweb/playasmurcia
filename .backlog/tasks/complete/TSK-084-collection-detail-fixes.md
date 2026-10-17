---
id: TSK-084
title: Collection Detail Page Fixes
status: complete
priority: P3
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
started: 2026-03-30
completed: 2026-03-30
---

# Collection Detail Page Fixes

## Description

As a visitor viewing a collection, I want correct Spanish text, sorting, and polished UI so that the page feels complete and professional.

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

## Context

Collection-detail report and coleccion-detail report identified missing accents in meta titles (SEO impact), no sort functionality, and weak back-link styling.

## Source Reports

- `.backlog/reports/complete/RPT-008-collection-detail-coleccionesslug-ui-review.md` — COD1–COD5
- `.backlog/reports/complete/RPT-006-coleccin-detail-design-directive-ui.md` — CD1–CD3

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #084)
