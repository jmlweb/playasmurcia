---
id: TSK-195
title: Normalise the HTML cache key and cache 404s briefly
status: pending
priority: P3
tags: [security, performance, cache]
created: 2026-11-09
source: report/RPT-081
depends-on: []
---

# Normalise the HTML cache key and cache 404s briefly

## Description

htmlCacheKey in src/lib/html-cache.ts uses pathname plus the raw query string, so /municipios?x=<random> always misses, runs SSR and Turso queries and stores a new entry (0.4-0.5 s against 0.06-0.09 s on a hit, measured on production 2026-11-09). Unknown parameters such as fbclid or utm_* miss too, and 404s are never cached. Build the key from the search parameters each route validates, in a stable order, and verify that hydration is clean when the cached HTML of /explorar is served for /explorar?fbclid=x. Consider a short TTL for 404s and a Cloudflare rate-limit rule on the zone as the complement. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [ ] Requests that differ only in unknown query parameters share one cache entry
- [ ] Hydration verified without warnings on a URL with an unknown parameter
- [ ] Known search parameters still produce their own entries
- [ ] Unit tests cover the key

## Notes

## Learnings

## Progress Log

- [2026-11-09] Created