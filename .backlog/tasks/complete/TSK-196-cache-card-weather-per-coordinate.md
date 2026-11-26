---
id: TSK-196
title: Cache card weather per coordinate instead of per set of beach codes
status: complete
priority: P3
tags: [security, weather, cache]
created: 2026-11-09
source: report/RPT-081
depends-on: []
started: 2026-11-26
completed: 2026-11-26
---

# Cache card weather per coordinate instead of per set of beach codes

## Description

fetchBatchCardWeather in src/lib/open-meteo.ts keys its cache by the sorted list of codes the caller sends. The server function behind useCardWeather accepts any subset of up to 500 codes, so distinct subsets of the 193 real codes each trigger upstream Open-Meteo calls and can exhaust the free quota, which removes weather for every visitor. Cache each rounded coordinate (as fetchForecast already does) and only fetch the ones missing. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [x] Two requests with overlapping code sets fetch the shared coordinates once
- [x] Listing pages still make one batched upstream call on a cold cache
- [x] Unit test covers the partial-hit path

## Notes

## Learnings

- LRN-055: Edge-cache memory fallback leaks entries between tests that share coordinates
- LRN-056: Local test runs need NODE_ENV=test, a seeded local.db and a prior build
- LRN-057: Workers cap Cache API calls per request, so per-key cache fan-out breaks large batches
## Progress Log

- [2026-11-09] Created
- [2026-11-26] Started
- [2026-11-26] criterion 1 — evidence: pnpm vitest run src/lib/open-meteo.test.ts → 'fetches the coordinates shared by two overlapping requests once' passes (2 upstream calls, second asks only for the new latitude); failed before the change (2026-11-26)
- [2026-11-26] criterion 2 — evidence: pnpm vitest run src/lib/open-meteo.test.ts → 'fetches every coordinate of a cold listing in one batched call' passes (40 coordinates, 1 call) and 'splits many unique coordinates into several requests' still passes (2026-11-26)
- [2026-11-26] criterion 3 — evidence: pnpm vitest run src/lib/open-meteo.test.ts → partial-hit tests (overlapping sets, shared coordinate across codes, all-hit with no call, failed chunk retried) pass; full pnpm test 739 passed (2026-11-26)
- [2026-11-26] Completed
- [2026-11-26] Reworked to one shared per-coordinate record after confirming the Workers Cache API cap (50 calls/request on Free) — evidence: 'makes one Cache API lookup and one write per request' passes with 120 coordinates; pnpm test 740 passed (2026-11-26)