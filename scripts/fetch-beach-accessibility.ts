/**
 * Fetches the "Accesibilidad" block of every ITREM beach page (FAMDIF field
 * data, one sheet per beach and season) into data/accessibility.json.
 *
 * Run each summer once ITREM publishes the new sheets, then migrate:
 *   pnpm tsx scripts/fetch-beach-accessibility.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const BEACHES_PATH = join(ROOT, 'data/beaches.json')
const OUT_PATH = join(ROOT, 'data/accessibility.json')
const pageUrl = (code: string) => `https://itrem.carm.es/es/playa/playa-${code}/`

type Beach = { code: string; name: string }

export type AssistedBathing = 'staff' | 'loan' | 'none'

export type AccessibilitySheet = {
  year: number
  category: string
  assistedBathing?: AssistedBathing
  amphibiousChairs?: number
  amphibiousCrutches?: number
  walkway?: boolean
  adaptedToilets?: boolean
  adaptedChangingRooms?: boolean
  adaptedShade?: boolean
  adaptedBathingZone?: boolean
  season?: string
  hours?: string
  bookingNote?: string
  sourceUrl: string
  imagesUrl?: string
}

const BLOCK_PATTERN =
  /<h5 class="fw-semibold text-dark mb-2">Accesibilidad<\/h5>\s*<p class="text-muted mb-4">([\s\S]*?)<\/p>/
const FIELD_PATTERN = /<strong>([^<]+?):<\/strong>([\s\S]*?)(?=<strong>|\* Datos referidos|<a |$)/g

const clean = (html: string) =>
  html
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const isYes = (value: string | undefined) =>
  value !== undefined && /^s[ií]\b/i.test(value)

const count = (value: string | undefined) => {
  const m = value?.match(/\((\d+)\)/)
  return m ? Number(m[1]) : isYes(value) ? 1 : undefined
}

function parseAssistedBathing(value: string | undefined): AssistedBathing | undefined {
  if (!value) return undefined
  if (/baño asistido/i.test(value)) return 'staff'
  if (/transferencia|acompañante|préstamo|prestamo/i.test(value)) return 'loan'
  if (/^no\b/i.test(value)) return 'none'
  return undefined
}

function parseSheet(html: string, code: string): AccessibilitySheet | undefined {
  const block = BLOCK_PATTERN.exec(html)?.[1]
  if (!block) return undefined
  const year = Number(/\* Datos referidos (\d{4})/.exec(block)?.[1])
  if (!year) return undefined
  const fields = new Map<string, string>()
  for (const m of block.matchAll(FIELD_PATTERN)) {
    fields.set(clean(m[1]).toLowerCase(), clean(m[2]))
  }
  const get = (label: string) =>
    [...fields.entries()].find(([k]) => k.startsWith(label))?.[1]
  const category = get('valoración general')
  if (!category) return undefined
  const bathing = get('ayuda al baño')
  const walkway = get('pasarelas')
  const bathingZone = get('zona de baño adaptada')
  const sheet: AccessibilitySheet = {
    year,
    category: category.toLowerCase(),
    sourceUrl: pageUrl(code),
  }
  const assisted = parseAssistedBathing(bathing)
  if (assisted) sheet.assistedBathing = assisted
  const chairs = count(get('sillas anfibias'))
  if (chairs !== undefined) sheet.amphibiousChairs = chairs
  const crutches = count(get('muletas anfibias'))
  if (crutches !== undefined) sheet.amphibiousCrutches = crutches
  if (walkway !== undefined) sheet.walkway = !/^no\b/i.test(walkway) && walkway.length > 0
  const toilets = get('aseos adaptados')
  if (toilets !== undefined) sheet.adaptedToilets = isYes(toilets)
  const changing = get('vestuarios adaptados')
  if (changing !== undefined) sheet.adaptedChangingRooms = isYes(changing)
  const shade = get('zonas de sombra adaptadas')
  if (shade !== undefined) sheet.adaptedShade = isYes(shade)
  if (bathingZone !== undefined) {
    sheet.adaptedBathingZone = bathingZone.length > 0 && !/^no\b/i.test(bathingZone)
  }
  const season = get('calendario de ayuda al baño')
  if (season) sheet.season = season
  const hours = get('horario de ayuda al baño')
  if (hours) sheet.hours = hours
  if (bathing && /reserva|teléfono|telefono|solicitar|cita/i.test(bathing)) {
    sheet.bookingNote = bathing
  }
  const images = /href="(http[^"]+ACCESIBILIDAD[^"]+\.pdf)"/i.exec(block)?.[1]
  if (images) sheet.imagesUrl = images
  return sheet
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8')) as Beach[]
  const values: Record<string, AccessibilitySheet> = {}
  let failed = 0
  for (const beach of beaches) {
    try {
      const res = await fetch(pageUrl(beach.code))
      const html = new TextDecoder('latin1').decode(await res.arrayBuffer())
      // Unknown codes answer 200 with the list page (LRN-038): the title check guards that
      if (!html.includes(`<h1 class="h2 fw-bold text-dark mb-2">`)) continue
      const sheet = parseSheet(html, beach.code)
      if (sheet) {
        values[beach.code] = sheet
        console.log(`  ✓ ${beach.code} ${beach.name}: ${sheet.category}`)
      }
    } catch (error) {
      failed++
      console.error(`  ✗ ${beach.code} ${beach.name}: ${String(error)}`)
    }
  }
  const out = {
    source: 'ITREM, ficha de accesibilidad de cada playa (datos de campo FAMDIF)',
    sourceUrl: 'https://itrem.carm.es/es/playas/',
    fetchedOn: new Date().toISOString().slice(0, 10),
    values,
  }
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n')
  console.log(
    `\n${String(Object.keys(values).length)} sheets saved to data/accessibility.json (${String(failed)} failed)`,
  )
}

await main()
