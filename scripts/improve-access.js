/**
 * Script to analyze and improve access information using Ollama
 * Extracts structured data from the existing 'access' text field
 * Run: node scripts/improve-access.js
 */

const fs = require('fs')
const path = require('path')

const BEACHES_PATH = path.join(__dirname, '../data/beaches.json')
const OLLAMA_URL = 'http://localhost:11434/api/generate'
const MODEL = 'gemma3:4b'

async function extractAccessInfo(beach) {
  if (!beach.access) return null

  const prompt = `Analiza el siguiente texto de acceso a una playa y extrae información estructurada en formato JSON.

Texto: "${beach.access}"

Responde SOLO con un objeto JSON válido (sin markdown, sin explicaciones) con estos campos:
{
  "hasParking": boolean,
  "hasBusAccess": boolean,
  "hasBoatAccess": boolean,
  "walkingRequired": boolean,
  "roadType": "asphalt" | "dirt" | "path" | "unknown",
  "difficultyLevel": "easy" | "moderate" | "difficult"
}

Si no puedes determinar un valor, usa null.`

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.1, num_predict: 150 }
      })
    })

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`)

    const data = await response.json()
    const text = data.response.trim()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return null
  } catch (error) {
    console.error(`Error processing ${beach.name}:`, error.message)
    return null
  }
}

async function main() {
  const beaches = JSON.parse(fs.readFileSync(BEACHES_PATH, 'utf8'))

  const beachesWithAccess = beaches.filter(b => b.access && !b.accessInfo)
  console.log(`Processing ${beachesWithAccess.length} beaches with access text...`)

  let processed = 0

  for (const beach of beaches) {
    if (!beach.access || beach.accessInfo) continue

    console.log(`[${processed + 1}/${beachesWithAccess.length}] ${beach.name}...`)

    const accessInfo = await extractAccessInfo(beach)
    if (accessInfo) {
      beach.accessInfo = accessInfo
      processed++

      if (processed % 10 === 0) {
        fs.writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
        console.log(`  -> Saved progress`)
      }
    }

    await new Promise(resolve => setTimeout(resolve, 300))
  }

  fs.writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`\nProcessed ${processed} beaches`)
}

main().catch(console.error)
