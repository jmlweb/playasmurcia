---
id: TSK-173
title: Fix: Hoy link lands on non-today strip when live data fails
status: pending
priority: P4
tags: []
created: 2026-11-06
source: report/RPT-073
depends-on: []
---

# Fix: Hoy link lands on non-today strip when live data fails

## Description

### Summary

The "Hoy" nav link promises today's conditions. When no live data is available, it lands on a strip titled "La costa por mares", which has no today content.

### Details

`CoastTodayStrip` computes `isLive` from loading state and its source line (`src/features/home/coast-today-strip.tsx:119`) and swaps the heading (`:131`). The fallback follows "Source or silence" correctly. The nav label does not change, because the bar deliberately holds no live data (`TodayLink` in `src/components/layout/navbar.tsx`).

The mismatch only appears when both Open-Meteo and 112 data are missing. The visitor taps "Hoy" and sees a directory. The failure state was read from source, not reproduced in the browser.

### Fix direction

Have the fallback strip say that today's data is unavailable, which also makes the failure visible. Do not make the nav fetch data to hide the link.

Source report: `.backlog/reports/complete/RPT-073-hoy-link-lands-on-non-today.md`

## Acceptance Criteria

- [ ] With no Open-Meteo or 112 data, the fallback strip says that today's data is unavailable
- [ ] The fallback invents no conditions and keeps its real sea links
- [ ] The nav fetches no data
- [ ] Failure state checked in the browser, with a test covering the fallback copy

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created