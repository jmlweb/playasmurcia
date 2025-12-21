# Step 27: Generate Meta Descriptions

## Objective

Add `metaDescription` field for SEO.

## Field

```typescript
metaDescription?: string  // 150-160 chars, Spanish
```

## Script: `scripts/generate-meta-descriptions.js`

Uses Ollama to generate SEO-optimized meta descriptions:

```javascript
const prompt = `Genera una meta descripción SEO para esta playa.

Playa: ${beach.name}
Municipio: ${municipality}
Descripción: ${beach.description}

Requisitos:
- Máximo 160 caracteres
- Incluir nombre de playa y municipio
- Usar palabras clave relevantes
- Llamada a la acción sutil

Responde solo con la meta descripción.`
```

**Estimated time**: ~30 min

## Validation

- [ ] Length 150-160 chars
- [ ] Contains beach name
- [ ] SEO-friendly language
