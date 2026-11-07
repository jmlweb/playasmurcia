---
id: TSK-131
title: Fix: Weather forecast day labels shift one day back for visitors west of UTC
status: complete
priority: P4
tags: [bug, weather]
created: 2026-10-27
source: report/RPT-058
depends-on: [TSK-144]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Weather forecast day labels shift one day back for visitors west of UTC

## Description

`fetchOpenMeteoForecast` parses Open-Meteo `YYYY-MM-DD` dates as UTC midnight (`src/lib/open-meteo.ts:190`) and `formatDayLabel` reads them with local `getDay()` (`src/features/beaches/weather-widget.tsx:188-191`), so visitors west of UTC see every forecast card labelled with the previous weekday. The `isWeekend` highlight in the same file has the same bug. See `.backlog/reports/complete/RPT-058-weather-forecast-day-labels-shift.md`.

## Acceptance Criteria

- [x] Forecast weekday labels and the weekend highlight match the Europe/Madrid calendar date regardless of the browser timezone
- [x] Unit test covers the day label under a negative-offset timezone (e.g. America/New_York)
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-27] Created
- [2026-11-04] Depends on TSK-144: both change forecast date handling and formatDayLabel.
- [2026-11-07] Started
- [2026-11-07] parseOpenMeteoDate builds Date.UTC midnight; widget reads weekdays with getUTCDay (getForecastWeekday, formatDayLabel, formatFullDayName, isWeekend). AEMET parser already used Date.UTC; widget fix covers both providers. Tests pass under TZ=America/New_York, Europe/Madrid and UTC (21 tests). Commit e4455d2, merged a6e7c07.
- [2026-11-07] Completed