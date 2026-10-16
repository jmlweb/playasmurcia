# Task #107: Explorer "Near Me" Sort and Map of All Beaches

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Frontend
- **Created**: 2026-10-16
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor deciding where to go today, I want to see beaches sorted by distance from my location and on a map so that I can pick a good beach that is close to me.

## Acceptance Criteria

- [ ] `/explorar` offers a "Cerca de mí" action that requests browser geolocation only on user click (never on page load)
- [ ] When granted, a `cercania` sort orders beaches by straight-line distance (haversine) and each card shows the distance (e.g. "12 km")
- [ ] Denied, unavailable, or timed-out geolocation shows a clear, non-blocking message and keeps the previous sort
- [ ] User coordinates are not stored in the URL, server, or analytics (privacy); only the sort key is in the URL
- [ ] `/explorar` has a list/map toggle; the map shows all currently filtered beaches as markers, each linking to `/playas/$slug`
- [ ] Map is lazy-loaded (same approach as `location-map.tsx`) so it does not affect initial load or SSR
- [ ] Unit tests for the distance helper and the distance sort; visual check on desktop and mobile with `pnpm tsx scripts/screenshot.ts`

## Implementation Notes

Leaflet is already used for the beach detail map (`src/features/beaches/leaflet-map`) — reuse it; no new map dependency. With ~100+ markers, check whether clustering is needed; if it requires a new package (e.g. `leaflet.markercluster`), ask before adding it. Geolocation is client-only: guard against SSR/workerd.

Origin: visitor-perspective UX brainstorm (2026-10-16), top-3 suggestion #1.

## Files to Modify

- `src/routes/explorar/index.tsx`
- `src/lib/beach-filters.ts` (new sort) and a new geo helper (+ tests)
- `src/lib/explorer-search.ts`
- `src/features/listing/sort-select.tsx`
- `src/features/beaches/beach-card.tsx` (optional distance prop)
- New: `src/features/explorer/explorer-map.tsx`

## Dependencies

- Soft: #106 (both touch `beach-filters.ts`, `explorer-search.ts` and the explorer route — do them sequentially)

## Progress Log

(No progress yet)

## Learnings

(None yet)
