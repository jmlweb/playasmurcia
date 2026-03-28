# Task #048: Restore Interactive Map on Beach Detail

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: Feature
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor planning a beach trip, I want to explore the beach location on an interactive map without leaving the site.

## Context

Production has a lazy-loaded interactive map (likely Leaflet) at 360-600px height. v3 replaced it with a static image from `staticmap.openstreetmap.de` at only 192-256px, forcing users to leave the site to explore. This is a significant UX regression for a tourism site where location is a key decision factor. See `docs/dev/reports/processed/v3-vs-production-beach-detail.md` for full comparison.

## Acceptance Criteria

- [ ] Replace `LocationMap` static image with a lazy-loaded interactive map (Leaflet + `react-leaflet` or Mapbox GL JS)
- [ ] Wrap in `Suspense` boundary with a loading placeholder (`bg-sky-200` or `bg-ocean-50`, animated "Cargando mapa..." text)
- [ ] Map height: `min(360px, 60vh)` on mobile, `min(500px, 400px + 10vw)` on desktop
- [ ] Show beach marker at coordinates
- [ ] Keep "Ver en Google Maps" as a secondary text link below the map
- [ ] Lazy-load the map library (do not include in initial bundle)
- [ ] Respect workerd runtime constraints: map library must work client-side only (no SSR)

## Notes

- Production uses a dynamic import with Suspense — follow the same pattern
- Leaflet is ~40KB gzipped, acceptable for a lazy-loaded component
- Consider `react-leaflet` v5 which supports React 19
- OpenStreetMap tiles are free and don't require API keys
