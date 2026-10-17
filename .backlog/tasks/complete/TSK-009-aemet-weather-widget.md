---
id: TSK-009
title: AEMET Weather Widget
status: complete
priority: P4
tags: [frontend]
created: 2026-03-22
source: manual
depends-on: [TSK-003]
completed: 2026-03-27
---

# AEMET Weather Widget

## Description

As a beachgoer, I want to see real-time weather predictions for each beach so that I can decide when to visit.

## Acceptance Criteria

- [ ] Weather component created displaying cloud, precipitation, wind, UV index
- [ ] AEMET API integrated (`/api/prediccion/especifica/playa/{aemetId}`)
- [ ] API key management (env var `AEMET_API_KEY`)
- [ ] Response cached for 30 minutes
- [ ] Graceful handling of API errors and rate limits
- [ ] Only shown for beaches with `aemetId` (65 beaches)
- [ ] Loading and error states
- [ ] Homepage beach cards show current temperature + wind indicator (see `.backlog/reports/complete/RPT-040-beach-detail-page-v3-vs.md` for production vs v3 weather UI)
- [ ] Beach detail page shows multi-day forecast with min/max temps, conditions, wind (see `.backlog/reports/complete/RPT-040-beach-detail-page-v3-vs.md`, weather section)

## Notes

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

## Learnings

(None yet)

## Progress Log

(No progress yet)
- [2026-10-17] Migrated from legacy backlog/ (originally task #009)
