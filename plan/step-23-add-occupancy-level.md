# Step 23: Add Occupancy Level

## Objective

Add `occupancyLevel` field indicating typical crowd levels.

## Field

```typescript
occupancyLevel?: "low" | "medium" | "high"
```

## Criteria

| Level | Description |
|-------|-------------|
| low | Remote calas, difficult access |
| medium | Suburban beaches, moderate access |
| high | Urban beaches, La Manga, major tourist areas |

## Script: `scripts/add-occupancy-level.js`

Inference based on:
- `accessible` field
- `promenade` field
- Municipality (tourist areas)
- Beach type (cala vs playa)

**Alternative**: Use Ollama to infer from description.

## Validation

- [ ] Urban beaches = high
- [ ] Remote calas = low
