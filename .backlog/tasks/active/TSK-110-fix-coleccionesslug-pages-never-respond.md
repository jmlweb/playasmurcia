---
id: TSK-110
title: Fix: /colecciones/<slug> pages never respond on production
status: active
priority: P1
tags: []
created: 2026-10-17
source: report/RPT-041
depends-on: []
started: 2026-10-17
---

# Fix: /colecciones/<slug> pages never respond on production

## Description

All `/colecciones/<slug>` pages time out on production (curl 000 at 12-30 s). `/colecciones` index is fine.

Cause (confirmed in code): `src/routes/colecciones/$slug.tsx:47` awaits `fetchBatchCardWeather(filtered)`. In `src/lib/open-meteo.ts` the Open-Meteo `fetch` has no `AbortSignal`/timeout, and the `catch` handles only thrown errors, not a hang.

Fix together with RPT-042 (`/explorar`): the same shared helper also feeds `/municipios/$slug` and `/`. Consider not blocking the loader on weather.

Report: .backlog/reports/complete/RPT-041-coleccionesslug-pages-never-respond-on.md

## Acceptance Criteria

- [x] Open-Meteo fetch in src/lib/open-meteo.ts uses a timeout (~2 s) and returns an empty map on timeout
- [x] Regression test covers the timeout path
- [ ] All 13 sitemap collection URLs return 200 in under 2 s on production

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created
- [2026-10-17] Added `AbortSignal.timeout(2000)` to the batch Open-Meteo fetch in `fetchBatchCardWeather`; the existing `catch` returns an empty map on timeout. Added `src/lib/open-meteo.test.ts` (timeout path + signal wiring). `pnpm test`, `pnpm check`, `pnpm build` pass. Production check pending deploy.
- [2026-10-17] Started