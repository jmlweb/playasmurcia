---
id: LRN-035
title: AEMET API keys expire and the widget hides the failure
status: active
tags: [weather, aemet, external-source]
task: TSK-144
created: 2026-11-05
---

## Context
While capturing the TSK-144 fixture, AEMET answered 401 because the key had passed its renewal deadline of 15/10/2026.
## Insight
AEMET keys need periodic renewal. `fetchAemetForecast` turns any failure into a cached null and the widget falls back to Open-Meteo, so an expired key shows no error anywhere. Only the `Fuente` line changes.
## Application
If AEMET beaches show only `Fuente: Open-Meteo`, call the endpoint with the key before debugging the parser. A renewal needs updating both `.env` and the `AEMET_API_KEY` Worker secret. `.dev.vars` has no AEMET key, so `pnpm dev` always falls back.
