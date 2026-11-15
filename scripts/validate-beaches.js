import { readFileSync } from 'node:fs'

const beaches = JSON.parse(readFileSync('./data/beaches.json', 'utf-8'))
const municipalities = JSON.parse(
  readFileSync('./data/municipalities.json', 'utf-8'),
)
const seas = JSON.parse(readFileSync('./data/seas.json', 'utf-8'))
const zoneCuration = JSON.parse(readFileSync('./data/zones.json', 'utf-8'))
const zonesById = new Map(zoneCuration.zones.map((zone) => [zone.id, zone]))
const beachDimensions = JSON.parse(
  readFileSync('./data/beach-dimensions.json', 'utf-8'),
).values

const tags = JSON.parse(readFileSync('./data/tags.json', 'utf-8'))
const familiarTagIndex = tags.findIndex((tag) => tag.id === 'familiar')
const sunsetTagIndex = tags.findIndex((tag) => tag.id === 'puesta-sol')
const MAR_MENOR_SEA = seas.findIndex((sea) => sea.name === 'Mar Menor')

// Mirrors facesSummerSunset in src/lib/sun-times.ts (plain Node here)
const SUMMER_SUNSET_AZIMUTH = 295
const SUNSET_VIEW_HALF_WIDTH = 65
const facesSummerSunset = (shoreBearing) =>
  Math.abs(((shoreBearing - SUMMER_SUNSET_AZIMUTH + 540) % 360) - 180) <=
  SUNSET_VIEW_HALF_WIDTH

// Mirrors getDisplayLength in src/lib/beach-dimensions.ts: ITREM when published, else OSM
const getDisplayLength = (beach) =>
  beachDimensions[beach.code]?.officialLength ?? beach.length

