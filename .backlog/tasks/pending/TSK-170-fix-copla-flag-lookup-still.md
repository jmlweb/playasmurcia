---
id: TSK-170
title: Fix: COPLA flag lookup still misses four beaches whose feed entry uses a different name
status: pending
priority: P3
tags: []
created: 2026-11-06
source: report/RPT-070
depends-on: []
---

# Fix: COPLA flag lookup still misses four beaches whose feed entry uses a different name

## Description

### Description

`findCoplaEntry` (`src/lib/beach-status-112.ts:139-160`) matches COPLA feed entries by name only. Four beaches have a feed entry within 0.3 km whose name no rule can reach: 581 El Rihuete (`PUERTO - RIHUETE`, `SILLAS DE RIHUETE`), 663 Cala de Calnegre (`PLAYA DE CALNEGRE`), 592 Playa Calnegre (`MONTE BLANCO - CALNEGRE`) and 580 La Chapineta (`LA AZOHIA (CHAPINETA)`). They never show a flag or closure. See `.backlog/reports/complete/RPT-070-copla-flag-lookup-still-misses.md`.

Suggested fix: when no name rule matches, fall back to the nearest feed entry in the same municipality within a small radius. Read the feed's `coordx`/`coordy` as UTM 30N. Alternatively, keep an explicit code-to-feed-name map. Do not widen the name rules (LRN-025).

## Acceptance Criteria

- [ ] Playa de El Rihuete (581), Cala de Calnegre (663), Playa Calnegre (592) and Playa de La Chapineta (580) resolve to their nearby COPLA feed entries
- [ ] Every beach that matches a feed entry today still maps to the same entry
- [ ] No beach matches a feed entry from another municipality or more than a small radius away
- [ ] Unit tests cover the new fallback and a negative case
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created