import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { imageSize } from 'image-size'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const BEACHES_PATH = join(ROOT, 'data', 'beaches.json')
const PUBLIC_PICTURES = join(ROOT, 'public', 'pictures')

type JsonBeach = {
  code: string
  name: string
  pictures?: string[]
  [key: string]: unknown
}

function shortSideOf(filename: string): number {
  const filePath = join(PUBLIC_PICTURES, filename)
  if (!existsSync(filePath)) return 0
  try {
    const buf = readFileSync(filePath)
    const dim = imageSize(buf)
    if (!dim.width || !dim.height) return 0
    return Math.min(dim.width, dim.height)
  } catch {
    return 0
  }
}

function main(): void {
  const dryRun = process.argv.includes('--dry-run')
  const raw = readFileSync(BEACHES_PATH, 'utf-8')
  const beaches = JSON.parse(raw) as JsonBeach[]

  let reordered = 0

  for (const beach of beaches) {
    const pics = beach.pictures
    if (!pics || pics.length < 2) continue

    const withRes = pics.map((p) => ({ file: p, shortSide: shortSideOf(p) }))
    withRes.sort((a, b) => b.shortSide - a.shortSide)

    const sorted = withRes.map((w) => w.file)
    const changed = sorted.some((f, i) => f !== pics[i])
    if (!changed) continue

    reordered++
    if (!dryRun) {
      beach.pictures = sorted
    }
    console.log(
      `${beach.name}: ${withRes.map((w) => `${w.file} (${w.shortSide}px)`).join(', ')}`,
    )
  }

  console.log(`\nReordered: ${reordered} / ${beaches.length} beaches`)

  if (dryRun) {
    console.log('Dry run: not writing beaches.json')
    return
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2) + '\n', 'utf-8')
  console.log(`Updated ${BEACHES_PATH}`)
}

main()
