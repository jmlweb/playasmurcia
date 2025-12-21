# Step 20: Add Protected Areas

## Objective

Add `protectedArea` object for beaches within protected natural spaces.

## Field

```typescript
protectedArea?: {
  isProtected: boolean
  name?: string        // "Parque Regional de Calblanque"
  type?: "parque-natural" | "red-natura-2000" | "lic" | "zepa" | "reserva-marina"
  restrictions?: string[]  // ["no-anchorage", "no-fishing"]
}
```

## Data Source

**MITECO**: https://www.miteco.gob.es/es/biodiversidad/servicios/banco-datos-naturaleza/

Download: Protected areas shapefile

## Murcia Protected Areas

- Parque Regional de Cabo Cope y Puntas de Calnegre
- Parque Regional de Calblanque
- Espacios abiertos e islas del Mar Menor
- Sierra de la Fausilla

## Script: `scripts/add-protected-areas.js`

1. Download protected areas shapefile
2. Check if beach coordinates fall within boundaries
3. Extract protection type and name
4. Add restrictions if applicable

## Validation

- [ ] Known protected beaches flagged correctly
- [ ] Calblanque beaches have protection info
