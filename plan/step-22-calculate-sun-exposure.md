# Step 22: Calculate Sun Exposure

## Objective

Add `sunExposure` object with orientation and shade analysis.

## Field

```typescript
sunExposure?: {
  orientation: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
  morningShade: boolean    // Cliffs block morning sun
  afternoonShade: boolean  // Cliffs block afternoon sun
  estimatedSunHours?: number
}
```

## Data Source

**IGN**: Elevation data for shadow analysis

## Script: `scripts/calculate-sun-exposure.js`

1. Use beach coordinates and nearby elevation data
2. Calculate coastline orientation
3. Analyze surrounding terrain for shade patterns
4. Estimate sun hours based on orientation

**Note**: `orientation` field already exists from step-02. This step adds shade analysis.

## Validation

- [ ] East-facing beaches have morningShade: false
- [ ] Cala-type beaches may have partial shade
