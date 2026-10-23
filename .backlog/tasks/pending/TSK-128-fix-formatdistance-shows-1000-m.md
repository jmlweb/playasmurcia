---
id: TSK-128
title: Fix: formatDistance shows 1000 m and 10,0 km at unit boundaries
status: pending
priority: P4
tags: [bug, explorer]
created: 2026-10-23
source: report/RPT-055
depends-on: []
---

# Fix: formatDistance shows 1000 m and 10,0 km at unit boundaries

## Description

### Description

`formatDistance` (`src/lib/geo.ts:21-24`) chooses the unit and format before rounding, so explorer cards sorted by proximity show "1000 m" for 0.95–0.999 km and "10,0 km" for 9.95–9.999 km. Round first, then pick the unit. See `.backlog/reports/complete/RPT-055-formatdistance-shows-1000-m-and.md`.

## Acceptance Criteria

- [ ] formatDistance(0.95) and formatDistance(0.999) return "1,0 km"
- [ ] formatDistance(9.96) returns "10 km"
- [ ] Unit tests in src/lib/geo.test.ts cover the 1 km and 10 km boundaries

## Notes

## Learnings

## Progress Log

- [2026-10-23] Created