import { readFileSync } from 'node:fs'

const beaches = JSON.parse(readFileSync('./data/beaches.json', 'utf-8'))
const municipalities = JSON.parse(
  readFileSync('./data/municipalities.json', 'utf-8'),
)
const seas = JSON.parse(readFileSync('./data/seas.json', 'utf-8'))

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
