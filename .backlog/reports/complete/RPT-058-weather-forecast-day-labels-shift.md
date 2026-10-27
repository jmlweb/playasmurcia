---
id: RPT-058
title: Weather forecast day labels shift one day back for visitors west of UTC
type: bug
severity: low
status: triaged
created: 2026-10-27
triaged: 2026-10-27
task-id: TSK-131
---

## Description

Open-Meteo returns daily dates as `YYYY-MM-DD` in `Europe/Madrid`. `fetchOpenMeteoForecast` turns them into timestamps with `new Date(dateStr).getTime()` (`src/lib/open-meteo.ts:187`), which parses a date-only string as **UTC midnight**. `formatDayLabel` (`src/features/beaches/weather-widget.tsx:226-229`) then reads the weekday with `date.getDay()`, which uses the **browser's** timezone. The widget fetches the forecast client-side (`useEffect` at `src/features/beaches/weather-widget.tsx:495`), so the label follows the visitor's timezone.

For any visitor west of UTC (e.g. Latin America, US), UTC midnight falls on the previous local day, so every forecast card shows the previous weekday: today's forecast is labelled with yesterday's name. Visitors in Spain (UTC+1/+2) and UTC+0 are not affected.

## Reproduction

```
$ for tz in Europe/Madrid UTC America/New_York; do TZ=$tz node -e 'console.log(process.env.TZ, new Date(new Date("2026-10-27").getTime()).getDay())'; done
Europe/Madrid 2
UTC 2
America/New_York 1
```

2026-10-27 is a Tuesday (`Mar`); in `America/New_York` the card reads `Lun`.

Scope: Open-Meteo path only. The AEMET `fecha` format was not verified and is not covered by this report.

## Suggested fix

Keep the calendar date independent of the viewer's timezone: either format the weekday with `Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: 'UTC' })` (or `getUTCDay()`) for a UTC-midnight timestamp, or carry the `YYYY-MM-DD` string through and derive the weekday from it. Add a unit test that runs the label under a negative-offset timezone.
