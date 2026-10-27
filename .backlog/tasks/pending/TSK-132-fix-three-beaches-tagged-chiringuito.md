---
id: TSK-132
title: Fix: Three beaches tagged Chiringuito lack the chiringuito service and miss the Con chiringuito collection
status: pending
priority: P4
tags: []
created: 2026-10-27
source: report/RPT-059
depends-on: []
---

# Fix: Three beaches tagged Chiringuito lack the chiringuito service and miss the Con chiringuito collection

## Description

### Description

Three beaches carry tag `7` ("Chiringuito") but not service `6` ("Chiringuito") in `data/beaches.json` (lines 5437, 6089, 15314). The `con-chiringuito` collection (`src/lib/collections.ts:124`) and the explorer services filter use the service only, so these beaches show a Chiringuito tag yet are missing from that collection and filter. See `.backlog/reports/complete/RPT-059-three-beaches-tagged-chiringuito-lack.md`.

## Acceptance Criteria

- [ ] Playa Carrión, Playa de Bahía and Playa El Pedruchillo are checked against a source and either gain service 6 or lose tag 7 in data/beaches.json
- [ ] No beach has tag 7 without service 6 (jq check from RPT-059 returns an empty list)
- [ ] node scripts/validate-beaches.js passes and the change is migrated to the database

## Notes

## Learnings

## Progress Log

- [2026-10-27] Created