/**
 * Writes data/protected-areas.json: the regional protected natural spaces (ENP)
 * and Natura 2000 sites (LIC, ZEC, ZEPA) that hold each beach, intersecting the
 * beach coordinates with the CARM (IDERM) WFS layers.
 *
 * RETAINED: run after adding beaches or moving coordinates, and once a year to
 * catch new designations. The output is bundled at build time, so no migration.
 * Run: pnpm tsx scripts/assign-protected-areas.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import type {
  AreaGeometry,
  ProtectedArea,
  ProtectedAreaFeature,
  ProtectedAreasFile,
  ProtectedAreasLayer,
} from '../src/lib/protected-areas'

import { findContainingAreas } from '../src/lib/protected-areas'

type JsonBeach = { code: string; name: string; coordinates: [number, number] }

type WfsFeature = {
  properties: Record<string, string | number | null>
  geometry: AreaGeometry | null
}

type LayerSpec = {
  typeName: string
  toArea: (properties: WfsFeature['properties']) => ProtectedArea | null
}

const ROOT = join(import.meta.dirname, '..')
const BEACHES_PATH = join(ROOT, 'data/beaches.json')
const OUTPUT_PATH = join(ROOT, 'data/protected-areas.json')

const SERVICE_URL = 'https://mapas-gis-inter.carm.es/geoserver/wfs'
const VIEWER_URL = 'https://mapas-gis-inter.carm.es/mapstore/'

// Beach points sit on the waterline and many limits follow the shore, so a
// point a few metres out at sea still belongs to the park behind it
const TOLERANCE_METERS = 50

// Sites drawn over the sea or the Mar Menor lagoon touch every beach on their
// shore. CARM lists three marine LIC/ZEC and two marine ZEPA under the Ministry;
// the Mar Menor ZEPA covers the whole lagoon.
const EXCLUDED_MARINE_SITES = [
  'ES6200029', // Franja litoral sumergida de la Región de Murcia (ZEC)
  'ES6200030', // Mar Menor (ZEC)
  'ES6200048', // Valles submarinos del escarpe de Mazarrón (ZEC)
  'ES0000507', // Espacio marino de los islotes litorales de Murcia y Almería (ZEPA)
  'ES0000508', // Espacio marino de Tabarca-Cabo de Palos (ZEPA)
  'ES0000260', // Mar Menor (ZEPA)
]

// Planning extent around a park, not a protected space in itself
const PORN_ONLY_FIGURE = 'Resto Ámbito PORN'

const text = (value: string | number | null | undefined) =>
  String(value ?? '').trim()

const LAYERS: LayerSpec[] = [
  {
    typeName: 'SIG_LUP_SITES_CARM:ENP',
    toArea: (properties) =>
      text(properties.figura) === PORN_ONLY_FIGURE
        ? null
        : {
            code: text(properties.codigoenp),
            name: text(properties.nombre),
            designation: text(properties.figura),
            network: 'enp',
          },
  },
  {
    typeName: 'SIG_LUP_SITES_CARM:LIC-ZEC',
    toArea: (properties) => ({
      code: text(properties.site_code),
      name: text(properties.site_name),
      designation: text(properties.figura),
      network: 'natura2000',
    }),
  },
  {
    typeName: 'SIG_LUP_SITES_CARM:ZEPA',
    toArea: (properties) => ({
      code: text(properties.site_code),
      name: text(properties.site_name),
      designation: 'ZEPA',
      network: 'natura2000',
    }),
  },
]

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, 'utf8')) as T

const fetchText = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return response.text()
}

const getFeatureUrl = (typeName: string) =>
  `${SERVICE_URL}?${new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: typeName,
    outputFormat: 'application/json',
    // GeoServer answers this one in [lng, lat] order, unlike urn:ogc:def:crs:EPSG::4326
    srsName: 'EPSG:4326',
  })}`

const capabilitiesUrl = `${SERVICE_URL}?service=WFS&version=2.0.0&request=GetCapabilities`

// The layers carry no version field: the abstract and title are the closest record
const describeLayer = (capabilities: string, typeName: string) => {
  const start = capabilities.indexOf(`<Name>${typeName}</Name>`)
  if (start === -1) throw new Error(`${typeName} is not in the capabilities`)
  const block = capabilities.slice(
    start,
    capabilities.indexOf('</FeatureType>', start),
  )
  const field = (tag: string) =>
    block.match(new RegExp(`<${tag}>([^<]*)</${tag}>`))?.[1]?.trim() ?? ''
  return { title: field('Title'), abstract: field('Abstract') }
}

const main = async () => {
  const retrievedOn = new Date().toISOString().slice(0, 10)
  const beaches = readJson<JsonBeach[]>(BEACHES_PATH)
  const capabilities = await fetchText(capabilitiesUrl)

  const features: ProtectedAreaFeature[] = []
  const layers: ProtectedAreasLayer[] = []
  for (const spec of LAYERS) {
    const collection = JSON.parse(
      await fetchText(getFeatureUrl(spec.typeName)),
    ) as { features: WfsFeature[] }
    const { title, abstract } = describeLayer(capabilities, spec.typeName)
    layers.push({
      typeName: spec.typeName,
      title,
      version: `WFS snapshot ${retrievedOn}, ${collection.features.length} features. ${abstract}`.trim(),
      featureCount: collection.features.length,
    })
    for (const feature of collection.features) {
      const area = feature.geometry && spec.toArea(feature.properties)
      if (!area || EXCLUDED_MARINE_SITES.includes(area.code)) continue
      features.push({ area, geometry: feature.geometry as AreaGeometry })
    }
  }

  const values: Record<string, ProtectedArea[]> = {}
  const beachesPerArea = new Map<string, number>()
  for (const beach of beaches) {
    const areas = findContainingAreas(
      beach.coordinates,
      features,
      TOLERANCE_METERS,
    )
    if (areas.length === 0) continue
    values[beach.code] = areas
    areas.forEach((area) => {
      const key = `${area.code} ${area.designation} ${area.name}`
      beachesPerArea.set(key, (beachesPerArea.get(key) ?? 0) + 1)
    })
  }

  const output: ProtectedAreasFile = {
    source:
      'Infraestructura de Datos Espaciales de la Región de Murcia (IDERM), servicio WFS de la CARM',
    serviceUrl: SERVICE_URL,
    viewerUrl: VIEWER_URL,
    retrievedOn,
    layers,
    excludedMarineSites: EXCLUDED_MARINE_SITES,
    toleranceMeters: TOLERANCE_METERS,
    values,
  }
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n')

  console.log(
    `${Object.keys(values).length} of ${beaches.length} beaches in a protected area`,
  )
  ;[...beachesPerArea.entries()]
    .sort(([, a], [, b]) => b - a)
    .forEach(([area, count]) => console.log(`  ${count}\t${area}`))
}

await main()
