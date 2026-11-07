import { edgeCacheGet, edgeCacheSet } from './edge-cache'

const COPLA_URL = 'https://www.112rmurcia.es/copla/copla.xml'
const CACHE_TTL_SECONDS = 15 * 60 // 15 minutes
const CACHE_NS = 'copla-112'
const STALE_DAYS = 2

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BeachFlag =
  | 'VERDE'
  | 'AMARILLA'
  | 'ROJA'
  | 'PLAYA CERRADA'
  | 'SIN BANDERA'
export type SeaState = 'BUENO' | 'REGULAR' | 'MALO' | 'SIN ESTADO'

export type BeachStatus112 = {
  flag: BeachFlag
  seaState: SeaState
  date: string
  time: string
  isOffSeason: boolean
}

type CoplaEntry = {
  id: string
  dia: string
  hora: string
  municipio: string
  playa: string
  bandera: string
  estadoMar: string
}

// ---------------------------------------------------------------------------
// XML parsing (regex-based, no external library — works on Cloudflare Workers)
// ---------------------------------------------------------------------------

function extractTagValue(xml: string, tag: string): string {
  const match = new RegExp(`<${tag}>([^<]*)</${tag}>`, 'i').exec(xml)
  return match ? match[1].trim() : ''
}

function parseCoplaXml(xml: string): CoplaEntry[] {
  const entries: CoplaEntry[] = []
  // Split on closing tag to get each <banderas> block
  const blockRegex = /<banderas>([\s\S]*?)<\/banderas>/gi
  let match: RegExpExecArray | null
  while ((match = blockRegex.exec(xml)) !== null) {
    const block = match[1]
    entries.push({
      id: extractTagValue(block, 'id'),
      dia: extractTagValue(block, 'dia'),
      hora: extractTagValue(block, 'hora'),
      municipio: extractTagValue(block, 'municipio'),
      playa: extractTagValue(block, 'playa'),
      bandera: extractTagValue(block, 'bandera'),
      estadoMar: extractTagValue(block, 'estadoMar'),
    })
  }
  return entries
}

// ---------------------------------------------------------------------------
// Fuzzy name matching (case-insensitive, accent-stripped)
// ---------------------------------------------------------------------------

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accent marks
    .replace(/[^a-z0-9\s]/g, '') // strip punctuation
    .replace(/\s+/g, ' ')
    .trim()
}

function namesMatch(xmlName: string, dbName: string): boolean {
  const a = normalizeText(xmlName)
  const b = normalizeText(dbName)
  return a === b || a.includes(b) || b.includes(a)
}

// The feed splits some beaches into segments ("BOLNUEVO (CENTRO)",
// "PONIENTE I", "BARNUEVO (LIMA 1)") while site names carry a "Playa de"
// prefix, so neither name contains the other. Both reduce to a bare beach
// name that must be equal; the text in parentheses is dropped, never used as
// an alias, because it often names another beach ("ISLAS MENORES (LEVANTE)").
const PARENTHESIZED = /\([^)]*\)/g
const LEADING_PLAYA = /^playa (?:del? )?/
const LEADING_ARTICLE = /^(?:el|la|los|las) /
const TRAILING_ROMAN_NUMERAL = / (?:i|ii|iii|iv)$/

function bareBeachName(name: string): string {
  return normalizeText(name.replace(PARENTHESIZED, ' '))
    .replace(TRAILING_ROMAN_NUMERAL, '')
    .replace(LEADING_PLAYA, '')
    .replace(LEADING_ARTICLE, '')
}

function segmentNamesMatch(xmlName: string, dbName: string): boolean {
  const bareName = bareBeachName(dbName)
  return bareName !== '' && bareBeachName(xmlName) === bareName
}

function municipalitiesMatch(
  xmlMunicipality: string,
  dbMunicipality: string,
): boolean {
  const a = normalizeText(xmlMunicipality)
  const b = normalizeText(dbMunicipality)
  return a === b || a.includes(b) || b.includes(a)
}

