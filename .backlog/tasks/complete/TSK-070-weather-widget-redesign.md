---
id: TSK-070
title: Weather Widget Redesign
status: complete
priority: P1
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
started: 2026-03-30
completed: 2026-03-30
---

# Weather Widget Redesign

## Description

As a visitor on a beach detail page, I want a clear, beautiful weather display so that I can quickly understand current and upcoming conditions.

## Acceptance Criteria

- [x] Display current temperature as hero element (`text-4xl font-light`)
- [x] Horizontal scroll forecast strip for multi-day forecast
- [x] Fix `text-[10px]` to `text-xs` minimum (line 276 of `weather-widget.tsx`)
- [x] Increase forecast card visibility — stronger background/border than `bg-gray-50/60`
- [x] Increase wind direction arrow icons from `h-3 w-3` to readable size
- [x] Add blue gradient background to widget
- [x] Standardize widget card style to match BeachStatusWidget (`border`/`bg` treatment)
- [x] Reformat attribution ("Fuente: AEMET/Open-Meteo") as proper card footer

## Context

UI audit (2026-03-29) identified the weather widget as one of the weakest visual components. Tiny fonts (`text-[10px]`), near-invisible forecast cards, and cramped layout reduce its usefulness.

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — C3, I5, WW1–WW3, R4
- `.backlog/reports/complete/RPT-040-beach-detail-page-v3-vs.md` — VPB2

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #070)
