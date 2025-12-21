import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const SAVE_INTERVAL = 10

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

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`)
  }

  const data = await response.json()
  return data.response.trim()
}

function buildPrompt(beach) {
  return `Analiza estos dos campos de la playa "${beach.name}" y sepáralos correctamente.

ACCESS ACTUAL:
"${beach.access || ''}"

DESCRIPTION ACTUAL:
"${beach.description || ''}"

REGLAS ESTRICTAS:

1. ACCESS debe contener SOLO información práctica de acceso:
   - Ubicación y cómo llegar (carreteras, salidas, direcciones)
   - Parking (disponibilidad, plazas, distancia)
   - Transporte público (líneas de bus si las hay)
   - Dificultad de acceso (fácil, moderado, difícil)
   - Tipo de camino (asfalto, tierra, sendero)
   - NO incluir adjetivos promocionales (pintoresco, hermoso, natural, idílico, etc.)

2. DESCRIPTION debe contener:
   - Descripción turística y promocional
   - Cualquier contenido "bonito" extraído de access (paisaje, ambiente, experiencia)
   - Características de la playa (arena, agua, entorno)
   - Mantener el contenido original de description
   - Integrar naturalmente el contenido promocional movido desde access

3. IMPORTANTE:
   - No perder información entre los dos campos
   - No inventar datos nuevos
   - Mantener el idioma español
   - Responder SOLO con el JSON, sin explicaciones

Responde EXACTAMENTE en este formato JSON (sin markdown, sin \`\`\`):
{"access": "texto de access", "description": "texto de description"}`
}

function parseResponse(response) {
  // Clean up the response - remove markdown code blocks if present
  let cleaned = response
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // Try to find JSON object in the response
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON object found in response')
  }

  const parsed = JSON.parse(jsonMatch[0])

  if (!parsed.access || !parsed.description) {
    throw new Error('Missing access or description in response')
  }

  return parsed
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  // Process all beaches that have both access and description
  const toProcess = beaches.filter(
    (beach) => beach.access && beach.description
  )

  console.log(`Playas a procesar: ${toProcess.length}`)
  console.log('')

  let processed = 0
  let errors = 0
  let skipped = 0

  for (const beach of toProcess) {
    try {
      const prompt = buildPrompt(beach)
      const response = await callOllama(prompt)
      const result = parseResponse(response)

      // Update in original array
      const index = beaches.findIndex((b) => b.code === beach.code)

      // Only update if there's actual change
      if (
        result.access !== beach.access ||
        result.description !== beach.description
      ) {
        beaches[index].access = result.access
        beaches[index].description = result.description
        console.log(`[OK] ${beach.name}`)
        processed++
      } else {
        console.log(`[SKIP] ${beach.name} (sin cambios)`)
        skipped++
      }

      // Save progress periodically
      if ((processed + skipped) % SAVE_INTERVAL === 0) {
        writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
        console.log(`  Guardado progreso: ${processed + skipped}/${toProcess.length}`)
      }
    } catch (error) {
      console.error(`[ERROR] ${beach.name}: ${error.message}`)
      errors++
    }
  }

  // Final save
  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  console.log('')
  console.log('=== Completado ===')
  console.log(`Modificadas: ${processed}`)
  console.log(`Sin cambios: ${skipped}`)
  console.log(`Errores: ${errors}`)
}

main().catch(console.error)
