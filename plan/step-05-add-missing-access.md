# Step 05: Add Missing Access Field

## Objective

Add the required `access` field to 5 beaches that currently have it empty.

## Affected Beaches

| Code | Name | Municipality |
|------|------|--------------|
| 571 | (to investigate) | - |
| 530 | (to investigate) | - |
| 4894 | (to investigate) | - |
| 585 | (to investigate) | - |
| 4893 | (to investigate) | - |

## Implementation

### Option A: Manual Research

1. Look up each beach location using coordinates
2. Research access routes via Google Maps / official sources
3. Write Spanish access descriptions (2-3 sentences)

### Option B: AI-Generated (Ollama)

Use `scripts/generate-descriptions.js` pattern to generate access info:

```javascript
// Prompt template for Ollama
const prompt = `
Describe how to access this beach in Spanish (2-3 sentences).
Beach: ${beach.name}
Municipality: ${municipality}
Coordinates: ${beach.coordinates}
Focus on: roads, parking, walking paths, public transport if available.
`;
```

## Field Format

```typescript
access: string  // Spanish, 2-3 sentences describing how to reach the beach
```

## Example

```json
{
  "access": "Se accede por la carretera RM-332 desde Águilas. Dispone de aparcamiento gratuito junto a la playa."
}
```

## Validation

- [ ] All 5 beaches have non-empty `access` field
- [ ] Text is in Spanish
- [ ] Descriptions are accurate and helpful

## Source

Detected by validation script against `data/CLAUDE.md` schema rules.
