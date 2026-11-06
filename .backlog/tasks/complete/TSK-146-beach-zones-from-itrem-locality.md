---
id: TSK-146
title: Beach zones from ITREM locality labels
status: complete
priority: P2
tags: [data, external-source, feature]
created: 2026-11-04
source: manual
depends-on: []
started: 2026-11-06
completed: 2026-11-06
---

# Beach zones from ITREM locality labels

## Description

Visitors think of the Murcia coast in zones (Lo Pagán, Santiago de la Ribera, Isla Plana), but beaches are only grouped by municipality. The existing `district` field cannot do this job: it has 60 values, only 1 in Cartagena and none in San Pedro del Pinatar.

ITREM beach pages (`https://itrem.carm.es/es/playa/<slug>-<code>/`) use the same ID as our beach `code` and show a locality line, for example `LO PAGAN (San Pedro del Pinatar)`, `ISLA PLANA (Cartagena)` or `COPE (Águilas)`. The line comes from the HTML pages, not from the open dataset `Playas.json`. The pages are Latin-1 encoded, so decode them before reading names.

Coverage measured on 2026-11-04: 148 of 193 beaches have a label, with 34 distinct values. 36 pages have no label, nearly all Cartagena calas, and 9 beaches have no page.

The labels mix localities and tourism areas, so do not import them blindly. La Manga spans two municipalities, with 18 labelled beaches each in Cartagena and San Javier.

Scope: the `zone` field, its display on the beach page, and grouping on the municipality page. Dedicated zone routes are out of scope and belong in a later task.

## Acceptance Criteria

- [x] Curated zone list normalizes the 34 ITREM labels, separating localities from tourism areas (Calblanque is not La Manga)
- [x] Every one of the 193 beaches has a zone or is explicitly listed as unresolved, with the 45 gaps reviewed by hand
- [x] zone is stored in the DB and shown on the beach page
- [x] Municipality page groups beaches by zone
- [x] docs/data-schema.md updated and source cited

## Notes

## Learnings

- LRN-036: ITREM beach pages: code alone selects the page, unknown codes answer 200 with the list page
## Progress Log

- [2026-11-04] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).
- [2026-11-06] Started
- [2026-11-06] criterion 1 — evidence: pnpm vitest run src/lib/zones.test.ts → zoneFromItremLabel normalizes all 36 labels in the 2026-11-06 snapshot (task measured 34 on 2026-11-04) into 30 zones, kind locality|area, Calblanque separate from La Manga (2026-11-06)
- [2026-11-06] criterion 2 — evidence: pnpm vitest run src/lib/zones.test.ts + node scripts/validate-beaches.js → 191 of 193 beaches have a zone, 2 listed in data/zones.json unresolved with reasons; all 60 gaps (36 no page, 3 no label, 21 municipality-only; task estimated 45) have a hand-reviewed manual entry (2026-11-06)
- [2026-11-06] criterion 3 — evidence: pnpm vitest run src/lib/db-data.test.ts src/features/beaches/beach-hero.test.tsx → beaches.zone column round-trips for all 193 beaches; hero shows 'Isla Plana · Cartagena'. Production Turso still needs drizzle-kit push + migration before merge (2026-11-06)
- [2026-11-06] criterion 4 — evidence: pnpm vitest run src/features/listing/zone-sections.test.tsx src/lib/zones.test.ts → one section per zone in coastal order, unzoned last as 'Otras playas'; municipality page uses it when beaches fall into 2+ groups (2026-11-06)
- [2026-11-06] criterion 5 — evidence: git diff docs/data-schema.md → new Zones section citing https://itrem.carm.es/es/playa/<slug>-<code>/, Latin-1 encoding, coverage counts; zone field, column and validation rule documented (2026-11-06)
- [2026-11-06] Before merge: add beaches.zone to production Turso (pnpm drizzle-kit push against production) and run NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts; otherwise every beach query fails with 'no such column' (LRN-027) (2026-11-06)
- [2026-11-06] Completed