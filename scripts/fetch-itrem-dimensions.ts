/**
 * Reads the official length and average width of every beach from its ITREM
 * page ("Características" block) into data/beach-dimensions.json. `length` in
 * beaches.json stays the OSM value; the official figures live beside it.
 *
 * Run when ITREM refreshes its beach sheets (yearly) or beaches are added:
 *   pnpm tsx scripts/fetch-itrem-dimensions.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const BEACHES_PATH = join(ROOT, 'data/beaches.json')
const OUT_PATH = join(ROOT, 'data/beach-dimensions.json')
const pageUrl = (code: string) => `https://itrem.carm.es/es/playa/playa-${code}/`

type Beach = { code: string; name: string }

export type BeachDimensions = {
  /** Metres, as published */
  officialLength?: number
  /** Metres; a range such as "20-35" is stored as its bounds */
  officialWidth?: number
  officialWidthRange?: [number, number]
  sourceUrl: string
}

const FIELD = (label: string) =>
  new RegExp(`<strong>${label}:</strong>\\s*([^<]*)`, 'i')

/** Spanish figures: "1.963" is one thousand nine hundred and sixty-three, "1,2" is one point two */
const toNumber = (text: string) =>
  Number(text.replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'))

/** "580 m", "1.963 m", "20-35 m" or "1,2 km"; anything else is left out */
function parseMetres(raw: string | undefined): { value?: number; range?: [number, number] } {
  if (!raw) return {}
  const text = raw.replace(/&nbsp;/g, ' ').trim().toLowerCase()
  const range = /^(\d+(?:[.,]\d+)?)\s*[-–a]\s*(\d+(?:[.,]\d+)?)\s*(m|km)?/.exec(text)
  if (range) {
    const factor = range[3] === 'km' ? 1000 : 1
    const lo = toNumber(range[1]) * factor
    const hi = toNumber(range[2]) * factor
    return lo < hi ? { range: [lo, hi] } : {}
  }
  const single = /^(\d+(?:[.,]\d+)?)\s*(m|km|metros)?\b/.exec(text)
  if (!single) return {}
  const factor = single[2] === 'km' ? 1000 : 1
  const value = toNumber(single[1]) * factor
  return Number.isFinite(value) && value > 0 ? { value: Math.round(value) } : {}
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8')) as Beach[]
  const values: Record<string, BeachDimensions> = {}
  let failed = 0
  for (const beach of beaches) {
    try {
      const res = await fetch(pageUrl(beach.code))
      if (!res.ok) throw new Error(`ITREM ${String(res.status)}`)
      const html = new TextDecoder('latin1').decode(await res.arrayBuffer())
      // Unknown codes answer 200 with the list page (LRN-038)
      if (!html.includes('<h1 class="h2 fw-bold text-dark mb-2">')) continue
      const length = parseMetres(FIELD('Longitud').exec(html)?.[1])
      const width = parseMetres(FIELD('Anchura media').exec(html)?.[1])
      const entry: BeachDimensions = { sourceUrl: pageUrl(beach.code) }
      if (length.value !== undefined) entry.officialLength = length.value
      if (width.value !== undefined) entry.officialWidth = width.value
      if (width.range) entry.officialWidthRange = width.range
      if (entry.officialLength !== undefined || entry.officialWidth !== undefined || entry.officialWidthRange) {
        values[beach.code] = entry
        console.log(`  ✓ ${beach.code} ${beach.name}: ${String(entry.officialLength ?? '-')} m × ${entry.officialWidthRange ? entry.officialWidthRange.join('-') : String(entry.officialWidth ?? '-')} m`)
      }
    } catch (error) {
      failed++
      console.error(`  ✗ ${beach.code} ${beach.name}: ${String(error)}`)
    }
  }
  if (failed > 0) {
    console.error(`\n${String(failed)} beaches failed; output left untouched`)
    process.exit(1)
  }
  const out = {
    source: 'ITREM, ficha de cada playa (Características: Longitud, Anchura media)',
    sourceUrl: 'https://itrem.carm.es/es/playas/',
    fetchedOn: new Date().toISOString().slice(0, 10),
    values,
  }
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n')
  console.log(`\n${String(Object.keys(values).length)} beaches with official dimensions (${String(failed)} failed)`)
}

await main()
