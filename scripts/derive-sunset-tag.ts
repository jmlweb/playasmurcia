/**
 * Sets the `puesta-sol` tag in data/beaches.json from `shoreBearing`: a beach
 * gets it when the summer sun sets within SUNSET_VIEW_HALF_WIDTH degrees of
 * its seaward bearing (see "Sunset tag" in docs/business-rules.md).
 *
 * Run after adding beaches or changing shoreBearing, then migrate:
 *   pnpm tsx scripts/derive-sunset-tag.ts [--dry-run]
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { facesSummerSunset } from '../src/lib/sun-times'

const ROOT = join(import.meta.dirname, '..')
const BEACHES_PATH = join(ROOT, 'data/beaches.json')
const TAGS_PATH = join(ROOT, 'data/tags.json')

type Beach = {
  code: string
  name: string
  shoreBearing?: number
  tags?: number[]
}

const isDryRun = process.argv.includes('--dry-run')
const tags = JSON.parse(readFileSync(TAGS_PATH, 'utf-8')) as { id: string }[]
const sunsetTag = tags.findIndex((tag) => tag.id === 'puesta-sol')
if (sunsetTag < 0) throw new Error('puesta-sol tag missing from data/tags.json')

const raw = readFileSync(BEACHES_PATH, 'utf-8')
const beaches = JSON.parse(raw) as Beach[]

const added: string[] = []
const removed: string[] = []
for (const beach of beaches) {
  if (beach.shoreBearing === undefined) continue
  const has = beach.tags?.includes(sunsetTag) ?? false
  const should = facesSummerSunset(beach.shoreBearing)
  if (should && !has) {
    beach.tags = [...(beach.tags ?? []), sunsetTag]
    added.push(`${beach.code} ${beach.name} (${String(beach.shoreBearing)}°)`)
  } else if (!should && has) {
    beach.tags = beach.tags?.filter((tag) => tag !== sunsetTag)
    removed.push(
      `${beach.code} ${beach.name} (${String(beach.shoreBearing)}°)`,
    )
  }
}

console.log(`Added (${String(added.length)}):\n  ${added.join('\n  ')}`)
console.log(`Removed (${String(removed.length)}):\n  ${removed.join('\n  ')}`)
const total = beaches.filter((b) => b.tags?.includes(sunsetTag)).length
console.log(`Beaches with puesta-sol: ${String(total)}`)

if (isDryRun) {
  console.log('Dry run: not writing beaches.json')
} else {
  writeFileSync(
    BEACHES_PATH,
    JSON.stringify(beaches, null, 2) + (raw.endsWith('\n') ? '\n' : ''),
  )
}
