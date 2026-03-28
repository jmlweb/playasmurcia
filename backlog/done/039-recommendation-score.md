# Task #039: Recommendation Score and "Recomendados" Sort Order

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Data + Frontend
- **Created**: 2026-03-28
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor unfamiliar with Murcia's beaches, I want to sort listings by "Recomendados" so that I discover the best beaches without having to research each one.

## Acceptance Criteria

- [ ] A `recommendationScore` field (0-1) is computed and stored for every beach
- [ ] Internal score uses existing data: services count (30%), length (15%), photo quality (10%), accessibility (15%), blue flag (15%), child-safe (10%), natural shade (5%)
- [ ] Enrichment script fetches external popularity signals from Google Places API (rating + review count) and OpenStreetMap Overpass (nearby amenities within 500m)
- [ ] External popularity boost is integrated into the final score with configurable weight
- [ ] "Recomendados" is available as a sort option in the beach explorer
- [ ] "Recomendados" is the default sort order
- [ ] Beaches with no external data receive a neutral score (not penalized)

## Implementation Notes

### Phase 1 — Internal score (no external APIs)
- Compute score from existing beach data fields
- Add `recommendationScore` column to DB schema
- Wire up as sort option in explorer

### Phase 2 — External enrichment script
- `scripts/enrich-popularity.ts` fetches Google Places + OSM data
- Google Places: rating + userRatingCount (log-normalized) per beach coordinates
- OSM Overpass: count amenities within 500m bounding box
- Store raw external data in a `beach_popularity` table or JSON fields
- Requires: Google Places API key (new env var `GOOGLE_PLACES_API_KEY`)

### Phase 3 — Combined score
- Merge internal quality score with external popularity boost
- Suggested split: 60% internal + 40% popularity
- Popularity formula: `googleReviews (log-norm) * 0.40 + googleRating (norm) * 0.30 + osmAmenities (norm) * 0.30`

### Optional Tier 2 signals (future)
- Wikipedia pageviews API (free, no key)
- Wikidata sitelinks count (free, SPARQL)
- Flickr geotagged photo count (free API key)
- Bandera Azul annual status (manual/scrape)

### Run frequency
- Internal score: recomputed on deploy or data change
- External enrichment: quarterly (script in `scripts/`)

## Files to Modify

- `src/db/schema.ts` — add `recommendationScore` column
- `src/lib/db-data.ts` — sort by score, recompute logic
- `src/lib/beach-filters.ts` — add "recomendados" sort option
- `src/components/filter-panel.tsx` — UI for new sort option
- `scripts/enrich-popularity.ts` — new external enrichment script
- `scripts/compute-recommendation-score.ts` — new internal score script
- `.env.example` — add `GOOGLE_PLACES_API_KEY`

## Dependencies

-

## Progress Log

(No progress yet)

## Learnings

(None yet)
