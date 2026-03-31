# Task #070: Weather Widget Redesign

## Metadata

- **Status**: completed
- **Priority**: P1 - Active
- **Slice**: UI
- **Created**: 2026-03-30
- **Started**: 2026-03-30
- **Completed**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor on a beach detail page, I want a clear, beautiful weather display so that I can quickly understand current and upcoming conditions.

## Context

UI audit (2026-03-29) identified the weather widget as one of the weakest visual components. Tiny fonts (`text-[10px]`), near-invisible forecast cards, and cramped layout reduce its usefulness.

## Acceptance Criteria

- [x] Display current temperature as hero element (`text-4xl font-light`)
- [x] Horizontal scroll forecast strip for multi-day forecast
- [x] Fix `text-[10px]` to `text-xs` minimum (line 276 of `weather-widget.tsx`)
- [x] Increase forecast card visibility — stronger background/border than `bg-gray-50/60`
- [x] Increase wind direction arrow icons from `h-3 w-3` to readable size
- [x] Add blue gradient background to widget
- [x] Standardize widget card style to match BeachStatusWidget (`border`/`bg` treatment)
- [x] Reformat attribution ("Fuente: AEMET/Open-Meteo") as proper card footer

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — C3, I5, WW1–WW3, R4
- `reports/done/v3-vs-production-beach-detail.md` — VPB2
