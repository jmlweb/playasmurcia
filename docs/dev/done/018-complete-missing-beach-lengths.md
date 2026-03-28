# Task #018: Complete Missing Beach Lengths

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data
- **Created**: 2026-03-27
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want to know the length of every beach so that I can use the "sort by length" feature reliably.

## Context

Content audit (2026-03-27) identified 30 of 194 beaches (15%) missing the `length` field. This degrades the sort-by-length feature on the homepage.

See [`docs/dev/content-audit.md`](../content-audit.md#3-beach-length) §3 for completion snapshot.

## Acceptance Criteria

- [ ] Script to query OSM Overpass API for beach coastline lengths by coordinates
- [ ] Populate `length` field for the 30 missing beaches
- [ ] Manual verification for beaches not found in OSM
- [ ] Update `content-audit.md` with new coverage stats

## Notes

- Beaches are already geolocated with coordinates, so Overpass queries can match by proximity
- Some beaches may be too small for OSM data — manual measurement via satellite imagery as fallback
- Keep script in `scripts/` if reusable for future beaches
