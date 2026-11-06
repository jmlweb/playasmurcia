/**
 * Sets each beach's `zone` in data/beaches.json from the ITREM locality labels
 * (data/source/itrem-localities.json) and the hand curation in data/zones.json.
 * Beaches listed under `unresolved` in data/zones.json lose any zone.
 *
 * RETAINED: run after adding beaches or editing data/zones.json, then migrate.
 * Run: pnpm tsx scripts/assign-zones.ts
 * Refresh the ITREM snapshot first: pnpm tsx scripts/assign-zones.ts --fetch
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ItremSnapshot } from '../src/lib/zones'

import { resolveBeachZone } from '../src/lib/zones'

type JsonBeach = { code: string; zone?: string } & Record<string, unknown>

const ROOT = join(import.meta.dirname, '..')
const BEACHES_PATH = join(ROOT, 'data/beaches.json')
const SNAPSHOT_PATH = join(ROOT, 'data/source/itrem-localities.json')

// The slug part of the URL is ignored: the beach code alone selects the page
const itremPageUrl = (code: string) =>
  `https://itrem.carm.es/es/playa/playa-${code}/`
const TITLE_PATTERN = /<h1 class="h2 fw-bold text-dark mb-2">([^<]*)<\/h1>/
const LABEL_PATTERN = /<p class="fw-semibold small mb-4">([^<]*)<\/p>/
const REQUEST_DELAY_MS = 250

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, 'utf8')) as T

const writeJson = (path: string, value: unknown) =>
  writeFileSync(path, JSON.stringify(value, null, 2) + '\n')

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Unknown codes get the generic beach list page, which has no title
const fetchItremLabel = async (
  code: string,
): Promise<{ hasPage: boolean; label: string | null }> => {
  const response = await fetch(itremPageUrl(code))
  if (!response.ok) throw new Error(`ITREM ${code}: HTTP ${response.status}`)
  // ITREM serves Latin-1; decoding as UTF-8 garbles every accented name
  const html = new TextDecoder('latin1').decode(await response.arrayBuffer())
  if (!TITLE_PATTERN.test(html)) return { hasPage: false, label: null }
  return { hasPage: true, label: html.match(LABEL_PATTERN)?.[1]?.trim() || null }
}

const fetchSnapshot = async (beaches: JsonBeach[]) => {
  const withoutPage: string[] = []
  const labels: Record<string, string | null> = {}
  for (const { code } of beaches) {
    const { hasPage, label } = await fetchItremLabel(code)
    if (hasPage) labels[code] = label
    else withoutPage.push(code)
    await wait(REQUEST_DELAY_MS)
  }
  return {
    source: 'https://itrem.carm.es/es/playa/<slug>-<code>/',
    fetchedOn: new Date().toISOString().slice(0, 10),
    encoding: 'ISO-8859-1',
    withoutPage,
    labels,
  }
}

// Keeps `zone` right after `municipality` so diffs stay readable
const withZone = (beach: JsonBeach, zone: string | undefined): JsonBeach =>
  Object.fromEntries(
    Object.entries(beach)
      .filter(([key]) => key !== 'zone')
      .flatMap(([key, value]) =>
        key === 'municipality' && zone
          ? [
              [key, value],
              ['zone', zone],
            ]
          : [[key, value]],
      ),
  ) as JsonBeach

const main = async () => {
  const beaches = readJson<JsonBeach[]>(BEACHES_PATH)

  if (process.argv.includes('--fetch')) {
    writeJson(SNAPSHOT_PATH, await fetchSnapshot(beaches))
    console.log(`Wrote ${SNAPSHOT_PATH}`)
  }

  const snapshot = readJson<ItremSnapshot>(SNAPSHOT_PATH)
  const updated = beaches.map((beach) => {
    const resolution = resolveBeachZone(beach.code, snapshot)
    if ('unresolved' in resolution) {
      console.log(`unresolved ${beach.code}: ${resolution.unresolved}`)
      return withZone(beach, undefined)
    }
    return withZone(beach, resolution.zone)
  })

  writeJson(BEACHES_PATH, updated)
  const zoned = updated.filter((beach) => beach.zone).length
  console.log(`${zoned} of ${updated.length} beaches have a zone`)
}

await main()
