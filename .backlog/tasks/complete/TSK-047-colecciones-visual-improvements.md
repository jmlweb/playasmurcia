---
id: TSK-047
title: Colecciones Index Visual Improvements
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-29
---

# Colecciones Index Visual Improvements

## Description

As a visitor browsing collections, I want the sea collections to feel more prominent than thematic ones, and I want the page sections to read cleanly.

## Acceptance Criteria

- [ ] Simplify section headings: use one heading per section instead of label + h2 (e.g., "Playas por mar" and "Colecciones tematicas")
- [ ] Differentiate sea collection cards from thematic: use larger icon (h-14 w-14), or add tinted background, or add subtle wave pattern to header
- [ ] Increase accent bar height from `h-2` to `h-2.5` for slightly more visual presence
- [ ] Standardize grid gaps: `gap-5 xl:gap-6` for both seas and thematic grids
- [ ] Reduce seas section `mb-14` to `mb-10` for tighter separation

## Context

UI review (2026-03-28) found section headings are redundant (label + heading say the same thing), sea cards lack visual differentiation from thematic cards, and accent bars could be slightly thicker. See `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md`.

## Notes

- See `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md` for full directive

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #047)
