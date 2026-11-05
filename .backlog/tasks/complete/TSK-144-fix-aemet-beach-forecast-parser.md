---
id: TSK-144
title: Fix: AEMET beach forecast parser expects an invented payload shape, so the AEMET widget never renders
status: complete
priority: P2
tags: [bug, weather, data]
created: 2026-10-31
source: report/RPT-060
depends-on: []
started: 2026-11-04
completed: 2026-11-05
---

# Fix: AEMET beach forecast parser expects an invented payload shape, so the AEMET widget never renders

## Description

`fetchAemetForecast` and the `getDay*` helpers in `src/lib/aemet.ts` assume arrays of `{ periodo, descripcion, value }` and an epoch-ms `fecha`. The real AEMET `prediccion/especifica/playa` payload uses objects with `f1`/`descripcion1`/`valor1` and a `YYYYMMDD` `fecha`. As a result, the `fetchAemetWeather` server function (`src/features/beaches/weather-widget.tsx:56-93`) throws `TypeError: estadoCielo.find is not a function`, and the widget silently falls back to Open-Meteo for every beach with an `aemetId`. See `.backlog/reports/complete/RPT-060-aemet-beach-forecast-parser-expects.md`.

## Acceptance Criteria

- [x] A real AEMET playa datos payload for a Murcia beach is committed as the fixture in src/lib/aemet.test.ts — evidence: src/lib/aemet.test.ts REAL_AEMET_PAYLOAD for 3000301 La Carolina, captured 2026-11-05 (2026-11-05)
- [x] estadoCielo, viento and oleaje are read from f1/descripcion1 and f2/descripcion2 objects; tMaxima, tAgua and uvMax from valor1 — evidence: aemet.test.ts parses a real forecast payload → passes (2026-11-05) (2026-11-05)
- [x] fecha in YYYYMMDD format is converted to the correct calendar day before formatDayLabel — evidence: aemet.test.ts weekday test; production labels VIE/SÁB correct; west-of-UTC shift remains in TSK-131 (2026-11-05) (2026-11-05)
- [x] The datos response is decoded with its declared charset so Spanish diacritics render correctly — evidence: aemet.test.ts decodes ISO-8859-15 bytes to débil; production shows Débil (2026-11-05) (2026-11-05)
- [x] A beach with aemetId shows the AEMET source label on its detail page — evidence: Playwright on 4 production beaches → Fuente: AEMET y Open-Meteo (2026-11-05) (2026-11-05)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test (396 passed), pnpm check → exit 0 (2026-11-05) (2026-11-05)

## Notes

## Learnings

- LRN-035: AEMET API keys expire and the widget hides the failure
## Progress Log

- [2026-10-31] Created
- [2026-11-04] Raised to P2: all 64 beaches with aemetId silently lose the official forecast, and TSK-131, TSK-138 and TSK-156 now wait on this task.
- [2026-11-04] Started
- [2026-11-05] Completed