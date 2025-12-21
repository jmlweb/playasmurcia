# Step 06: Validate Beaches Data

## Objective

Create a validation script that checks `data/beaches.json` against all rules defined in `data/CLAUDE.md`.

## Implementation

Create `scripts/validate-beaches.js`:

```javascript
const beaches = require('../data/beaches.json')
const municipalities = require('../data/municipalities.json')
const seas = require('../data/seas.json')

const errors = []
const warnings = []

const allCodes = new Set(beaches.map(b => b.code))

const requiredFields = [
  'code', 'name', 'municipality', 'sea', 'coordinates',
  'soilType', 'blueFlag', 'nudist', 'accessible', 'promenade',
  'anchorageZone', 'description', 'access', 'nearby'
]

beaches.forEach((beach, index) => {
  const prefix = `Beach ${beach.code || index}`

  // Required fields
  requiredFields.forEach(field => {
    if (beach[field] === undefined || beach[field] === null || beach[field] === '') {
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
    beach.nearby.forEach(code => {
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
  if (beach.phone && !beach.phone.match(/^[\d\s\/]+$/)) {
    warnings.push(`${prefix}: phone format may be invalid '${beach.phone}'`)
  }

  // Code uniqueness (checked via Set)
  // aemetId format
  if (beach.aemetId && !beach.aemetId.match(/^30\d{5}$/)) {
    errors.push(`${prefix}: aemetId should be 7 digits starting with 30`)
  }
})

// Check for duplicate codes
const codeCounts = {}
beaches.forEach(b => {
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
  errors.forEach(e => console.log(`  ✗ ${e}`))
}

if (warnings.length) {
  console.log(`\n--- Warnings ---`)
  warnings.forEach(w => console.log(`  ⚠ ${w}`))
}

process.exit(errors.length > 0 ? 1 : 0)
```

## Usage

```bash
node scripts/validate-beaches.js
```

## Validation Checks

| Category | Check |
|----------|-------|
| Required fields | All 14 required fields present |
| Coordinates | Latitude [37.37, 37.9], Longitude [-1.7, -0.6] |
| References | municipality/sea indices valid |
| Nearby | All codes exist, not empty |
| URLs | Valid http/https format |
| Phone | Spanish format |
| aemetId | 7 digits starting with 30 |
| Uniqueness | No duplicate codes |

## Exit Codes

- `0`: All validations passed
- `1`: One or more errors found

## Validation Checklist

- [ ] Script created at `scripts/validate-beaches.js`
- [ ] Script runs without syntax errors
- [ ] All current data passes validation (after fixing known issues)

## Source

Derived from validation rules in `data/CLAUDE.md`.
