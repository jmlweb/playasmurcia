# Step 21: Add Seabed Type

## Objective

Add `seabedType` field indicating underwater terrain.

## Field

```typescript
seabedType?: "arena" | "posidonia" | "roca" | "grava" | "mixto"
```

## Data Source

**IEO** (Instituto Español de Oceanografía): Marine cartography

## Importance

- Posidonia = Protected, excellent for snorkeling
- Rock = Good for diving
- Sand = Best for swimming

## Script: `scripts/add-seabed-type.js`

1. Query IEO marine cartography by coordinates
2. Extract seabed classification
3. Flag posidonia presence (high ecological value)

**Alternative**: Use Ollama to infer from beach descriptions if IEO data unavailable.

## Validation

- [ ] Rocky calas have "roca" or "mixto"
- [ ] Sandy urban beaches have "arena"
