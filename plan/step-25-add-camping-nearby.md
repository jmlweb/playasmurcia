# Step 25: Add Camping Nearby

## Objective

Add `campingNearby` boolean for beaches near camping facilities.

## Field

```typescript
campingNearby?: boolean
```

## Data Source

- OpenStreetMap (tourism=camp_site)
- Camping directories

## Script: `scripts/add-camping.js`

1. Query OSM for campsites within 5km of beach
2. Set `campingNearby: true` if found

```
[out:json];
node["tourism"="camp_site"](around:5000,{lat},{lng});
out count;
```

## Validation

- [ ] Known camping areas flagged correctly
