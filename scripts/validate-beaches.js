import { readFileSync } from 'node:fs'

const beaches = JSON.parse(readFileSync('./data/beaches.json', 'utf-8'))
const municipalities = JSON.parse(readFileSync('./data/municipalities.json', 'utf-8'))
const seas = JSON.parse(readFileSync('./data/seas.json', 'utf-8'))

const errors = []
const warnings = []

const allCodes = new Set(beaches.map((b) => b.code))

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
