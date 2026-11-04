---
id: TSK-156
title: Compact the beach weather forecast
status: pending
priority: P3
tags: [ui, beach-detail, weather]
created: 2026-11-04
source: manual
depends-on: []
---

# Compact the beach weather forecast

## Description

The weather card takes about 600px on mobile, with six boxed days nested inside a card and nearly identical icons. "Bajo · Resguardada" is unexplained jargon. Replace the boxes with a compact layout. See `src/features/beaches/weather-widget.tsx`.

## Acceptance Criteria

- [ ] Six-day forecast renders as a compact row or list instead of nested boxed cards
- [ ] Maximum, minimum and rain probability remain readable at 375px
- [ ] Resguardada is explained or replaced with plain Spanish
- [ ] The forecast takes noticeably less vertical space at 375px than the current 600px or so
- [ ] Component tests cover any changed logic
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created