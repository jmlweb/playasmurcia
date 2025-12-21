/**
 * Script to generate beach descriptions using Ollama (gemma3:4b)
 * Run: node scripts/generate-descriptions.js
 */

const fs = require('fs')
const path = require('path')

const BEACHES_PATH = path.join(__dirname, '../data/beaches.json')
const MUNICIPALITIES_PATH = path.join(__dirname, '../data/municipalities.json')
const SEAS = ['Mar Mediterráneo', 'Mar Menor']
const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'gemma3:4b'

async function generateDescription(beach, municipalityName) {
  const seaName = SEAS[beach.sea] || 'Mar Mediterráneo'

  const prompt = `Genera una descripción turística breve (2-3 frases, máximo 150 palabras) en español para la playa "${beach.name}" ubicada en ${municipalityName}, Región de Murcia, España.

Datos disponibles:
- Tipo de arena: ${beach.soilType || 'No especificado'}
- Mar: ${seaName}
- Bandera azul: ${beach.blueFlag ? 'Sí' : 'No'}
- Nudista: ${beach.nudist ? 'Sí' : 'No'}
- Accesible: ${beach.accessible ? 'Sí' : 'No'}
- Paseo marítimo: ${beach.promenade ? 'Sí' : 'No'}
- Zona de fondeo: ${beach.anchorageZone ? 'Sí' : 'No'}

Responde SOLO con la descripción, sin introducción ni explicaciones adicionales.`

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 200
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()
    return data.response.trim()
  } catch (error) {
    console.error(`Error generating description for ${beach.name}:`, error.message)
    return null
  }
}

async function main() {
  const beaches = JSON.parse(fs.readFileSync(BEACHES_PATH, 'utf8'))
  const municipalities = JSON.parse(fs.readFileSync(MUNICIPALITIES_PATH, 'utf8'))

  const beachesWithoutDescription = beaches.filter(b => !b.description)
  console.log(`Found ${beachesWithoutDescription.length} beaches without description`)

  let processed = 0
  let errors = 0

  for (const beach of beaches) {
    if (beach.description) {
      continue
    }

    const municipality = municipalities[beach.municipality]
    const municipalityName = municipality?.name || 'Región de Murcia'

    console.log(`[${processed + 1}/${beachesWithoutDescription.length}] Generating: ${beach.name}...`)

    const description = await generateDescription(beach, municipalityName)

    if (description) {
      beach.description = description
      processed++

      // Save progress every 10 beaches
      if (processed % 10 === 0) {
        fs.writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
        console.log(`  -> Saved progress (${processed} beaches)`)
      }
    } else {
      errors++
    }

    // Small delay to not overwhelm Ollama
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Final save
  fs.writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`\nDone! Generated ${processed} descriptions, ${errors} errors`)
}

main().catch(console.error)
