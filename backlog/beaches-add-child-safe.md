# Add Child Safe

## Objective

Add `childSafe` boolean to indicate beaches suitable for young children.

## Field

```typescript
childSafe?: boolean
```

## Data Source

Inferred from existing fields using Ollama:
- `tags` array (familiar, aguas-tranquilas)
- `sea` field (Mar Menor = calmer waters)
- `soilType` (fine sand preferred)
- `waves` field if present
- `lifeguard` boolean

## Script: `scripts/add-child-safe.js`

```javascript
const prompt = `Is this beach safe for young children (under 6)?

Beach: ${beach.name}
Sea: ${seaName} // Mar Menor is calmer
Soil: ${beach.soilType}
Tags: ${tags.join(', ')}
Has lifeguard: ${beach.lifeguard}
Waves: ${beach.waves || 'unknown'}

Respond with ONLY: true or false

Criteria for true:
- Calm, shallow waters (Mar Menor preferred)
- Fine sand without rocks
- Lifeguard service
- No strong currents or waves
- "familiar" or "aguas-tranquilas" tags
`
```

## Validation

- [ ] All Mar Menor beaches reviewed (typically safer)
- [ ] Beaches with "familiar" tag are childSafe: true
- [ ] Rocky beaches are childSafe: false
- [ ] Distribution is reasonable (~40% true)
