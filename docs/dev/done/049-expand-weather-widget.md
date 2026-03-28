# Task #049: Expand Weather Widget to 5-7 Day Forecast with Wind Arrows

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Feature
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor planning a beach visit, I want to see at least 5 days of weather forecast so I can pick the best day to go.

## Context

Production shows 7-day weather in a prominent main-content grid with rotated wind direction arrows. v3 reduced this to 3 days in a sidebar widget with text-only wind info. The sidebar position is correct (v3 has richer main content now), but the data reduction is a regression. See `docs/dev/reports/processed/v3-vs-production-beach-detail.md` for full comparison.

## Acceptance Criteria

- [ ] Expand `WeatherWidget` from 3 days (today + 2) to 5-7 days (today + 4-6)
- [ ] Keep widget in the sidebar — vertical scroll is natural there
- [ ] Restore rotated wind direction arrows (CSS `transform: rotate(Xdeg)`) using a simple arrow SVG
- [ ] Show wind speed (km/h) alongside the arrow on each day card
- [ ] Keep the UV index badge from v3 (improvement over production)
- [ ] Keep the AEMET / Open-Meteo source label
- [ ] Ensure the expanded widget doesn't make the sidebar excessively long on mobile (consider a "Ver mas dias" expand toggle if > 5 days)

## Notes

- The Open-Meteo API already returns 7-day forecast data — this is mainly a rendering change
- Wind direction in degrees should map to a rotated arrow icon, not compass text
- See `docs/dev/reports/processed/v3-vs-production-beach-detail.md` section 2 for detailed comparison
