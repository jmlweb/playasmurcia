---
id: TSK-183
title: Fix: Guard parseOpenMeteoDate against invalid dates
status: pending
priority: P4
tags: [bug, weather]
created: 2026-11-07
source: review/2026-11-07
depends-on: []
---

# Fix: Guard parseOpenMeteoDate against invalid dates

## Description

src/lib/open-meteo.ts parseOpenMeteoDate returns NaN for malformed strings and silently rolls over dates like 2026-02-30. A NaN fecha misses the Map lookup in forecast-days.ts and makes getUTCDay() return NaN, so DayNames[NaN] is undefined in the widget. Return undefined (or skip the day in fetchOpenMeteoForecast) when the string does not match YYYY-MM-DD or the components round-trip differently.

## Acceptance Criteria

- [ ] Malformed or impossible dates are dropped from the forecast
- [ ] Unit test covers garbage and 2026-02-30
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created