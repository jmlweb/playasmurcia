/**
 * Script to add AEMET beach codes for weather prediction integration
 * Run: node scripts/add-aemet-ids.js
 *
 * AEMET codes source: https://www.aemet.es/documentos/es/eltiempo/prediccion/playas/Playas_codigos.csv
 * API endpoint: GET /api/prediccion/especifica/playa/{playa}
 */

const fs = require('fs')
const path = require('path')

const BEACHES_PATH = path.join(__dirname, '../data/beaches.json')

// AEMET beach codes for Murcia region (Province 30)
// Format: { name_lowercase: { aemetId, aemetName, municipality } }
const AEMET_BEACHES = {
  'la carolina': { aemetId: '3000301', municipality: 'Águilas' },
  'la colonia': { aemetId: '3000312', municipality: 'Águilas' },
  'poniente': { aemetId: '3000313', municipality: 'Águilas' },
  'levante': { aemetId: '3000314', municipality: 'Águilas' },
  'las delicias': { aemetId: '3000315', municipality: 'Águilas' },
  'calabardina': { aemetId: '3000327', municipality: 'Águilas' },
  'la azoria': { aemetId: '3001610', municipality: 'Cartagena' },
  'la azoría': { aemetId: '3001610', municipality: 'Cartagena' },
  'el portus': { aemetId: '3001619', municipality: 'Cartagena' },
  'el portús': { aemetId: '3001619', municipality: 'Cartagena' },
  'cala cortina': { aemetId: '3001624', municipality: 'Cartagena' },
  'de calblanque': { aemetId: '3001634', municipality: 'Cartagena' },
  'calblanque': { aemetId: '3001634', municipality: 'Cartagena' },
  'las amoladeras': { aemetId: '3001653', municipality: 'Cartagena' },
  'barco perdido': { aemetId: '3001655', municipality: 'Cartagena' },
  'galía': { aemetId: '3001655', municipality: 'Cartagena' },
  'los urrutias': { aemetId: '3001676', municipality: 'Cartagena' },
  'puntas de calnegre': { aemetId: '3002414', municipality: 'Lorca' },
  'calnegre': { aemetId: '3002414', municipality: 'Lorca' },
  'bolnuevo': { aemetId: '3002618', municipality: 'Mazarrón' },
  'la reya': { aemetId: '3002623', municipality: 'Mazarrón' },
  'la isla': { aemetId: '3002626', municipality: 'Mazarrón' },
  'el alamillo': { aemetId: '3002630', municipality: 'Mazarrón' },
  'del mojon': { aemetId: '3002633', municipality: 'Mazarrón' },
  'del mojón': { aemetId: '3002633', municipality: 'Mazarrón' },
  'de colon': { aemetId: '3003503', municipality: 'San Javier' },
  'de colón': { aemetId: '3003503', municipality: 'San Javier' },
  'mistral': { aemetId: '3003509', municipality: 'San Javier' },
  'el arenal': { aemetId: '3003526', municipality: 'San Javier' },
  'banco del tabal': { aemetId: '3003531', municipality: 'San Javier' },
  'villananitos': { aemetId: '3003602', municipality: 'San Pedro del Pinatar' },
  'la torre derribada': { aemetId: '3003605', municipality: 'San Pedro del Pinatar' },
  'las salinas': { aemetId: '3003606', municipality: 'San Pedro del Pinatar' },
  'del lastre': { aemetId: '3004102', municipality: 'La Unión' },
  'punta calera': { aemetId: '3090202', municipality: 'Los Alcázares' },
  'el espejo': { aemetId: '3090205', municipality: 'Los Alcázares' },
  'manzanares': { aemetId: '3090206', municipality: 'Los Alcázares' }
}

function normalizeBeachName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents for comparison
    .replace(/^(playa\s+|cala\s+)/i, '')
    .trim()
}

function findAemetMatch(beachName) {
  const normalized = normalizeBeachName(beachName)

  // Direct match
  if (AEMET_BEACHES[normalized]) {
    return AEMET_BEACHES[normalized]
  }

  // Try with accents preserved
  const lowerName = beachName.toLowerCase()
  if (AEMET_BEACHES[lowerName]) {
    return AEMET_BEACHES[lowerName]
  }

  // Partial match
  for (const [key, value] of Object.entries(AEMET_BEACHES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value
    }
  }

  return null
}

function main() {
  const beaches = JSON.parse(fs.readFileSync(BEACHES_PATH, 'utf8'))

  let matched = 0
  let unmatched = 0

  for (const beach of beaches) {
    const match = findAemetMatch(beach.name)

    if (match) {
      beach.aemetId = match.aemetId
      matched++
      console.log(`✓ ${beach.name} -> ${match.aemetId}`)
    } else {
      unmatched++
    }
  }

  fs.writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  console.log(`\nResults:`)
  console.log(`  Matched: ${matched}`)
  console.log(`  Unmatched: ${unmatched}`)
  console.log(`\nAEMET only provides predictions for ${Object.keys(AEMET_BEACHES).length / 2} beaches in Murcia`)
}

main()
