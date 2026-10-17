---
id: TSK-111
title: Fix: /explorar never responds on production
status: active
priority: P1
tags: []
created: 2026-10-17
source: report/RPT-042
depends-on: []
started: 2026-10-17
---

# Fix: /explorar never responds on production

## Description

`GET /explorar` (also `?page=1`, `?page=9999`, `?q=sol`) sends no response on production; curl times out at 25-40 s. Other routes answer in under 1 s.

Cause (confirmed in code): `src/routes/explorar/index.tsx:45` awaits `fetchBatchCardWeather(beaches)` for all ~194 beaches. `src/lib/open-meteo.ts` has no timeout on the Open-Meteo `fetch`, and the batch puts every unique coordinate in one GET URL (possible URL-length or rate limits).

Related: TSK-110 fixes the timeout on the same shared helper; do it first or together. This task adds chunking and the non-blocking loader.

Report: .backlog/reports/complete/RPT-042-explorar-never-responds-on-production.md

## Acceptance Criteria

- [x] Open-Meteo batch is split into chunks instead of one GET URL for ~194 beaches
- [x] /explorar loader does not block on weather, or degrades to an empty map on timeout
- [x] Regression test covers the timeout path
- [ ] /explorar, /explorar?page=9999 and /explorar?q=sol return 200 in under 3 s on production

## Notes

## Learnings

## Progress Log

- [2026-10-17] Created
- [2026-10-17] Chunked batch (50 coords, 2 s timeout each), weather moved to client hooks so loaders never block. Production timing check pending deploy.
- [2026-10-17] Started