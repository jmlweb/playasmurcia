---
id: TSK-144
title: Fix: AEMET beach forecast parser expects an invented payload shape, so the AEMET widget never renders
status: pending
priority: P3
tags: []
created: 2026-10-31
source: report/RPT-060
depends-on: []
---

# Fix: AEMET beach forecast parser expects an invented payload shape, so the AEMET widget never renders

## Description

`fetchAemetForecast` and the `getDay*` helpers in `src/lib/aemet.ts` assume arrays of `{ periodo, descripcion, value }` and an epoch-ms `fecha`. The real AEMET `prediccion/especifica/playa` payload uses objects with `f1`/`descripcion1`/`valor1` and a `YYYYMMDD` `fecha`. As a result, the `fetchAemetWeather` server function (`src/features/beaches/weather-widget.tsx:56-93`) throws `TypeError: estadoCielo.find is not a function`, and the widget silently falls back to Open-Meteo for every beach with an `aemetId`. See `.backlog/reports/complete/RPT-060-aemet-beach-forecast-parser-expects.md`.

## Acceptance Criteria

- [ ] A real AEMET playa datos payload for a Murcia beach is committed as the fixture in src/lib/aemet.test.ts
- [ ] estadoCielo, viento and oleaje are read from f1/descripcion1 and f2/descripcion2 objects; tMaxima, tAgua and uvMax from valor1
- [ ] fecha in YYYYMMDD format is converted to the correct calendar day before formatDayLabel
- [ ] The datos response is decoded with its declared charset so Spanish diacritics render correctly
- [ ] A beach with aemetId shows the AEMET source label on its detail page
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-31] Created