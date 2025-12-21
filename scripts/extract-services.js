import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const SAVE_INTERVAL = 10

const VALID_SERVICES = [
  'showers',
  'toilets',
  'restaurant',
  'bar',
  'chiringuito',
  'parking',
  'umbrellas',
  'sunbeds',
  'footwash',
  'first-aid',
  'wheelchair-ramp',
  'floating-chairs',
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
  const parkingInfo = beach.accessInfo?.hasParking
  const accessibleInfo = beach.accessible

  return `Analiza esta playa y extrae los servicios disponibles.

Playa: ${beach.name}
Descripción: ${beach.description || 'No disponible'}
Acceso: ${beach.access || 'No disponible'}
Accesible para personas con movilidad reducida: ${accessibleInfo ? 'Sí' : 'No'}
Paseo marítimo: ${beach.promenade ? 'Sí' : 'No'}
Tiene parking: ${parkingInfo === true ? 'Sí' : parkingInfo === false ? 'No' : 'Desconocido'}

Servicios posibles y su significado:
- showers: duchas
- toilets: aseos/baños
- restaurant: restaurante
- bar: bar
- chiringuito: chiringuito/quiosco de playa
- parking: aparcamiento
- umbrellas: alquiler de sombrillas
- sunbeds: alquiler de hamacas/tumbonas
- footwash: lavapiés
- first-aid: puesto de primeros auxilios
- wheelchair-ramp: rampa para sillas de ruedas
- floating-chairs: sillas anfibias para baño

IMPORTANTE:
- Solo incluye servicios que se mencionen EXPLÍCITAMENTE o se deduzcan claramente
- Si la playa es accesible, incluye "wheelchair-ramp"
- Si tiene parking confirmado, incluye "parking"
- Las calas remotas/naturales normalmente NO tienen servicios

Responde SOLO con un array JSON de servicios detectados.
Si no hay servicios claros o es una playa natural sin servicios, responde: []
Ejemplo: ["parking", "showers", "chiringuito"]`
}

function parseServices(response) {
  try {
    const match = response.match(/\[[\s\S]*?\]/)
    if (!match) return []

    const parsed = JSON.parse(match[0])
    return parsed.filter(s => VALID_SERVICES.includes(s))
  } catch {
    return []
  }
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  let processed = 0
  let skipped = 0

  console.log(`Processing ${beaches.length} beaches...\n`)

  for (const beach of beaches) {
    if (beach.services !== undefined) {
      skipped++
      continue
    }

    try {
      const prompt = buildPrompt(beach)
      const response = await callOllama(prompt)
      beach.services = parseServices(response)

      // Auto-add based on existing data
      if (beach.accessible && !beach.services.includes('wheelchair-ramp')) {
        beach.services.push('wheelchair-ramp')
      }
      if (beach.accessInfo?.hasParking === true && !beach.services.includes('parking')) {
        beach.services.push('parking')
      }

      processed++
      const servicesStr = beach.services.length > 0 ? beach.services.join(', ') : '(none)'
      console.log(`[${processed}] ${beach.name}: ${servicesStr}`)

      if (processed % SAVE_INTERVAL === 0) {
        writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
        console.log(`  → Saved progress (${processed} beaches)`)
      }
    } catch (error) {
      console.error(`Error: ${beach.name}: ${error.message}`)
      beach.services = []
      processed++
    }
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`\nDone!`)
  console.log(`Processed: ${processed}`)
  console.log(`Skipped (already had services): ${skipped}`)

  // Summary
  const withServices = beaches.filter(b => b.services?.length > 0).length
  console.log(`\nBeaches with services: ${withServices}/${beaches.length}`)
}

main().catch(console.error)
