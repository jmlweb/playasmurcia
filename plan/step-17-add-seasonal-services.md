# Step 17: Add Seasonal Services

## Objective

Add `seasonalServices` object with service availability dates.

## Field

```typescript
seasonalServices?: {
  lifeguardStart?: string  // "2025-06-15"
  lifeguardEnd?: string    // "2025-09-15"
  chiringuito?: boolean
  accessibilityRamp?: boolean
}
```

## Data Sources

- **112 Murcia**: Lifeguard deployment dates
- **Municipal BOPs**: Official service announcements
- **Tourism offices**: Chiringuito licenses

## Typical Murcia Dates

- Lifeguard: June 15 - September 15 (main beaches)
- Extended: June 1 - September 30
- Chiringuitos: Easter - October

## Script: `scripts/add-seasonal-services.js`

Manual research + script to apply dates by municipality.

## Validation

- [ ] Dates are valid ISO format
- [ ] Main beaches have lifeguard dates
