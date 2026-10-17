---
id: TSK-048
title: Restore Interactive Map on Beach Detail
status: complete
priority: P2
tags: [feature]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-29
---

# Restore Interactive Map on Beach Detail

## Description

As a visitor planning a beach trip, I want to explore the beach location on an interactive map without leaving the site.

## Acceptance Criteria

- [ ] Replace `LocationMap` static image with a lazy-loaded interactive map (Leaflet + `react-leaflet` or Mapbox GL JS)
- [ ] Wrap in `Suspense` boundary with a loading placeholder (`bg-sky-200` or `bg-ocean-50`, animated "Cargando mapa..." text)
- [ ] Map height: `min(360px, 60vh)` on mobile, `min(500px, 400px + 10vw)` on desktop
- [ ] Show beach marker at coordinates
- [ ] Keep "Ver en Google Maps" as a secondary text link below the map
- [ ] Lazy-load the map library (do not include in initial bundle)
- [ ] Respect workerd runtime constraints: map library must work client-side only (no SSR)

## Context

Production has a lazy-loaded interactive map (likely Leaflet) at 360-600px height. v3 replaced it with a static image from `staticmap.openstreetmap.de` at only 192-256px, forcing users to leave the site to explore. This is a significant UX regression for a tourism site where location is a key decision factor. See `.backlog/reports/complete/RPT-040-beach-detail-page-v3-vs.md` for full comparison.

## Notes

- Production uses a dynamic import with Suspense — follow the same pattern
- Leaflet is ~40KB gzipped, acceptable for a lazy-loaded component
- Consider `react-leaflet` v5 which supports React 19
- OpenStreetMap tiles are free and don't require API keys

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #048)
