# Step 14: Generate Vibe Tags

## Objective

Add `tags` array for beach categorization using Ollama.

## Field

```typescript
tags?: string[]
```

## Valid Tags

```
["familiar", "salvaje", "aislada", "urbana", "snorkel", "buceo",
 "deportes-nauticos", "chiringuito", "paseo-maritimo", "nudista",
 "canina", "accesible", "rocosa", "arena-fina", "aguas-tranquilas",
 "calas", "acantilados", "puesta-sol", "fotogenica"]
```

## Script: `scripts/generate-tags.js`

Uses Ollama to analyze description, access, and existing fields to infer appropriate tags.

```javascript
const prompt = `Analiza esta playa y asigna tags apropiados.

Playa: ${beach.name}
Descripción: ${beach.description}
Nudista: ${beach.nudist}
Accesible: ${beach.accessible}
Paseo: ${beach.promenade}

Tags válidos: ${VALID_TAGS.join(', ')}

Responde con array JSON de 2-5 tags más relevantes.`
```

**Estimated time**: ~30 min (Ollama)

## Validation

- [ ] Each beach has 2-5 tags
- [ ] Tags match beach characteristics
