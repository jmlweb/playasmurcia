---
id: LRN-022
title: Seaward bearing comes from OSM coastline direction, but beach coordinates can be hundreds of metres off
status: active
tags: [data, weather]
task: TSK-116
created: 2026-10-20
---

## Context
Deriving `shoreBearing` for 193 beaches (TSK-116).

## Insight
- OSM `natural=coastline` ways keep land on the left, so the seaward normal is the way bearing + 90°. No polygon test needed.
- Per-beach Overpass calls stall on rate limits and need a User-Agent (406 without one). One bbox query for the whole region returns ~263 ways in seconds.
- Stored coordinates can sit 300 m or more from the real beach: Playa Amarilla (Águilas) got 157° instead of about 200°. Review beaches whose nearest coastline is over 300 m away.

## Application
Reuse this method for any per-beach geometry. Flag far-from-coast results and fix them by hand.
