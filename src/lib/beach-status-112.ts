import { edgeCacheGet, edgeCacheSet } from './edge-cache'

const COPLA_URL = 'https://www.112rmurcia.es/copla/copla.xml'
const CACHE_TTL_SECONDS = 15 * 60 // 15 minutes
const CACHE_NS = 'copla-112'
const STALE_DAYS = 2

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BeachFlag = 'VERDE' | 'AMARILLA' | 'ROJA' | 'SIN BANDERA'
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
  const match = new RegExp(`<${tag}>([^<]*)<\/${tag}>`, 'i').exec(xml)
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

function municipalitiesMatch(
  xmlMunicipality: string,
  dbMunicipality: string,
): boolean {
  const a = normalizeText(xmlMunicipality)
  const b = normalizeText(dbMunicipality)
  return a === b || a.includes(b) || b.includes(a)
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
 * Returns null if no matching entry is found.
 */
export async function getBeachStatus(
  beachName: string,
  municipalityName: string,
): Promise<BeachStatus112 | null> {
  let entries: CoplaEntry[]
  try {
    entries = await fetchAndCacheEntries()
  } catch {
    return null
  }

  const entry = entries.find(
    (e) =>
      namesMatch(e.playa, beachName) &&
      municipalitiesMatch(e.municipio, municipalityName),
  )

  if (!entry) return null

  const offSeason = isDataStale(entry.dia)

  return {
    flag: entry.bandera as BeachFlag,
    seaState: entry.estadoMar as SeaState,
    date: entry.dia,
    time: entry.hora,
    isOffSeason: offSeason,
  }
}
