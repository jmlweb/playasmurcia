/**
 * Sets each beach's official bathing-water class (Directive 2006/7/EC) from the
 * EEA bathing water dataset, which republishes the NÁYADE data of the
 * Ministerio de Sanidad. A beach gets the class of the nearest classified
 * Región de Murcia sampling point within MAX_SAMPLING_POINT_DISTANCE_M; other
 * beaches lose any class they had.
 *
 * RETAINED: the EEA publishes a new bathing season every year (around June).
 * Run: pnpm tsx scripts/add-bathing-water-quality.ts, then migrate.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import type { BathingWaterPoint } from '../src/lib/bathing-water-quality'

import {
  MAX_SAMPLING_POINT_DISTANCE_M,
  matchBathingWater,
} from '../src/lib/bathing-water-quality'

// The discodata SQL API answers 403 to scripts; the ArcGIS map service does not.
const SERVICES_URL =
  'https://water.discomap.eea.europa.eu/arcgis/rest/services/BathingWater'
const SEASON_SERVICE = /^BathingWater\/BathingWater_Dyna_WM_(\d{4})$/
const POINT_LAYER_NAME = 'Bathing water quality (point)'

type JsonBeach = {
  code: string
  name: string
  coordinates: [number, number]
  waterQuality?: string
  waterQualitySource?: unknown
  [key: string]: unknown
}

type PointAttributes = {
  bathingWaterIdentifier: string
  bathingWaterName: string
  latitude: number
  longitude: number
  qualityStatus: string | null
  bwProfileLink: string | null
}

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status} for ${url}`)
  const body = (await response.json()) as T & { error?: { message: string } }
  if (body.error) throw new Error(`${body.error.message} for ${url}`)
  return body
}

const findLatestSeason = async (): Promise<number> => {
  const { services } = await fetchJson<{ services: { name: string }[] }>(
    `${SERVICES_URL}?f=json`,
  )
  const seasons = services
    .map((service) => SEASON_SERVICE.exec(service.name)?.[1])
    .filter((year): year is string => year !== undefined)
    .map(Number)
  if (seasons.length === 0) throw new Error('No bathing season service found')
  return Math.max(...seasons)
}

const fetchMurciaPoints = async (
  season: number,
): Promise<BathingWaterPoint[]> => {
  const serviceUrl = `${SERVICES_URL}/BathingWater_Dyna_WM_${season}/MapServer`
  const { layers } = await fetchJson<{
    layers: { id: number; name: string }[]
  }>(`${serviceUrl}?f=json`)
  const layer = layers.find((candidate) => candidate.name === POINT_LAYER_NAME)
  if (!layer) throw new Error(`Layer '${POINT_LAYER_NAME}' not found`)

  const query = new URLSearchParams({
    where: "countryCode = 'ES' AND bathingWaterIdentifier LIKE 'ES620%'",
    outFields:
      'bathingWaterIdentifier,bathingWaterName,latitude,longitude,qualityStatus,bwProfileLink',
    returnGeometry: 'false',
    f: 'json',
  })
  const { features, exceededTransferLimit } = await fetchJson<{
    features: { attributes: PointAttributes }[]
    exceededTransferLimit?: boolean
  }>(`${serviceUrl}/${layer.id}/query?${query}`)
  if (exceededTransferLimit) throw new Error('Result truncated by the server')

  return features.map(({ attributes }) => ({
    id: attributes.bathingWaterIdentifier,
    name: attributes.bathingWaterName,
    latitude: attributes.latitude,
    longitude: attributes.longitude,
    qualityStatus: attributes.qualityStatus,
    profileUrl: attributes.bwProfileLink?.replace(/^http:/, 'https:') ?? null,
  }))
}

const main = async () => {
  const season = await findLatestSeason()
  const points = await fetchMurciaPoints(season)
  console.log(`Season ${season}: ${points.length} Murcia sampling points`)

  const filePath = join(process.cwd(), 'data', 'beaches.json')
  const beaches: JsonBeach[] = JSON.parse(readFileSync(filePath, 'utf-8'))
  const counts: Record<string, number> = {}

  for (const beach of beaches) {
    const match = matchBathingWater(beach.coordinates, points, season)
    if (match) {
      beach.waterQuality = match.waterQuality
      beach.waterQualitySource = match.waterQualitySource
    } else {
      delete beach.waterQuality
      delete beach.waterQualitySource
    }
    const key = match?.waterQuality ?? 'no class'
    counts[key] = (counts[key] ?? 0) + 1
  }

  writeFileSync(filePath, JSON.stringify(beaches, null, 2) + '\n')
  console.log(
    `${beaches.length} beaches, max distance ${MAX_SAMPLING_POINT_DISTANCE_M} m:`,
    counts,
  )
}

await main()
