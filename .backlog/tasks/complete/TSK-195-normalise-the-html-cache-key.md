---
id: TSK-195
title: Normalise the HTML cache key and cache 404s briefly
status: complete
priority: P3
tags: [security, performance, cache]
created: 2026-11-09
source: report/RPT-081
depends-on: []
started: 2026-11-23
completed: 2026-11-23
---

# Normalise the HTML cache key and cache 404s briefly

## Description

htmlCacheKey in src/lib/html-cache.ts uses pathname plus the raw query string, so /municipios?x=<random> always misses, runs SSR and Turso queries and stores a new entry (0.4-0.5 s against 0.06-0.09 s on a hit, measured on production 2026-11-09). Unknown parameters such as fbclid or utm_* miss too, and 404s are never cached. Build the key from the search parameters each route validates, in a stable order, and verify that hydration is clean when the cached HTML of /explorar is served for /explorar?fbclid=x. Consider a short TTL for 404s and a Cloudflare rate-limit rule on the zone as the complement. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [x] Requests that differ only in unknown query parameters share one cache entry
- [x] Hydration verified without warnings on a URL with an unknown parameter
- [x] Known search parameters still produce their own entries
- [x] Unit tests cover the key

## Notes

## Learnings

- LRN-053: Unknown query params leak into TanStack search and Link active state
- LRN-054: Run pnpm dev offline with a throwaway Hrana HTTP shim when turso CLI is missing
## Progress Log

- [2026-11-09] Created
- [2026-11-23] Started
- [2026-11-23] criterion 1 — evidence: pnpm vitest run src/lib/html-cache.test.ts → 'ignores unknown parameters such as fbclid and utm_*', 'drops the whole query on routes without search parameters' and 'serves a request with an unknown parameter from the same entry' pass (render called once) (2026-11-23)
- [2026-11-23] criterion 2 — evidence: pnpm dev (React dev build) + Playwright serving the bare URL's HTML at /explorar?fbclid=…&utm_source=…, the reverse, /municipios/cartagena?fbclid=…, /colecciones/mar-menor?utm_source=…, /?fbclid=…, /municipios, /colecciones, a /playas page → 0 hydration warnings; positive control /explorar HTML at ?page=2 still reports a mismatch. Fixed two leaks first: explorer pagination hrefs and exact-search active links (site-footer.active-link.test.tsx) (2026-11-23)
- [2026-11-23] criterion 3 — evidence: pnpm vitest run src/lib/html-cache.test.ts → 'keeps known parameters, so each filter set gets its own entry' and 'only keeps the parameters the matched route validates' pass (sort, q, page, filters keep separate keys) (2026-11-23)
- [2026-11-23] criterion 4 — evidence: pnpm test → 733 passed, 2 skipped; htmlCacheKey has 6 unit tests (variant/version/path, query drop, unknown params, known params, stable order + raw values, per-route allowlist) plus a 404 short-TTL test (2026-11-23)
- [2026-11-23] Completed