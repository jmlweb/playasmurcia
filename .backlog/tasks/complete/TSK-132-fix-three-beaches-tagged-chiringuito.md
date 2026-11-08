---
id: TSK-132
title: Fix: Three beaches tagged Chiringuito lack the chiringuito service and miss the Con chiringuito collection
status: complete
priority: P4
tags: [bug, data]
created: 2026-10-27
source: report/RPT-059
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Fix: Three beaches tagged Chiringuito lack the chiringuito service and miss the Con chiringuito collection

## Description

Three beaches carry tag `7` ("Chiringuito") but not service `6` ("Chiringuito") in `data/beaches.json` (lines 5437, 6089, 15314). The `con-chiringuito` collection (`src/lib/collections.ts:124`) and the explorer services filter use the service only, so these beaches show a Chiringuito tag yet are missing from that collection and filter. See `.backlog/reports/complete/RPT-059-three-beaches-tagged-chiringuito-lack.md`.

## Acceptance Criteria

- [x] Playa Carrión, Playa de Bahía and Playa El Pedruchillo are checked against a source and either gain service 6 or lose tag 7 in data/beaches.json — evidence: ITREM pages: 692 lists chiringuitos (service 6 added), 662 lists restaurantes (service 6 added), 674 lists none (tag 7 removed) (2026-11-08)
- [x] No beach has tag 7 without service 6 (jq check from RPT-059 returns an empty list) — evidence: jq tag 7 without service 6 → [] (2026-11-08)
- [x] node scripts/validate-beaches.js passes and the change is migrated to the database — evidence: node scripts/validate-beaches.js 0 errors; migrated to Turso 2026-11-08 (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-27] Created
- [2026-11-08] Started
- [2026-11-08] Commit e73e1f5.
- [2026-11-08] Completed