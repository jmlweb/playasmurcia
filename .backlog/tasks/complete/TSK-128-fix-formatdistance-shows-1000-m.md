---
id: TSK-128
title: Fix: formatDistance shows 1000 m and 10,0 km at unit boundaries
status: complete
priority: P3
tags: [bug, explorer]
created: 2026-10-23
source: report/RPT-055
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: formatDistance shows 1000 m and 10,0 km at unit boundaries

## Description

`formatDistance` (`src/lib/geo.ts:21-24`) chooses the unit and format before rounding, so explorer cards sorted by proximity show "1000 m" for 0.95–0.999 km and "10,0 km" for 9.95–9.999 km. Round first, then pick the unit. See `.backlog/reports/complete/RPT-055-formatdistance-shows-1000-m-and.md`.

## Acceptance Criteria

- [x] formatDistance(0.95) and formatDistance(0.999) return "1,0 km"
- [x] formatDistance(9.96) returns "10 km"
- [x] Unit tests in src/lib/geo.test.ts cover the 1 km and 10 km boundaries

## Notes

## Learnings

## Progress Log

- [2026-10-23] Created
- [2026-11-04] Raised to P3 so it does not block TSK-158 from a lower priority.
- [2026-11-07] Started
- [2026-11-07] Round to tenths first, then pick the unit. Commit 1796cf6.
- [2026-11-07] Completed