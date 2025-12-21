# Step 11: Add Water Quality

## Objective

Add `waterQuality` field from MITECO annual beach census.

## Field

```typescript
waterQuality?: "excellent" | "good" | "sufficient" | "poor"
```

## Data Source

**MITECO**: https://www.miteco.gob.es/en/cartografia-y-sig/ide/descargas/agua/censo-aguas-bano.html

- Format: Shapefile (.shp)
- Update: Annual (summer sampling)
- Filter: Province code 30 (Murcia)

## Script: `scripts/add-water-quality.js`

1. Download latest Shapefile from MITECO
2. Parse with a geospatial library (e.g., `shapefile` npm package)
3. Filter by Murcia region
4. Match beach names to our database (fuzzy matching)
5. Map `calidad` field to our schema

## Validation

- [ ] Beaches matched correctly by name
- [ ] Values are one of: excellent, good, sufficient, poor
