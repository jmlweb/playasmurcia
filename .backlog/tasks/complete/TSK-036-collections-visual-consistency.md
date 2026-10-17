---
id: TSK-036
title: Collections Page Visual Consistency
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-28
---

# Collections Page Visual Consistency

## Description

As a visitor browsing collections, I want visually distinct cards that help me quickly identify each collection's theme.

## Acceptance Criteria

- [ ] Add icons to thematic collection cards (icon + colored container matching each theme) to match the sea collection card pattern
- [ ] Unify sea and thematic card internal layouts (both should have icon + title row, description, footer)
- [ ] Increase section headings "Por mar" / "Por tematica" using the established label + h2 pattern
- [ ] Replace generic "Coleccion" hero label on collection detail with something more descriptive or remove it
- [ ] Give beach count in collection detail hero more visual prominence (badge or larger text)
- [ ] Upgrade collection detail empty state to match explorer/municipality pattern (icon + heading + dashed border)

## Context

UI review (2026-03-28) found thematic collection cards lack visual differentiation, section headings are undersized, and empty states are inconsistent. See `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md` and `.backlog/reports/complete/RPT-008-collection-detail-coleccionesslug-ui-review.md` for full directives.

## Notes

- Icons for thematic collections could be emoji or SVG — match the sea card treatment
- See `.backlog/reports/complete/RPT-007-colecciones-index-colecciones-ui-review.md` for specific icon/color suggestions

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #036)
