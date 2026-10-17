---
id: TSK-026
title: Edge Caching for External API Calls
status: complete
priority: P1
tags: [backend]
created: 2026-03-28
source: manual
depends-on: []
started: 2026-03-28
completed: 2026-03-28
---

# Edge Caching for External API Calls

## Description

As a visitor, I want beach pages to load fast and reliably so that external API failures or slowness don't degrade my experience.

## Acceptance Criteria

- [ ] Replace in-memory `Map` cache in `src/lib/aemet.ts` with Cloudflare Cache API (`caches.default`)
- [ ] Replace in-memory cache in `src/lib/beach-status-112.ts` with Cloudflare Cache API
- [ ] Cache keys include the specific endpoint/params to avoid collisions
- [ ] TTLs match current values (30 min AEMET, appropriate TTL for 112 status)
- [ ] Graceful fallback: if Cache API is unavailable (local dev), fall back to in-memory Map
- [ ] Build passes, no regressions on beach detail weather or status widgets

## Context

Gap analysis (`.backlog/reports/complete/RPT-013-product-parity-and-feature-status.md`, section 2) identified that the current in-memory `Map` caching in `src/lib/aemet.ts` and `src/lib/beach-status-112.ts` is **per-isolate** on Cloudflare Workers — meaning each request may hit a fresh isolate with an empty cache. The production site (Next.js on `main`) uses ISR + `fetch` revalidation for durable cross-request caching.

## Notes

- Use `caches.default.match()` / `caches.default.put()` with synthetic `Request`/`Response` objects
- Set `Cache-Control: max-age=<ttl>` on the cached `Response` so the edge handles expiry
- In local dev (Vite without workerd), `caches` is undefined — keep the Map as fallback
- This is a pure backend change; no UI modifications needed

## Vertical Slice

**Backend only**: Swap cache implementation in two files, verify via existing weather/status widget rendering.

## Learnings

- LRN-007: Per-isolate cache is ephemeral
## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #026)
