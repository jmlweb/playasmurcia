# Task #108: Wind and Flag on Beach Cards, "Cómo llegar" Button

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Frontend
- **Created**: 2026-10-16
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor comparing beaches for today, I want to see wind and flag status on each card and get directions in one tap so that I can choose and go without opening every detail page.

## Acceptance Criteria

- [ ] Beach cards show current wind speed and direction next to the existing temperature (data from the Open-Meteo current call already used for `CardWeather`)
- [ ] Beach cards show the 112 flag status (verde/amarilla/roja) when available; when there is no data, nothing is shown (no empty badge, no layout shift)
- [ ] Flag status for listings is fetched in a way that does not fire one request per card against the 112 source (batch or cached server function, respecting existing edge caching)
- [ ] Beach detail page has a prominent "Cómo llegar" button using a directions URL (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`), opening in a new tab
- [ ] Wind, flag, and button have accessible labels in Spanish with correct diacritics
- [ ] Component tests for the new card elements; visual check on desktop and mobile with `pnpm tsx scripts/screenshot.ts`

## Implementation Notes

Cards already render temperature and a weather icon via `CardWeather` (`src/lib/open-meteo.ts`, task #029). Extend that type with wind rather than adding a new fetch. Flag data comes from `src/lib/beach-status-112` (used by `beach-status-widget.tsx`); investigate whether the 112 source can return all beaches in one call before designing the card integration. The existing "Ver en Google Maps" link in `location-map.tsx` is a search link, not directions — keep it or replace it, but don't show two near-duplicate links.

Origin: visitor-perspective UX brainstorm (2026-10-16), top-3 suggestion #3.

## Files to Modify

- `src/lib/open-meteo.ts` (`CardWeather`)
- `src/features/beaches/beach-card.tsx`
- `src/lib/beach-status-112.ts` (batch/cached lookup)
- `src/routes/playas/$slug.tsx` or `src/features/beaches/practical-info-card.tsx` (directions button)
- `src/features/beaches/location-map.tsx` (link cleanup)

## Dependencies

-

## Progress Log

(No progress yet)

## Learnings

(None yet)
