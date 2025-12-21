# Step 09: Add Lifeguard Info

## Objective

Add `lifeguard` boolean field indicating beaches with lifeguard service during summer.

## Data Source

**112 Murcia / COPLA system**: https://www.112rmurcia.es/copla/copla.xml

This XML feed provides real-time beach status including lifeguard presence. We can extract which beaches have lifeguard service (even if only during summer).

## Implementation

### Script: `scripts/add-lifeguard-info.js`

```javascript
import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const COPLA_URL = 'https://www.112rmurcia.es/copla/copla.xml'

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  // Fetch COPLA data
  const response = await fetch(COPLA_URL)
  const xml = await response.text()

  // Parse XML to extract beaches with lifeguard service
  // Match beach names to our database
  const beachesWithLifeguard = parseCoplaXml(xml)

  let updated = 0
  beaches.forEach(beach => {
    // Try to match by name (fuzzy matching may be needed)
    const hasLifeguard = beachesWithLifeguard.some(
      name => normalizeName(beach.name).includes(normalizeName(name))
    )
    beach.lifeguard = hasLifeguard
    if (hasLifeguard) updated++
  })

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`Beaches with lifeguard: ${updated}/${beaches.length}`)
}

function normalizeName(name) {
  return name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

function parseCoplaXml(xml) {
  // Extract beach names that have socorrista=Sí
  const matches = xml.match(/<nombre>([^<]+)<\/nombre>/g) || []
  return matches.map(m => m.replace(/<\/?nombre>/g, ''))
}

main().catch(console.error)
```

## Notes

- COPLA only available during summer (June-September)
- If accessed outside summer, use cached/historical data
- Some beaches may have lifeguard only on weekends

## Alternative: Manual Research

If COPLA is unavailable, research official municipal sources for beaches with lifeguard service.

## Validation

- [ ] Script runs without errors
- [ ] Major beaches (Bolnuevo, La Manga, etc.) have `lifeguard: true`
- [ ] Remote calas have `lifeguard: false`
