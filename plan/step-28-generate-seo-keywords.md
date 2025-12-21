# Step 28: Generate SEO Keywords

## Objective

Add `seoKeywords` array for search optimization.

## Field

```typescript
seoKeywords?: string[]  // 5-10 keywords
```

## Script: `scripts/generate-seo-keywords.js`

Uses Ollama to extract relevant keywords:

```javascript
const prompt = `Extrae 5-10 palabras clave SEO para esta playa.

Playa: ${beach.name}
Municipio: ${municipality}
Descripción: ${beach.description}
Servicios: ${beach.services?.join(', ')}
Actividades: ${beach.activities?.join(', ')}

Incluir:
- Nombre de playa
- Municipio/zona
- Tipo de playa
- Actividades principales
- Características únicas

Responde con array JSON de keywords.`
```

**Estimated time**: ~20 min

## Validation

- [ ] 5-10 keywords per beach
- [ ] Keywords are relevant and searchable