// Feed names no name rule can reach, keyed by municipality and site beach
// name as written in data/beaches.json. The feed's coordx/coordy cannot
// replace this: on the live feed, matched entries sit up to 3 km from their
// beach, and a 0.5 km nearest-entry fallback would hand ~27 unrelated beaches
// a neighbour's flag or closure. An exact alias has no such false positives.
// Compared with normalizeText on both sides, so punctuation and case in the
// feed may drift. Several aliases mean several segments: the most severe wins.
export const COPLA_FEED_ALIASES: Readonly<
  Record<string, Readonly<Record<string, readonly string[]>>>
> = {
  Cartagena: {
    'Playa Calnegre': ['MONTE BLANCO - CALNEGRE'],
    'Playa de La Chapineta': ['LA AZOHIA (CHAPINETA)'],
  },
  Lorca: {
    'Cala de Calnegre': ['PLAYA DE CALNEGRE'],
  },
  Mazarrón: {
    'Playa de El Rihuete (Playa del Rigüete)': [
      'PUERTO - RIHUETE',
      'SILLAS DE RIHUETE',
    ],
  },
}

const normalizedAliases = new Map(
  Object.entries(COPLA_FEED_ALIASES).flatMap(([municipality, beaches]) =>
    Object.entries(beaches).map(([beachName, feedNames]) => [
      `${normalizeText(municipality)}|${normalizeText(beachName)}`,
      new Set(feedNames.map(normalizeText)),
    ]),
  ),
)

function aliasFeedNames(
  beachName: string,
  municipalityName: string,
): ReadonlySet<string> | undefined {
  return normalizedAliases.get(
    `${normalizeText(municipalityName)}|${normalizeText(beachName)}`,
  )
}

// ---------------------------------------------------------------------------
// Entry lookup
// ---------------------------------------------------------------------------

const FLAG_SEVERITY: Record<BeachFlag, number> = {
  'PLAYA CERRADA': 4,
  ROJA: 3,
  AMARILLA: 2,
  VERDE: 1,
  'SIN BANDERA': 0,
}

function flagSeverity(entry: CoplaEntry): number {
  return FLAG_SEVERITY[toBeachFlag(entry.bandera)]
}

const mostSevereEntry = (entries: CoplaEntry[]): CoplaEntry | undefined =>
  entries.reduce<CoplaEntry | undefined>(
    (mostSevere, e) =>
      mostSevere && flagSeverity(mostSevere) >= flagSeverity(e)
        ? mostSevere
        : e,
    undefined,
  )

/**
 * A direct name match wins. Otherwise the beach's feed segments are used,
 * and when there are several the most severe flag is shown so a closure or
 * red flag on any segment is never hidden. Beaches whose feed name no rule
 * can reach fall back to their explicit aliases, last, so no existing match
 * moves.
 */
function findCoplaEntry(
  entries: CoplaEntry[],
  beachName: string,
  municipalityName: string,
): CoplaEntry | undefined {
  const sameMunicipality = entries.filter((e) =>
    municipalitiesMatch(e.municipio, municipalityName),
  )
  const directMatch = sameMunicipality.find((e) =>
    namesMatch(e.playa, beachName),
  )
  if (directMatch) return directMatch

  const segmentMatch = mostSevereEntry(
    sameMunicipality.filter((e) => segmentNamesMatch(e.playa, beachName)),
  )
  if (segmentMatch) return segmentMatch

  const aliases = aliasFeedNames(beachName, municipalityName)
  if (!aliases) return undefined
  return mostSevereEntry(
    sameMunicipality.filter((e) => aliases.has(normalizeText(e.playa))),
  )
}

// ---------------------------------------------------------------------------
// Staleness check
// ---------------------------------------------------------------------------

/**
 * Returns true if the date string (dd/MM/yyyy) is more than STALE_DAYS old.
 * Off-season: data from 112 may have old dates from the previous summer.
 */
function isDataStale(dia: string): boolean {
  // Format: dd/MM/yyyy
  const parts = dia.split('/')
  if (parts.length !== 3) return true
  const [day, month, year] = parts
  const dataDate = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
  )
  const now = new Date()
  const diffMs = now.getTime() - dataDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays > STALE_DAYS
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

const VALID_FLAGS = new Set<BeachFlag>([
  'VERDE',
  'AMARILLA',
  'ROJA',
  'PLAYA CERRADA',
  'SIN BANDERA',
])

