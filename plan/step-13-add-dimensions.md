# Step 13: Add Beach Dimensions

## Objective

Add `length` and `avgWidth` fields from OSM and MITECO.

## Fields

```typescript
length?: number    // Beach length in meters
avgWidth?: number  // Average width in meters
```

## Data Sources

1. **OpenStreetMap**: Overpass API for beach geometries
2. **MITECO Guía de Playas**: Official measurements

## Script: `scripts/add-dimensions.js`

### OSM Approach
```
[out:json];
area["name"="Región de Murcia"]->.murcia;
way["natural"="beach"](area.murcia);
out body geom;
```

Calculate length from way geometry using Haversine formula.

### MITECO Approach
Scrape or API query for official beach dimensions.

## Validation

- [ ] Lengths are reasonable (10-2000m)
- [ ] Widths are reasonable (5-200m)
