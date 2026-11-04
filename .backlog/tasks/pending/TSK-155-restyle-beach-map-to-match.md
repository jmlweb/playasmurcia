---
id: TSK-155
title: Restyle beach map to match the brand
status: pending
priority: P3
tags: [ui, beach-detail, map]
created: 2026-11-04
source: manual
depends-on: []
---

# Restyle beach map to match the brand

## Description

The map looks off-brand. `navigation-day-v1` draws green roads that clash with the palette. The red static pin swaps to the default blue Leaflet marker when the live map loads. Attribution is unstyled and wraps to two lines on mobile. "Toca para interactuar con el mapa" also appears on desktop. See `src/features/beaches/location-map.tsx` and `src/features/beaches/leaflet-map.tsx`. Keep required map attribution.

## Acceptance Criteria

- [ ] Map style fits the coastal palette instead of green navigation-style roads
- [ ] Static and live maps use the same pin
- [ ] Leaflet attribution remains present and no longer looks unstyled or wraps awkwardly at 375px
- [ ] The activation hint uses wording that is correct for mouse and touch
- [ ] Map loading stays lazy as it does today
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created