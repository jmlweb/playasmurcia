# Step 16: Add Best Season

## Objective

Add `bestSeason` array indicating optimal visiting seasons.

## Field

```typescript
bestSeason?: ("spring" | "summer" | "autumn" | "winter")[]
```

## Script: `scripts/add-best-season.js`

Uses Ollama to infer best seasons based on:
- Beach orientation (south-facing = more sun)
- Protection from wind
- Water temperature (Mar Menor warmer in spring/autumn)
- Crowd levels

Most beaches: `["spring", "summer", "autumn"]`
Some sheltered: `["spring", "summer", "autumn", "winter"]`

**Estimated time**: ~20 min (Ollama)

## Validation

- [ ] All beaches have at least one season
- [ ] Summer included for most beaches
