# Task #029: Current Weather on Beach Cards

## Metadata
- **Status**: done
- **Priority**: P3 - Later
- **Slice**: Full-stack
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor browsing the beach list, I want to see the current weather on each card so that I can quickly find beaches with good conditions right now.

## Context

Gap analysis (`docs/github-main-feature-gap-analysis.md`, section 1) identified that the production site shows current weather on each card in the grid (`WeatherBox` in `ItemsGrid`), while v3 cards only show occupancy, municipality, and tags.

## Acceptance Criteria

- [ ] BeachCard displays current temperature and weather icon
- [ ] Weather data fetched efficiently (batched or pre-fetched, not 194 individual API calls)
- [ ] Compact display that doesn't clutter the card (icon + temperature, e.g., "☀️ 24°")
- [ ] Graceful fallback: if weather unavailable, card renders normally without weather
- [ ] Cards on homepage (featured) and explore page show weather
- [ ] Performance: weather fetch doesn't block initial page render (streaming or deferred)
- [ ] Build passes, no visual regressions on card layout

## Technical Notes

- Requires #028 for coordinate-based weather; without it only 33% of cards would show weather
- Open-Meteo supports multi-point queries — batch nearby beaches to reduce API calls
- Consider server-side pre-fetching weather for all displayed beaches in the route loader
- Weather on cards should be cached aggressively (1-2 hour TTL is fine for "current" on a list)
- Keep the card compact: this is glanceable info, not a full forecast

## Vertical Slice

**API batching → card UI → route integration**: Efficient multi-beach weather fetch, compact card component update, wired into explore/home route loaders.
