---
id: TSK-155
title: Restyle beach map to match the brand
status: complete
priority: P3
tags: [ui, beach-detail, map]
created: 2026-11-04
source: manual
depends-on: [TSK-154]
started: 2026-11-07
completed: 2026-11-07
---

# Restyle beach map to match the brand

## Description

The map looks off-brand. `navigation-day-v1` draws green roads that clash with the palette. The red static pin swaps to the default blue Leaflet marker when the live map loads. Attribution is unstyled and wraps to two lines on mobile. "Toca para interactuar con el mapa" also appears on desktop. See `src/features/beaches/location-map.tsx` and `src/features/beaches/leaflet-map.tsx`. Keep required map attribution.

## Acceptance Criteria

- [x] Map style fits the coastal palette instead of green navigation-style roads
- [x] Static and live maps use the same pin
- [x] Leaflet attribution remains present and no longer looks unstyled or wraps awkwardly at 375px
- [x] The activation hint uses wording that is correct for mouse and touch
- [x] Map loading stays lazy as it does today
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-154: both edit src/features/beaches/location-map.tsx.
- [2026-11-07] Started
- [2026-11-07] streets-v12 style, shared SVG pin (map-pin.ts) for static and Leaflet, attribution styled on one line at 375px, Abrir mapa hint is pointer-neutral, lazy chunk kept. Commit b943964.
- [2026-11-07] Completed