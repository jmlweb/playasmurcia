import { readFileSync, writeFileSync } from 'node:fs'

const BEACHES_PATH = './data/beaches.json'

// Tag indices (from tags.json)
const TAG_CALAS = 1
const TAG_URBANA = 4
const TAG_PASEO_MARITIMO = 5
const TAG_ACCESIBLE = 6
const TAG_SALVAJE = 9
const TAG_AISLADA = 10
const TAG_NUDISTA = 13

// Municipality indices (from municipalities.json)
const MUNICIPALITY_LA_MANGA = 5
const MUNICIPALITY_LOS_ALCAZARES = 6
const MUNICIPALITY_SAN_PEDRO = 7

// High occupancy indicators
const HIGH_OCCUPANCY_TAGS = [TAG_URBANA, TAG_PASEO_MARITIMO, TAG_ACCESIBLE]
const HIGH_OCCUPANCY_MUNICIPALITIES = [
  MUNICIPALITY_LA_MANGA,
  MUNICIPALITY_LOS_ALCAZARES,
  MUNICIPALITY_SAN_PEDRO
]

// Low occupancy indicators
const LOW_OCCUPANCY_TAGS = [TAG_SALVAJE, TAG_AISLADA, TAG_NUDISTA]

function inferOccupancyLevel(beach) {
  const tags = beach.tags || []
  const hasHighTag = tags.some(tag => HIGH_OCCUPANCY_TAGS.includes(tag))
  const hasLowTag = tags.some(tag => LOW_OCCUPANCY_TAGS.includes(tag))
  const isCala = tags.includes(TAG_CALAS)
  const isHighOccupancyMunicipality = HIGH_OCCUPANCY_MUNICIPALITIES.includes(beach.municipality)
  const hasPromenade = beach.promenade === true
  const hasLifeguard = beach.lifeguard === true
  const hasManyCertifications = (beach.certifications || []).length >= 2
  const hasManyServices = (beach.services || []).length >= 4

  // High occupancy: urban beaches, promenade, La Manga, accessible beaches
  if (hasHighTag || isHighOccupancyMunicipality || hasPromenade || hasManyCertifications) {
    return 'high'
  }

  // Low occupancy: remote calas, wild beaches, isolated, nudist
  if (hasLowTag || (isCala && !hasLifeguard && !hasManyServices)) {
    return 'low'
  }

  // Medium: everything else
  return 'medium'
}

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  const counts = { low: 0, medium: 0, high: 0 }

  beaches.forEach(beach => {
    beach.occupancyLevel = inferOccupancyLevel(beach)
    counts[beach.occupancyLevel]++
  })

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))

  console.log(`Updated ${beaches.length} beaches with occupancy levels\n`)
  console.log('Distribution:')
  console.log(`  low:    ${counts.low} (${((counts.low / beaches.length) * 100).toFixed(1)}%)`)
  console.log(`  medium: ${counts.medium} (${((counts.medium / beaches.length) * 100).toFixed(1)}%)`)
  console.log(`  high:   ${counts.high} (${((counts.high / beaches.length) * 100).toFixed(1)}%)`)

  console.log('\n--- High occupancy beaches ---')
  beaches.filter(b => b.occupancyLevel === 'high')
    .slice(0, 15)
    .forEach(b => console.log(`  - ${b.name}`))
  if (counts.high > 15) console.log(`  ... and ${counts.high - 15} more`)

  console.log('\n--- Low occupancy beaches ---')
  beaches.filter(b => b.occupancyLevel === 'low')
    .slice(0, 15)
    .forEach(b => console.log(`  - ${b.name}`))
  if (counts.low > 15) console.log(`  ... and ${counts.low - 15} more`)
}

main()
