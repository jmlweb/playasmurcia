# Step 24: Add Historical Info

## Objective

Add `historicalInfo` field with historical/cultural notes.

## Field

```typescript
historicalInfo?: string  // Brief historical note
```

## Data Source

- Wikipedia (Spanish)
- Local history websites
- Municipal tourism pages

## Script: `scripts/add-historical.js`

1. Search Wikipedia for beach/location
2. Extract relevant historical info
3. Summarize with Ollama if needed

**Note**: Only add for beaches with notable history (Roman ruins, lighthouses, battles, etc.)

## Validation

- [ ] Historical info is accurate
- [ ] Only notable beaches have this field