const VALID_SEA_STATES = new Set<SeaState>([
  'BUENO',
  'REGULAR',
  'MALO',
  'SIN ESTADO',
])

function toBeachFlag(value: string): BeachFlag {
  const upper = value.toUpperCase()
  return VALID_FLAGS.has(upper as BeachFlag)
    ? (upper as BeachFlag)
    : 'SIN BANDERA'
}

function toSeaState(value: string): SeaState {
  const upper = value.toUpperCase()
  return VALID_SEA_STATES.has(upper as SeaState)
    ? (upper as SeaState)
    : 'SIN ESTADO'
}

// ---------------------------------------------------------------------------
// Fetch & cache
// ---------------------------------------------------------------------------

async function fetchAndCacheEntries(): Promise<CoplaEntry[]> {
  const cached = await edgeCacheGet<CoplaEntry[]>(CACHE_NS, 'all')
  if (cached !== undefined) return cached

  const response = await fetch(COPLA_URL)
  if (!response.ok) {
    throw new Error(`112 COPLA fetch failed: ${response.status}`)
  }
  const xml = await response.text()
  const entries = parseCoplaXml(xml)

  await edgeCacheSet(CACHE_NS, 'all', entries, CACHE_TTL_SECONDS)
  return entries
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the current beach flag status from the 112 Murcia COPLA service.
 * Returns null if no matching entry is found, and throws when the feed fails,
 * so callers can tell "no flag for this beach" from "could not ask".
 */
export async function getBeachStatus(
  beachName: string,
  municipalityName: string,
): Promise<BeachStatus112 | null> {
  const entries = await fetchAndCacheEntries()
  const entry = findCoplaEntry(entries, beachName, municipalityName)

  if (!entry) return null

  const offSeason = isDataStale(entry.dia)

  return {
    flag: toBeachFlag(entry.bandera),
    seaState: toSeaState(entry.estadoMar),
    date: entry.dia,
    time: entry.hora,
    isOffSeason: offSeason,
  }
}

/**
 * Current flag for many beaches from a single (cached) COPLA fetch, for
 * listing cards. Beaches with no match, stale data or no flag are omitted so
 * cards render nothing for them.
 */
export async function getBatchBeachFlags(
  beaches: { code: string; name: string; municipalityName: string }[],
): Promise<Map<string, BeachFlag>> {
  const result = new Map<string, BeachFlag>()
  let entries: CoplaEntry[]
  try {
    entries = await fetchAndCacheEntries()
  } catch {
    return result
  }

  for (const beach of beaches) {
    const entry = findCoplaEntry(entries, beach.name, beach.municipalityName)
    if (!entry || isDataStale(entry.dia)) continue
    const flag = toBeachFlag(entry.bandera)
    if (flag !== 'SIN BANDERA') result.set(beach.code, flag)
  }
  return result
}

export type TodayBeachFlags = {
  flags: Map<string, BeachFlag>
  latestTime?: string
}

const madridDayFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Madrid',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

/**
 * Flags the feed published today, Madrid time, with the newest report time.
 * Stricter than getBatchBeachFlags: a two-day-old flag is fine on a card but
 * would be false under a heading that says "hoy".
 */
export async function getTodayBeachFlags(
  beaches: { code: string; name: string; municipalityName: string }[],
  now: Date = new Date(),
): Promise<TodayBeachFlags> {
  let entries: CoplaEntry[]
  try {
    entries = await fetchAndCacheEntries()
  } catch {
    return { flags: new Map() }
  }

  const today = madridDayFormat.format(now)
  const todayEntries = entries.filter((entry) => entry.dia === today)
  if (todayEntries.length === 0) return { flags: new Map() }

  const flags = new Map<string, BeachFlag>()
  let latestTime: string | undefined
  for (const beach of beaches) {
    const entry = findCoplaEntry(
      todayEntries,
      beach.name,
      beach.municipalityName,
    )
    if (!entry) continue
    const flag = toBeachFlag(entry.bandera)
    if (flag === 'SIN BANDERA') continue
    flags.set(beach.code, flag)
    const time = entry.hora.padStart(5, '0')
    if (latestTime === undefined || time > latestTime) latestTime = time
  }
  return latestTime === undefined ? { flags } : { flags, latestTime }
}
