---
id: TSK-131
title: Fix: Weather forecast day labels shift one day back for visitors west of UTC
status: pending
priority: P4
tags: []
created: 2026-10-27
source: report/RPT-058
depends-on: []
---

# Fix: Weather forecast day labels shift one day back for visitors west of UTC

## Description

### Description

`fetchOpenMeteoForecast` parses Open-Meteo `YYYY-MM-DD` dates as UTC midnight (`src/lib/open-meteo.ts:187`) and `formatDayLabel` reads them with local `getDay()` (`src/features/beaches/weather-widget.tsx:226-229`), so visitors west of UTC see every forecast card labelled with the previous weekday. See `.backlog/reports/complete/RPT-058-weather-forecast-day-labels-shift.md`.

## Acceptance Criteria

- [ ] Forecast weekday labels match the Europe/Madrid calendar date regardless of the browser timezone
- [ ] Unit test covers the day label under a negative-offset timezone (e.g. America/New_York)
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-27] Created