# Task #009: AEMET Weather Widget

## Metadata
- **Status**: pending
- **Priority**: P4
- **Slice**: Frontend
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: #003

## User Story

As a beachgoer, I want to see real-time weather predictions for each beach so that I can decide when to visit.

## Acceptance Criteria

- [ ] Weather component created displaying cloud, precipitation, wind, UV index
- [ ] AEMET API integrated (`/api/prediccion/especifica/playa/{aemetId}`)
- [ ] API key management (env var `AEMET_API_KEY`)
- [ ] Response cached for 30 minutes
- [ ] Graceful handling of API errors and rate limits
- [ ] Only shown for beaches with `aemetId` (65 beaches)
- [ ] Loading and error states
- [ ] Homepage beach cards show current temperature + wind indicator (see v3 comparison report, point 3)
- [ ] Beach detail page shows multi-day forecast with min/max temps, conditions, wind (see v3 comparison report, point 4)

## Implementation Notes

- API: `GET /api/prediccion/especifica/playa/{aemetId}`
- Auth: Requires free API key from https://opendata.aemet.es
- Weather data is ephemeral - display only, do not store
- Beaches already have `aemetId` field

## Files to Modify

- `src/components/weather-widget.tsx` (new)
- `src/routes/playas/$slug.tsx` (integrate widget)
- `src/lib/aemet.ts` (API client, new)
- `.env.example` (add AEMET_API_KEY)

## Dependencies

- #003 (Deploy to production - needs server-side API proxy)

## Progress Log

(No progress yet)

## Learnings

(None yet)
