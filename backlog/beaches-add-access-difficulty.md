# Add Access Difficulty

## Objective

Add `accessDifficulty` field to help users plan their visit based on physical requirements.

## Field

```typescript
accessDifficulty?: "easy" | "moderate" | "hard"
```

## Data Source

Inferred from existing fields using Ollama:
- `access` field (main source)
- `tags` array (acantilados, aislada, salvaje)
- `services` array (wheelchair-ramp indicates easy)

## Script: `scripts/add-access-difficulty.js`

```javascript
const prompt = `Rate the access difficulty for this beach.

Access description: ${beach.access}
Tags: ${tags.join(', ')}
Has wheelchair ramp: ${hasWheelchairRamp}

Respond with ONLY one of: easy, moderate, hard

Rules:
- "easy": paved roads, parking nearby, no stairs, wheelchair accessible
- "moderate": some stairs, short walk on unpaved path, minor obstacles
- "hard": cliff descent, long hike, 4x4 required, no marked path
`
```

## Validation

- [ ] Beaches with "accesible" tag are "easy"
- [ ] Beaches with "acantilados" or "aislada" tags reviewed
- [ ] Distribution is reasonable (~60% easy, ~30% moderate, ~10% hard)
