---
id: TSK-049
title: Expand Weather Widget to 5-7 Day Forecast with Wind Arrows
status: complete
priority: P3
tags: [feature]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-29
---

# Expand Weather Widget to 5-7 Day Forecast with Wind Arrows

## Description

As a visitor planning a beach visit, I want to see at least 5 days of weather forecast so I can pick the best day to go.

## Acceptance Criteria

- [ ] Expand `WeatherWidget` from 3 days (today + 2) to 5-7 days (today + 4-6)
- [ ] Keep widget in the sidebar — vertical scroll is natural there
- [ ] Restore rotated wind direction arrows (CSS `transform: rotate(Xdeg)`) using a simple arrow SVG
- [ ] Show wind speed (km/h) alongside the arrow on each day card
- [ ] Keep the UV index badge from v3 (improvement over production)
- [ ] Keep the AEMET / Open-Meteo source label
- [ ] Ensure the expanded widget doesn't make the sidebar excessively long on mobile (consider a "Ver mas dias" expand toggle if > 5 days)

## Context

Production shows 7-day weather in a prominent main-content grid with rotated wind direction arrows. v3 reduced this to 3 days in a sidebar widget with text-only wind info. The sidebar position is correct (v3 has richer main content now), but the data reduction is a regression. See `.backlog/reports/complete/RPT-040-beach-detail-page-v3-vs.md` for full comparison.

## Notes

- The Open-Meteo API already returns 7-day forecast data — this is mainly a rendering change
- Wind direction in degrees should map to a rotated arrow icon, not compass text
- See `.backlog/reports/complete/RPT-040-beach-detail-page-v3-vs.md` section 2 for detailed comparison

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #049)
