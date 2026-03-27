# Task #026: Edge Caching for External API Calls

## Metadata
- **Status**: done
- **Priority**: P1 - Critical
- **Slice**: Backend
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor, I want beach pages to load fast and reliably so that external API failures or slowness don't degrade my experience.

## Context

Gap analysis (`docs/github-main-feature-gap-analysis.md`, section 2) identified that the current in-memory `Map` caching in `src/lib/aemet.ts` and `src/lib/beach-status-112.ts` is **per-isolate** on Cloudflare Workers — meaning each request may hit a fresh isolate with an empty cache. The production site (Next.js on `main`) uses ISR + `fetch` revalidation for durable cross-request caching.

## Acceptance Criteria

- [ ] Replace in-memory `Map` cache in `src/lib/aemet.ts` with Cloudflare Cache API (`caches.default`)
- [ ] Replace in-memory cache in `src/lib/beach-status-112.ts` with Cloudflare Cache API
- [ ] Cache keys include the specific endpoint/params to avoid collisions
- [ ] TTLs match current values (30 min AEMET, appropriate TTL for 112 status)
- [ ] Graceful fallback: if Cache API is unavailable (local dev), fall back to in-memory Map
- [ ] Build passes, no regressions on beach detail weather or status widgets

## Technical Notes

- Use `caches.default.match()` / `caches.default.put()` with synthetic `Request`/`Response` objects
- Set `Cache-Control: max-age=<ttl>` on the cached `Response` so the edge handles expiry
- In local dev (Vite without workerd), `caches` is undefined — keep the Map as fallback
- This is a pure backend change; no UI modifications needed

## Vertical Slice

**Backend only**: Swap cache implementation in two files, verify via existing weather/status widget rendering.
