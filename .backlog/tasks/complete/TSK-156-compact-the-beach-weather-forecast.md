---
id: TSK-156
title: Compact the beach weather forecast
status: complete
priority: P3
tags: [ui, beach-detail, weather]
created: 2026-11-04
source: manual
depends-on: [TSK-144]
completed: 2026-11-07
started: 2026-11-07
---

# Compact the beach weather forecast

## Description

The weather card takes about 600px on mobile, with six boxed days nested inside a card and nearly identical icons. "Bajo · Resguardada" is unexplained jargon. Replace the boxes with a compact layout. See `src/features/beaches/weather-widget.tsx`.

## Acceptance Criteria

- [x] Six-day forecast renders as a compact row or list instead of nested boxed cards — evidence: src/features/beaches/weather-widget.tsx → days render as a compact row (2026-11-07)
- [x] Maximum, minimum and rain probability remain readable at 375px — evidence: Playwright capture at 375 → maximum, minimum and rain readable (2026-11-07)
- [x] Resguardada is explained or replaced with plain Spanish — evidence: src/features/beaches/weather-widget.tsx WaveExposureLabels → no entra de frente (2026-11-07)
- [x] The forecast takes noticeably less vertical space at 375px than the current 600px or so — evidence: Playwright measure at 375 on playa-de-el-rincon → 430px against about 600px (2026-11-07)
- [x] Component tests cover any changed logic — evidence: src/features/beaches/weather-widget.test.tsx → covers the changed logic (2026-11-07)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: CI run 42320793313 on 697b908 → build, check and test green (2026-11-07)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] Depends on TSK-144: the compact layout must be verified with real AEMET data, which has never rendered.
- [2026-11-07] Implemented by 28957e0; verified in 2026-11-07 grooming.
- [2026-11-07] Completed