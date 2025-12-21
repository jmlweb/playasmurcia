# Step 19: Add Certifications

## Objective

Add `certifications` array with official beach certifications.

## Field

```typescript
certifications?: ("blue-flag" | "q-quality" | "iso-14001" | "ecoplayas")[]
```

## Data Sources

- **FEE**: https://www.banderaazul.org (Blue Flag)
- **ICTE**: https://www.calidadturistica.es (Q de Calidad)
- **ADEAC**: Annual certification lists

## Script: `scripts/add-certifications.js`

1. Download current year's certification lists
2. Match beach names to our database
3. Add to `certifications` array
4. Update `blueFlag` boolean for consistency

**Update frequency**: Annual (spring announcements)

## Validation

- [ ] Certified beaches have correct flags
- [ ] `blueFlag` boolean matches certifications array
