---
id: TSK-165
title: Fix: Weather icon and caption contrast violations
status: pending
priority: P4
tags: [ui, bug, accessibility]
created: 2026-11-04
source: report/RPT-066
depends-on: []
---

# Fix: Weather icon and caption contrast violations

## Description

`weather-widget.tsx:428` uses `%💧` at 10.4px in off-palette blue. `gray-400` and `gray-500` captions at 12px fall below the floor in `docs/ui-guidelines.md`. Coordinate with the compact forecast task to avoid doing the same work twice.

See `.backlog/reports/complete/RPT-066-weather-widget-and-captions-break.md`.

## Acceptance Criteria

- [ ] Rain probability uses an SVG icon instead of emoji
- [ ] Rain probability uses an allowed colour and a readable size
- [ ] Beach detail captions meet the caption contrast floor
- [ ] Contrast is measured, not only judged from tokens
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created