import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'

function calculateOrientation(lat, lng, sea) {
  // Mar Menor (enclosed lagoon) - orientation depends on position
  if (sea === 1) {
    // La Manga (east side of Mar Menor) faces west
    if (lng > -0.75) return 'west'
    // West coast of Mar Menor faces east
    return 'east'
  }

  // Mediterranean coast - simplified model
  // Most Murcia Mediterranean beaches face east/southeast
  if (lat > 37.65) return 'southeast' // Northern coast (Cartagena area)
  if (lat > 37.55) return 'east'      // Central (Mazarron)
  return 'southeast'                   // Southern (Aguilas)
}

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))

  let added = 0
  for (const beach of beaches) {
    if (beach.orientation !== undefined) continue

    const [lat, lng] = beach.coordinates
    beach.orientation = calculateOrientation(lat, lng, beach.sea)
    added++
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`Done! Added orientation to ${added} beaches`)
}

main()
