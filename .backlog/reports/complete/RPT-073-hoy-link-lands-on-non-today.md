---
id: RPT-073
title: Hoy link lands on non-today strip when live data fails
type: finding
severity: low
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-173
---

## Summary

The "Hoy" nav link promises today's conditions. When no live data is available, it lands on a strip titled "La costa por mares", which has no today content.

## Details

`CoastTodayStrip` computes `isLive` from loading state and its source line (`src/features/home/coast-today-strip.tsx:119`) and swaps the heading (`:131`). The fallback follows "Source or silence" correctly. The nav label does not change, because the bar deliberately holds no live data.

## Where Found

- `src/components/layout/navbar.tsx`, `TodayLink`.
- `src/features/home/coast-today-strip.tsx:119`, `:131`.

## Evidence

Read from source. The failure state was not reproduced in the browser. During the 2026-11-06 checks the link reached the strip at y=80 with live data present.

## Impact

Low. The fallback shows real sea links and invents nothing, and the strip title stays honest. The mismatch only appears when both Open-Meteo and 112 data are missing. The visitor taps "Hoy" and sees a directory.

## Next Step

Decide whether this is acceptable. Options: leave it, or have the fallback strip say that today's data is unavailable, which also makes the failure visible. Do not make the nav fetch data to hide the link.
