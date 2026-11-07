---
id: TSK-165
title: Fix: Weather icon and caption contrast violations
status: complete
priority: P4
tags: [ui, bug, accessibility]
created: 2026-11-04
source: report/RPT-066
depends-on: [TSK-156]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Weather icon and caption contrast violations

## Description

The compact forecast (28957e0) removed the `%💧` emoji and the off-palette blue. Rain probability is now `text-xs text-ocean-700` with a screen-reader "Lluvia" prefix, at 12px.

Still open: `text-xs text-gray-500` captions at `src/features/beaches/location-map.tsx:115` and `src/features/beaches/nearby-carousel.tsx:88` fall below the floor in `docs/ui-guidelines.md`, which asks for `gray-600` at 13px or `gray-500` at 14px. The 12px rain text and forecast minimums need the same check.

See `.backlog/reports/complete/RPT-066-weather-widget-and-captions-break.md`.

## Acceptance Criteria

- [x] Rain probability no longer uses an emoji — evidence: src/features/beaches/weather-widget.tsx → emoji removed (2026-11-07)
- [x] Rain probability uses an allowed colour and a readable size
- [x] Beach detail captions meet the caption contrast floor
- [x] Contrast is measured, not only judged from tokens
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-156: the compact forecast rewrites the same rain-probability markup.
- [2026-11-07] Decision in 2026-11-07 grooming: no SVG icon is needed, because the percentage has a screen-reader Lluvia prefix. Criterion reworded. Colour is ocean-700, but the 12px size stays to be checked.
- [2026-11-07] Started
- [2026-11-07] Measured with a Playwright script resolving oklch through canvas: rain Lluvia 23% ocean-700 on ocean-50 8.33:1, forecast minimum and Fuente gray-600 6.98:1, map coordinates gray-500 at 12px 4.72:1. Ratios already passed; sizes were under the 13px floor. Rain, minimums and source raised to 13px; map coordinates to gray-600 13px (7.38:1); nearby meta already gray-600 13px (7.56:1). Day labels (12px, 6.98:1 or better) left as is. Commit 0bd298a, merged 5c183c0.
- [2026-11-07] Completed