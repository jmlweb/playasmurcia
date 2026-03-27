# Task #020: Improve Schema.org Structured Data

## Metadata
- **Status**: pending
- **Priority**: P2 - Next
- **Slice**: SEO
- **Created**: 2026-03-27
- **Started**: -
- **Blocked by**: #003

## User Story

As a site owner, I want rich Schema.org markup on every beach page so that Google shows enhanced search results (rich snippets).

## Context

Current `generateBeachSchema` in `src/lib/schema.ts` only emits `@type: "Beach"` with amenities. Missing properties that improve rich results:
- `image` — beach photos
- `url` — canonical page URL
- `geo` — GeoCoordinates (latitude/longitude already available)
- `description` — page description

Municipality schema hardcodes `https://www.playasmurcia.com` as base URL.

## Acceptance Criteria

- [ ] Add `image` property using first picture from `pictures` array
- [ ] Add `url` property with canonical beach page URL
- [ ] Add `geo` property with `GeoCoordinates` from existing coordinates
- [ ] Add `description` property from beach description
- [ ] Fix municipality schema to use actual production domain (env variable)
- [ ] Validate with Google Rich Results Test

## Notes

- Requires production URL to be configured (depends on #003)
- Test with Google's Structured Data Testing Tool after deploy
