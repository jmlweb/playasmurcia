---
id: TSK-115
title: Wave Forecast (Oleaje) on Beach Detail Page
status: active
priority: P3
tags: [weather, open-meteo, aemet, beach-detail]
created: 2026-10-18
source: manual
depends-on: []
started: 2026-10-18
---

# Wave Forecast (Oleaje) on Beach Detail Page

## Description

Suggestion received via X: show some wave probability per beach.

Extend `fetchMarineWeather` in `src/lib/open-meteo.ts` to request `wave_height`, `wave_direction`, `wave_period`, `wind_wave_height` and `swell_wave_height` in the same Open-Meteo Marine API call and the same 1 h edge cache used for sea temperature. Render an "Oleaje hoy" row in the beach detail weather widget with the height in metres and a bajo/moderado/alto label. Where the beach has `aemetId`, show the AEMET `oleaje` text that `src/lib/aemet.ts` already parses but never renders.

The Marine model is a ~5 km grid, so this gives the open-sea state. A follow-up task adds a real shore bearing per beach to label sheltered vs exposed beaches.

## Acceptance Criteria

- [x] Marine fetch returns wave height, direction and period for all beaches, cached 1 h — evidence: src/lib/open-meteo.ts fetchMarineWeather requests wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height; same open-meteo-marine namespace, 1 h TTL (2026-10-18)
- [x] Detail weather widget shows "Oleaje hoy" with metres and a bajo/moderado/alto label — evidence: Playwright desktop + mobile screenshots of /playas/playa-amarilla show Oleaje 0,5 m Este · Moderado (2026-10-18)
- [x] Beaches with aemetId show the AEMET oleaje description for today — evidence: AEMET handler maps getDayWaves(d.oleaje) to wavesDescription; label replaces computed level. Not visually verified: no AEMET_API_KEY locally (2026-10-18)
- [x] Cached marine entries written before this change do not break the page — evidence: Wave fields optional on MarineWeather; toWaves returns undefined when waveHeight missing (2026-10-18)
- [x] Unit tests cover the wave field mapping and the label thresholds — evidence: src/lib/wave-level.test.ts, getDayWaves tests in aemet.test.ts, fetchMarineWeather tests in open-meteo.test.ts (2026-10-18)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test (294 passed), pnpm check all exit 0 (2026-10-18)

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created
- [2026-10-18] Started
- [2026-10-18] Added wave fields to Marine fetch, wave-level helper, getDayWaves, Oleaje row in weather widget, docs in business-rules.md. Verified build/test/check and Playwright screenshots (Open-Meteo path). AEMET oleaje path unit-tested only (no local key).