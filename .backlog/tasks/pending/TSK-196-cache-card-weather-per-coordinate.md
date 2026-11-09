---
id: TSK-196
title: Cache card weather per coordinate instead of per set of beach codes
status: pending
priority: P3
tags: [security, weather, cache]
created: 2026-11-09
source: report/RPT-081
depends-on: []
---

# Cache card weather per coordinate instead of per set of beach codes

## Description

fetchBatchCardWeather in src/lib/open-meteo.ts keys its cache by the sorted list of codes the caller sends. The server function behind useCardWeather accepts any subset of up to 500 codes, so distinct subsets of the 193 real codes each trigger upstream Open-Meteo calls and can exhaust the free quota, which removes weather for every visitor. Cache each rounded coordinate (as fetchForecast already does) and only fetch the ones missing. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [ ] Two requests with overlapping code sets fetch the shared coordinates once
- [ ] Listing pages still make one batched upstream call on a cold cache
- [ ] Unit test covers the partial-hit path

## Notes

## Learnings

## Progress Log

- [2026-11-09] Created