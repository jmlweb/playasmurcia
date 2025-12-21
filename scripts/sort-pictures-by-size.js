import { readFileSync, writeFileSync, statSync } from 'fs'
import { join } from 'path'

const BEACHES_PATH = './data/beaches.json'
const PICTURES_DIR = './public/pictures'

function getFileSize(filename) {
  try {
    const stats = statSync(join(PICTURES_DIR, filename))
    return stats.size
  } catch {
    return 0
  }
}

function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  let sortedCount = 0
  let reorderedCount = 0

  beaches.forEach(beach => {
    if (beach.pictures && beach.pictures.length > 1) {
      const original = [...beach.pictures]
      beach.pictures.sort((a, b) => getFileSize(b) - getFileSize(a))
      sortedCount++

      if (JSON.stringify(original) !== JSON.stringify(beach.pictures)) {
        reorderedCount++
      }
    }
  })

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`Processed ${sortedCount} beaches with multiple pictures`)
  console.log(`Reordered ${reorderedCount} beaches`)
}

main()
