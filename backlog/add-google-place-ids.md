# Step 18: Add Google Place IDs

## Objective

Add `googlePlaceId` for Google Reviews integration.

## Field

```typescript
googlePlaceId?: string  // e.g., "ChIJ..."
```

## Data Source

**Google Places API**: https://developers.google.com/maps/documentation/places/web-service

## Script: `scripts/add-google-place-ids.js`

```javascript
// Nearby Search with beach coordinates
const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
  `location=${lat},${lng}&radius=100&keyword=${beachName}&key=${API_KEY}`
```

1. Query by coordinates + beach name
2. Filter results by name similarity
3. Store `place_id`

**Cost**: Google Places API has usage costs. Run once.

**Requires**: `GOOGLE_PLACES_API_KEY` environment variable

## Validation

- [ ] Place IDs are valid format
- [ ] Major beaches have IDs
