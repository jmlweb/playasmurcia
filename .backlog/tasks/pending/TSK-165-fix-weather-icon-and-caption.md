---
id: TSK-165
title: Fix: Weather icon and caption contrast violations
status: pending
priority: P4
tags: [ui, bug, accessibility]
created: 2026-11-04
source: report/RPT-066
depends-on: [TSK-156]
---

# Fix: Weather icon and caption contrast violations

## Description

The compact forecast (28957e0) removed the `%💧` emoji and the off-palette blue. Rain probability is now `text-xs text-ocean-700` with a screen-reader "Lluvia" prefix, at 12px.

Still open: `text-xs text-gray-500` captions at `src/features/beaches/location-map.tsx:115` and `src/features/beaches/nearby-carousel.tsx:88` fall below the floor in `docs/ui-guidelines.md`, which asks for `gray-600` at 13px or `gray-500` at 14px. The 12px rain text and forecast minimums need the same check.

See `.backlog/reports/complete/RPT-066-weather-widget-and-captions-break.md`.

## Acceptance Criteria

- [x] Rain probability no longer uses an emoji — evidence: src/features/beaches/weather-widget.tsx → emoji removed (2026-11-07)
- [ ] Rain probability uses an allowed colour and a readable size
- [ ] Beach detail captions meet the caption contrast floor
- [ ] Contrast is measured, not only judged from tokens
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-156: the compact forecast rewrites the same rain-probability markup.
- [2026-11-07] Decision in 2026-11-07 grooming: no SVG icon is needed, because the percentage has a screen-reader Lluvia prefix. Criterion reworded. Colour is ocean-700, but the 12px size stays to be checked.