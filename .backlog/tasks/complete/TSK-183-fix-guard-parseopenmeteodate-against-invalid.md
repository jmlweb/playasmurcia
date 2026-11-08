---
id: TSK-183
title: Fix: Guard parseOpenMeteoDate against invalid dates
status: complete
priority: P4
tags: [bug, weather]
created: 2026-11-07
source: review/2026-11-07
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Fix: Guard parseOpenMeteoDate against invalid dates

## Description

src/lib/open-meteo.ts parseOpenMeteoDate returns NaN for malformed strings and silently rolls over dates like 2026-02-30. A NaN fecha misses the Map lookup in forecast-days.ts and makes getUTCDay() return NaN, so DayNames[NaN] is undefined in the widget. Return undefined (or skip the day in fetchOpenMeteoForecast) when the string does not match YYYY-MM-DD or the components round-trip differently.

## Acceptance Criteria

- [x] Malformed or impossible dates are dropped from the forecast — evidence: parseOpenMeteoDate returns undefined; fetchOpenMeteoForecast flatMap drops the day (2026-11-08)
- [x] Unit test covers garbage and 2026-02-30 — evidence: open-meteo.test.ts: garbage, 2026-2-3, 2026-02-30, 2026-13-01 and a fetch test → pnpm test exit 0 (2026-11-08)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check exit 0 (2026-11-08) (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created
- [2026-11-08] Started
- [2026-11-08] Commit a535ac8.
- [2026-11-08] Completed