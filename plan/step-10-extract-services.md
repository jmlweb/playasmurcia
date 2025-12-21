# Step 10: Extract Services

## Objective

Add `services` array field by extracting available services from beach descriptions and access info using Ollama.

## Services Values

```typescript
type Service =
  | "showers"
  | "toilets"
  | "restaurant"
  | "bar"
  | "chiringuito"
  | "parking"
  | "umbrellas"
  | "sunbeds"
  | "footwash"
  | "first-aid"
  | "wheelchair-ramp"
  | "floating-chairs"
```

## Implementation

### Script: `scripts/extract-services.js`

Uses Ollama (gemma3:4b) to analyze description and access fields.

```javascript
import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const SAVE_INTERVAL = 10

const VALID_SERVICES = [
  'showers', 'toilets', 'restaurant', 'bar', 'chiringuito',
  'parking', 'umbrellas', 'sunbeds', 'footwash', 'first-aid',
  'wheelchair-ramp', 'floating-chairs'
]

async function callOllama(prompt) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3:4b',
      prompt,
      stream: false,
    }),
  })
  const data = await response.json()
  return data.response.trim()
}

function buildPrompt(beach) {
  return `Analiza esta playa y extrae los servicios disponibles.

Playa: ${beach.name}
Descripción: ${beach.description}
Acceso: ${beach.access}
Accesible: ${beach.accessible ? 'Sí' : 'No'}
Paseo marítimo: ${beach.promenade ? 'Sí' : 'No'}

Servicios posibles: ${VALID_SERVICES.join(', ')}

Responde SOLO con un array JSON de servicios detectados.
Si no hay servicios claros, responde: []
Ejemplo: ["parking", "showers", "chiringuito"]`
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  let processed = 0

  for (const beach of beaches) {
    if (beach.services !== undefined) continue

    try {
      const prompt = buildPrompt(beach)
      const response = await callOllama(prompt)

      // Parse response
      const match = response.match(/\[.*\]/)
      const services = match ? JSON.parse(match[0]) : []

      // Validate services
      beach.services = services.filter(s => VALID_SERVICES.includes(s))

      processed++
      console.log(`[${processed}] ${beach.name}: ${beach.services.join(', ') || '(none)'}`)

      if (processed % SAVE_INTERVAL === 0) {
        writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
      }
    } catch (error) {
      console.error(`Error: ${beach.name}: ${error.message}`)
      beach.services = []
    }
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`Done! Processed ${processed} beaches`)
}

main().catch(console.error)
```

## Execution

```bash
ollama serve  # if not running
node scripts/extract-services.js
```

**Estimated time**: ~30 min (194 beaches)

## Validation

- [ ] All beaches have `services` array (can be empty)
- [ ] Only valid service values used
- [ ] Urban beaches have more services than remote calas
