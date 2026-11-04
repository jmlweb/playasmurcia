---
id: TSK-146
title: Beach zones from ITREM locality labels
status: pending
priority: P2
tags: [data, external-source, feature]
created: 2026-11-04
source: manual
depends-on: []
---

# Beach zones from ITREM locality labels

## Description

Visitors think of the Murcia coast in zones (Lo Pagán, Santiago de la Ribera, Isla Plana), but beaches are only grouped by municipality. The existing `district` field cannot do this job: it has 60 values, only 1 in Cartagena and none in San Pedro del Pinatar.

ITREM beach pages (`https://itrem.carm.es/es/playa/<slug>-<code>/`) use the same ID as our beach `code` and show a locality line, for example `LO PAGAN (San Pedro del Pinatar)`, `ISLA PLANA (Cartagena)` or `COPE (Águilas)`. The line comes from the HTML pages, not from the open dataset `Playas.json`. The pages are Latin-1 encoded, so decode them before reading names.

Coverage measured on 2026-11-04: 148 of 193 beaches have a label, with 34 distinct values. 36 pages have no label, nearly all Cartagena calas, and 9 beaches have no page.

The labels mix localities and tourism areas, so do not import them blindly. La Manga spans two municipalities, with 18 labelled beaches each in Cartagena and San Javier.

Scope: the `zone` field, its display on the beach page, and grouping on the municipality page. Dedicated zone routes are out of scope and belong in a later task.

## Acceptance Criteria

- [ ] Curated zone list normalizes the 34 ITREM labels, separating localities from tourism areas (Calblanque is not La Manga)
- [ ] Every one of the 193 beaches has a zone or is explicitly listed as unresolved, with the 45 gaps reviewed by hand
- [ ] zone is stored in the DB and shown on the beach page
- [ ] Municipality page groups beaches by zone
- [ ] docs/data-schema.md updated and source cited

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).