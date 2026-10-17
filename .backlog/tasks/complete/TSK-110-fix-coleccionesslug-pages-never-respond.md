---
id: TSK-110
title: Fix: /colecciones/<slug> pages never respond on production
status: complete
priority: P1
tags: []
created: 2026-10-17
source: report/RPT-041
depends-on: []
started: 2026-10-17
completed: 2026-10-17
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
- [x] All 13 sitemap collection URLs return 200 in under 2 s on production

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created
- [2026-10-17] Added `AbortSignal.timeout(2000)` to the batch Open-Meteo fetch in `fetchBatchCardWeather`; the existing `catch` returns an empty map on timeout. Added `src/lib/open-meteo.test.ts` (timeout path + signal wiring). `pnpm test`, `pnpm check`, `pnpm build` pass. Production check pending deploy.
- [2026-10-17] Deployed (5a50f13, CI run 39042146889). Sitemap lists 12 collection URLs, not 13. All 12 return 200 (no more hangs), but over 3 runs 2-5 URLs per run took 2.3-2.8 s while the rest took 0.3-0.7 s. The slow ones look like the 2 s timeout firing: a timed-out fetch caches nothing, so the next miss waits the full 2 s again. Criterion 3 not met yet.
- [2026-10-17] Started
- [2026-10-17] Moved card weather out of listing loaders into a client-side `useCardWeather` hook (607a03a, CI run 39048723738). Production: all 12 sitemap collection URLs return 200; 3 runs, 36 requests, max 1.09 s (first cold hit), typical 0.28-0.48 s. Also covers `/explorar` (RPT-042), `/municipios/$slug` and `/`.
- [2026-10-17] Weather no longer blocks any loader (client hooks), so the slow-timeout cause is removed. Production timing check pending deploy.
- [2026-10-17] Completed
