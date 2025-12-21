# Add Natural Shade

## Objective

Add `naturalShade` boolean to indicate beaches with natural shade from cliffs, trees, or vegetation.

## Field

```typescript
naturalShade?: boolean
```

## Data Source

Inferred from existing fields using Ollama:
- `description` field (mentions pines, cliffs, trees)
- `tags` array (acantilados provides morning/afternoon shade)
- `orientation` field (east-facing cliffs provide afternoon shade)

## Script: `scripts/add-natural-shade.js`

```javascript
const prompt = `Does this beach have natural shade from cliffs, trees, or vegetation?

Beach: ${beach.name}
Description: ${beach.description}
Tags: ${tags.join(', ')}
Orientation: ${beach.orientation}

Respond with ONLY: true or false

Criteria for true:
- Mentions pines, trees, vegetation, palms
- Has cliffs (acantilados) that cast shadow
- Mentions natural shade or sombra natural
- Coves (calas) with high walls

Criteria for false:
- Open, exposed beaches
- No mention of vegetation or cliffs
- Wide sandy beaches without shelter
`
```

## Validation

- [ ] Beaches with "acantilados" tag reviewed
- [ ] Calas with high walls are typically true
- [ ] Wide urban beaches are typically false
- [ ] Distribution is reasonable (~25% true)
