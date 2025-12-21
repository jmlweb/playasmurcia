/**
 * Script to generate beach vibe tags using Ollama (gemma3:4b)
 * Run: node scripts/generate-tags.js
 */

import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'gemma3:4b'

const VALID_TAGS = [
  'familiar', 'salvaje', 'aislada', 'urbana', 'snorkel', 'buceo',
  'deportes-nauticos', 'chiringuito', 'paseo-maritimo', 'nudista',
  'canina', 'accesible', 'rocosa', 'arena-fina', 'aguas-tranquilas',
  'calas', 'acantilados', 'puesta-sol', 'fotogenica'
]

function getAutomaticTags(beach) {
  const tags = []

  if (beach.nudist) tags.push('nudista')
  if (beach.dogFriendly) tags.push('canina')
  if (beach.promenade) tags.push('paseo-maritimo')
  if (beach.services?.includes('chiringuito')) tags.push('chiringuito')
  if (beach.services?.includes('wheelchair-ramp') || beach.services?.includes('floating-chairs')) {
    tags.push('accesible')
  }

  // Mar Menor = aguas tranquilas
  if (beach.sea === 1) tags.push('aguas-tranquilas')

  // Soil type inference
  const soil = (beach.soilType || '').toLowerCase()
  if (soil.includes('fina') || soil.includes('dorada') || soil.includes('blanca')) {
    tags.push('arena-fina')
  }
  if (soil.includes('roca') || soil.includes('piedra') || soil.includes('grava')) {
    tags.push('rocosa')
  }

  // Name-based inference
  const name = beach.name.toLowerCase()
  if (name.includes('cala')) tags.push('calas')

  return tags
}

async function inferTagsWithOllama(beach, existingTags) {
  const remainingTags = VALID_TAGS.filter(t => !existingTags.includes(t))

  const prompt = `Analiza esta playa y selecciona los tags más apropiados.

Playa: ${beach.name}
Descripción: ${beach.description}
Acceso: ${beach.access}
Orientación: ${beach.orientation}
Servicios: ${beach.services?.join(', ') || 'ninguno'}
Longitud: ${beach.length ? beach.length + 'm' : 'desconocida'}

Tags ya asignados: ${existingTags.join(', ') || 'ninguno'}

Tags disponibles para elegir: ${remainingTags.join(', ')}

Reglas:
- "familiar": playa con servicios, fácil acceso, aguas tranquilas
- "salvaje": naturaleza virgen, sin urbanizar
- "aislada": difícil acceso, poca gente
- "urbana": dentro de núcleo urbano
- "snorkel/buceo": aguas claras, fondos interesantes
- "deportes-nauticos": zona de fondeo, actividades náuticas
- "acantilados": rodeada de acantilados
- "puesta-sol": orientación oeste/suroeste
- "fotogenica": paisaje espectacular

Responde SOLO con un array JSON de 1-3 tags adicionales más relevantes. Ejemplo: ["salvaje", "fotogenica"]
Si ninguno aplica, responde: []`

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.3, num_predict: 50 }
      })
    })

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`)

    const data = await response.json()
    const text = data.response.trim()

    // Extract JSON array from response
    const match = text.match(/\[.*?\]/s)
    if (match) {
      const parsed = JSON.parse(match[0])
      return parsed.filter(t => remainingTags.includes(t))
    }
    return []
  } catch (error) {
    console.error(`  Error: ${error.message}`)
    return []
  }
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf8'))

  const toProcess = beaches.filter(b => !b.tags)
  console.log(`Processing ${toProcess.length} beaches...\n`)

  let processed = 0

  for (const beach of beaches) {
    if (beach.tags) continue

    const autoTags = getAutomaticTags(beach)
    process.stdout.write(`[${++processed}/${toProcess.length}] ${beach.name}... `)

    const ollamaTags = await inferTagsWithOllama(beach, autoTags)
    beach.tags = [...new Set([...autoTags, ...ollamaTags])].slice(0, 5)

    console.log(beach.tags.join(', '))

    if (processed % 20 === 0) {
      writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
      console.log('  [Saved progress]\n')
    }

    await new Promise(r => setTimeout(r, 300))
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`\nDone! Generated tags for ${processed} beaches`)
}

main().catch(console.error)
