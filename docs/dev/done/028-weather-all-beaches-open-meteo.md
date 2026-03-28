# Task #028: Coordinate-Based Weather for All Beaches (Open-Meteo)

## Metadata
- **Status**: done
- **Priority**: P2 - Next
- **Slice**: Full-stack
- **Created**: 2026-03-28
- **Started**: 2026-03-28
- **Completed**: 2026-03-28
- **Blocked by**: -

## User Story

As a visitor viewing any beach, I want to see weather information so that I can plan my visit regardless of whether the beach has an AEMET station.

## Context

Gap analysis (`docs/github-main-feature-gap-analysis.md`, section 1) identified that only 65 of 194 beaches (33%) have `aemetId` and show weather. The production site uses Open-Meteo with latitude/longitude to cover 100% of beaches. This is the biggest feature coverage gap.

## Acceptance Criteria

- [ ] New `src/lib/open-meteo.ts` module fetching weather by coordinates (lat/lng)
- [ ] Data includes: current temperature, weather condition, wind speed/direction, UV index
- [ ] Forecast includes at least current day + 2 following days (parity with AEMET widget)
- [ ] Beach detail page shows Open-Meteo weather when `aemetId` is absent
- [ ] When `aemetId` is present, AEMET remains the primary source (more authoritative for coastal data)
- [ ] Cache Open-Meteo responses (via Cache API if #026 is done, else in-memory with TTL)
- [ ] WeatherWidget adapted to render both AEMET and Open-Meteo data formats
- [ ] All 194 beaches show weather on their detail page
- [ ] Build passes, no regressions on existing AEMET weather

## Technical Notes

- Open-Meteo API is free, no API key required: `https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&...`
- All beaches already have `latitude` and `longitude` in the database
- The WeatherWidget may need a unified data model or adapter pattern to render both sources
- Consider in-flight deduplication for nearby beaches sharing similar coordinates

## Vertical Slice

**Data fetch → adaptation → UI**: New API client, adapter for existing widget, conditional source selection on beach detail. One complete weather experience delivered.