// "173 metros", "1.200 metros", "1,5 kilómetros"; road markers ("kilómetro 8,5") put the unit first
const LENGTH_FIGURE =
  /(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*(metros|kilómetros|km)\b/gi
const isKilometres = (unit) => /^k/i.test(unit)
const toMetres = (number, unit) => {
  const value = Number(number.replaceAll('.', '').replace(',', '.'))
  return isKilometres(unit) ? Math.round(value * 1000) : value
}
// Mirrors formatBeachLength in src/lib/beach-facts.ts: from 1 km on, the page rounds to 0.1 km
const matchesDisplayLength = (metres, unit, displayLength) =>
  isKilometres(unit)
    ? Math.round(metres / 100) === Math.round(displayLength / 100)
    : metres === displayLength
// Figures far from the OSM length are distances ("a unos 4 kilómetros", "700 metros a pie")
const OSM_LENGTH_TOLERANCE = 0.15
const isNearOsmLength = (metres, osmLength) =>
  Math.abs(metres - osmLength) <= osmLength * OSM_LENGTH_TOLERANCE

const errors = []
const warnings = []

const allCodes = new Set(beaches.map((b) => b.code))

// Each INE code belongs to one municipality; a repeat means a place was added as one (e.g. La Manga)
const seenIneCodes = new Map()
municipalities.forEach((municipality) => {
  const previous = seenIneCodes.get(municipality.id)
  if (previous) {
    errors.push(
      `Municipality '${municipality.name}': INE code ${municipality.id} already used by '${previous}'`,
    )
  }
  seenIneCodes.set(municipality.id, municipality.name)
})

const requiredFields = [
  'code',
  'name',
  'municipality',
  'sea',
  'coordinates',
  'soilType',
  'nudist',
  'promenade',
  'anchorageZone',
  'description',
  'access',
  'nearby',
]

beaches.forEach((beach, index) => {
  const prefix = `Beach ${beach.code || index}`

  // Required fields
  requiredFields.forEach((field) => {
    if (
      beach[field] === undefined ||
      beach[field] === null ||
      beach[field] === ''
    ) {
      errors.push(`${prefix}: missing required field '${field}'`)
    }
  })

  // Coordinates validation (updated bounds)
  const [lat, lon] = beach.coordinates || []
  if (lat < 37.37 || lat > 37.9) {
    errors.push(`${prefix}: latitude ${lat} out of bounds [37.37, 37.9]`)
  }
  if (lon < -1.7 || lon > -0.6) {
    errors.push(`${prefix}: longitude ${lon} out of bounds [-1.7, -0.6]`)
  }

  // Reference validation
  if (beach.municipality < 0 || beach.municipality >= municipalities.length) {
    errors.push(`${prefix}: invalid municipality index ${beach.municipality}`)
  }
  if (beach.sea < 0 || beach.sea >= seas.length) {
    errors.push(`${prefix}: invalid sea index ${beach.sea}`)
  }

  // Nearby validation
  if (beach.nearby) {
    beach.nearby.forEach((code) => {
      if (!allCodes.has(code)) {
        errors.push(`${prefix}: nearby contains invalid code '${code}'`)
      }
    })
    if (beach.nearby.length === 0) {
      warnings.push(`${prefix}: nearby array is empty`)
    }
  }

  // Markdown fields: an odd number of ** would render a literal marker, and the
  // renderer drops links that are not http(s)
  for (const field of ['description', 'access']) {
    const text = beach[field]
    if (typeof text !== 'string') continue
    const markers = text.match(/\*\*/g) ?? []
    if (markers.length % 2 !== 0) {
      errors.push(`${prefix}: ${field} has an unpaired '**' marker`)
    }
    for (const [, href] of text.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
      if (!/^https:\/\//.test(href)) {
        errors.push(`${prefix}: ${field} link must use https: ${href}`)
      }
    }
    // Only "- " bullets are supported; "* " bullets and headings show literally
    if (/^\s*(\*\s|#)/m.test(text)) {
      errors.push(`${prefix}: ${field} uses unsupported markdown ('* ' or '#')`)
    }
  }

  // The page shows the display length beside the description; prose must not contradict it
  const displayLength = getDisplayLength(beach)
  if (
    typeof beach.length === 'number' &&
    typeof beach.description === 'string'
  ) {
    for (const [figure, number, unit] of beach.description.matchAll(
      LENGTH_FIGURE,
    )) {
      const metres = toMetres(number, unit)
      if (
        !matchesDisplayLength(metres, unit, displayLength) &&
        isNearOsmLength(metres, beach.length)
      ) {
        errors.push(
          `${prefix}: description states '${figure}' but the page shows ${displayLength} m`,
        )
      }
    }
  }

  // childSafe false vetoes every family promise (see docs/business-rules.md)
  if (beach.childSafe === false) {
    if (beach.tags?.includes(familiarTagIndex)) {
      errors.push(`${prefix}: tag 'familiar' contradicts childSafe false`)
    }
    if (/familia/i.test(beach.metaDescription ?? '')) {
      errors.push(
        `${prefix}: metaDescription promises families but childSafe is false`,
      )
    }
  }

  // puesta-sol is derived from shoreBearing (scripts/derive-sunset-tag.ts)
  if (typeof beach.shoreBearing === 'number') {
    const hasSunset = beach.tags?.includes(sunsetTagIndex) ?? false
    if (hasSunset !== facesSummerSunset(beach.shoreBearing)) {
      errors.push(
        `${prefix}: tag 'puesta-sol' does not match shoreBearing ${beach.shoreBearing}; run pnpm tsx scripts/derive-sunset-tag.ts`,
      )
    }
    // The OSM derivation picks the Mediterranean coastline on the narrow La Manga strip
    if (
      beach.sea === MAR_MENOR_SEA &&
      beach.zone === 'la-manga' &&
      beach.shoreBearing < 180
    ) {
      errors.push(
        `${prefix}: Mar Menor beach on La Manga faces ${beach.shoreBearing}° (the Mediterranean side); set shoreBearing to the lagoon side`,
      )
    }
  }

  // URL validation
  if (beach.realUrl && !beach.realUrl.match(/^https?:\/\//)) {
    errors.push(`${prefix}: invalid URL format '${beach.realUrl}'`)
  }

  // Phone format (Spanish)
  if (beach.phone && !beach.phone.match(/^[\d\s/]+$/)) {
    warnings.push(`${prefix}: phone format may be invalid '${beach.phone}'`)
  }

  // aemetId format
  if (beach.aemetId && !beach.aemetId.match(/^30\d{5}$/)) {
    errors.push(`${prefix}: aemetId should be 7 digits starting with 30`)
  }

  // Degrees the beach faces seaward; drives the resguardada/expuesta label
  if (
    !Number.isInteger(beach.shoreBearing) ||
    beach.shoreBearing < 0 ||
    beach.shoreBearing > 359
  ) {
    errors.push(`${prefix}: shoreBearing must be an integer in [0, 359]`)
  }

  // Official EU class only, always with the sampling point it comes from
  const source = beach.waterQualitySource
  if (
    beach.waterQuality !== undefined &&
    !['excellent', 'good', 'sufficient', 'poor'].includes(beach.waterQuality)
  ) {
    errors.push(`${prefix}: invalid waterQuality '${beach.waterQuality}'`)
  }
  if ((beach.waterQuality === undefined) !== (source === undefined)) {
    errors.push(
      `${prefix}: waterQuality and waterQualitySource must be set together`,
    )
  }
  if (
    source !== undefined &&
    (!Number.isInteger(source.season) ||
      !/^ES620/.test(source.samplingPointId ?? '') ||
      typeof source.samplingPointName !== 'string' ||
      !Number.isInteger(source.distanceMeters) ||
      source.distanceMeters > 500 ||
      (source.profileUrl !== undefined &&
        !/^https:\/\//.test(source.profileUrl)))
  ) {
    errors.push(`${prefix}: invalid waterQualitySource`)
  }

  if (
    beach.pictureQualityScore !== undefined &&
    ![0, 1, 2, 3].includes(beach.pictureQualityScore)
  ) {
    errors.push(
      `${prefix}: pictureQualityScore must be 0, 1, 2, or 3 if present`,
    )
  }

  // Every beach needs a zone or a reviewed reason in data/zones.json for having none
  const isUnresolved = beach.code in zoneCuration.unresolved
  if (beach.zone === undefined) {
    if (!isUnresolved) {
      errors.push(`${prefix}: missing zone and not listed as unresolved`)
    }
  } else if (isUnresolved) {
    errors.push(
      `${prefix}: has zone '${beach.zone}' but is listed as unresolved`,
    )
  } else if (!zonesById.has(beach.zone)) {
    errors.push(`${prefix}: unknown zone '${beach.zone}'`)
  } else if (
    !zonesById.get(beach.zone).municipalities.includes(beach.municipality)
  ) {
    errors.push(
      `${prefix}: zone '${beach.zone}' is not in municipality ${beach.municipality}`,
    )
  }
})

// Check for duplicate codes
const codeCounts = {}
beaches.forEach((b) => {
  codeCounts[b.code] = (codeCounts[b.code] || 0) + 1
})
Object.entries(codeCounts).forEach(([code, count]) => {
  if (count > 1) errors.push(`Duplicate code: '${code}' appears ${count} times`)
})

// Output results
console.log(`\n=== Validation Results ===\n`)
console.log(`Total beaches: ${beaches.length}`)
console.log(`Errors: ${errors.length}`)
console.log(`Warnings: ${warnings.length}`)

if (errors.length) {
  console.log(`\n--- Errors ---`)
  errors.forEach((e) => console.log(`  ✗ ${e}`))
}

if (warnings.length) {
  console.log(`\n--- Warnings ---`)
  warnings.forEach((w) => console.log(`  ⚠ ${w}`))
}

process.exit(errors.length > 0 ? 1 : 0)
