# Task #007: Add Water Quality

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data
- **Created**: 2026-03-22
- **Started**: -
- **Blocked by**: -

## User Story

As a beachgoer, I want to see the official water quality rating for each beach so that I can make informed decisions about where to swim.

## Acceptance Criteria

- [ ] `waterQuality` field added to schema (`"excellent" | "good" | "sufficient" | "poor"`)
- [ ] Script `scripts/add-water-quality.js` created
- [ ] MITECO Shapefile downloaded and parsed
- [ ] Beaches matched correctly by name (fuzzy matching)
- [ ] Values validated against allowed enum
- [ ] Database schema and migration updated
- [ ] Beach detail page displays water quality badge

## Implementation Notes

Data source: MITECO annual beach census
- URL: https://www.miteco.gob.es/en/cartografia-y-sig/ide/descargas/agua/censo-aguas-bano.html
- Format: Shapefile (.shp)
- Update: Annual (summer sampling)
- Filter: Province code 30 (Murcia)

Requires `shapefile` npm package for parsing.

Script should be **retained** (data changes annually).

## Files to Modify

- `src/db/schema.ts` (add field)
- `scripts/add-water-quality.js` (create and retain)
- `data/beaches.json` (add field values)
- `src/routes/playas/$slug.tsx` (display field)

## Dependencies

-

## Progress Log

(No progress yet)

## Learnings

(None yet)
