import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'

function nameToHashtag(name) {
  return '#' + name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
    .replace(/[^a-zA-Z0-9]/g, '')
}

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  let count = 0

  for (const beach of beaches) {
    if (beach.instagramHashtag !== undefined) continue

    beach.instagramHashtag = nameToHashtag(beach.name)
    count++
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`Done! Added instagramHashtag to ${count} beaches`)
}

main()
