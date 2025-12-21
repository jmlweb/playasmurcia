# Service: Google Reviews Widget

## Description

Display user reviews from Google Places API on beach pages.

## Details

- **API**: Google Places Details API
- **Fields**: rating, reviews, user_ratings_total
- **Auth**: Requires Google API key (has usage costs)
- **Cache**: 24 hours

## Prerequisites

- Requires `googlePlaceId` field in beaches.json (see step-18-add-google-place-ids.md)

## Implementation Notes

- Respect Google ToS for displaying reviews
- Implement rate limiting to respect API quotas
- Consider client-side caching

## Source

Extracted from `docs/CREATE_SERVICES.md`
