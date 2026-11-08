/**
 * Intersects every beach with the Natura 2000 network (EEA ArcGIS service,
 * end-2024 release) and the regional Espacios Naturales Protegidos (CARM WFS)
 * into data/protected-areas.json. Shoreline coordinates often fall a few
 * metres seaward of a land polygon, so both lookups use a 200 m buffer.
 *
 * Run after adding beaches or when a new Natura 2000 release is out:
 *   pnpm tsx scripts/fetch-protected-areas.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const BEACHES_PATH = join(ROOT, 'data/beaches.json')
const OUT_PATH = join(ROOT, 'data/protected-areas.json')
const BUFFER_METRES = 200

const NATURA_URL =
  'https://bio.discomap.eea.europa.eu/arcgis/rest/services/ProtectedSites/Natura2000Sites/MapServer/2/query'
const CARM_WFS_URL = 'https://mapas-gis-inter.carm.es/geoserver/wfs'

type Beach = { code: string; name: string; coordinates: [number, number] }

export type NaturaSite = {
  code: string
  name: string
  /** A = birds directive (ZEPA), B = habitats directive (LIC/ZEC), C = both */
  type: 'A' | 'B' | 'C'
}

export type RegionalSite = {
  code: string
  name: string
  figure: string
  norm: string
}

export type ProtectedAreas = {
  natura2000: NaturaSite[]
  regional: RegionalSite[]
}

// WGS84 to UTM zone 30N (EPSG:25830), the CRS the CARM layer stores geometry in
function toUtm30(lat: number, lng: number): [number, number] {
  const a = 6378137
  const f = 1 / 298.257222101
  const k0 = 0.9996
  const lng0 = (-3 * Math.PI) / 180
  const e2 = f * (2 - f)
  const phi = (lat * Math.PI) / 180
  const lam = (lng * Math.PI) / 180 - lng0
  const n = a / Math.sqrt(1 - e2 * Math.sin(phi) ** 2)
  const t = Math.tan(phi) ** 2
  const c = (e2 / (1 - e2)) * Math.cos(phi) ** 2
  const A = lam * Math.cos(phi)
  const e4 = e2 * e2
  const e6 = e4 * e2
  const M =
    a *
    ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * phi -
      ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * phi) +
      ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * phi) -
      ((35 * e6) / 3072) * Math.sin(6 * phi))
  const x =
    500000 +
    k0 *
      n *
      (A +
        ((1 - t + c) * A ** 3) / 6 +
        ((5 - 18 * t + t * t + 72 * c - 58 * (e2 / (1 - e2))) * A ** 5) / 120)
  const y =
    k0 *
    (M +
      n *
        Math.tan(phi) *
        (A ** 2 / 2 +
          ((5 - t + 9 * c + 4 * c * c) * A ** 4) / 24 +
          ((61 - 58 * t + t * t + 600 * c - 330 * (e2 / (1 - e2))) * A ** 6) /
            720))
  return [x, y]
}

async function fetchNatura(lat: number, lng: number): Promise<NaturaSite[]> {
  const params = new URLSearchParams({
    geometry: `${String(lng)},${String(lat)}`,
    geometryType: 'esriGeometryPoint',
    inSR: '4326',
    spatialRel: 'esriSpatialRelIntersects',
    distance: String(BUFFER_METRES),
    units: 'esriSRUnit_Meter',
    outFields: 'SITECODE,SITENAME,SITETYPE',
    returnGeometry: 'false',
    f: 'json',
  })
  const res = await fetch(`${NATURA_URL}?${params}`)
  const data = (await res.json()) as {
    error?: { message: string }
    features?: { attributes: { SITECODE: string; SITENAME: string; SITETYPE: 'A' | 'B' | 'C' } }[]
  }
  if (data.error) throw new Error(`EEA: ${data.error.message}`)
  return (data.features ?? [])
    .map(({ attributes }) => ({
      code: attributes.SITECODE,
      name: attributes.SITENAME.trim(),
      type: attributes.SITETYPE,
    }))
    .sort((a, b) => a.code.localeCompare(b.code))
}

async function fetchRegional(lat: number, lng: number): Promise<RegionalSite[]> {
  const [x, y] = toUtm30(lat, lng)
  const params = new URLSearchParams({
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typeNames: 'SIG_LUP_SITES_CARM:ENP',
    outputFormat: 'application/json',
    propertyName: 'nombre,figura,norma,codigoenp',
    CQL_FILTER: `DWITHIN(geom,POINT(${x.toFixed(1)} ${y.toFixed(1)}),${String(BUFFER_METRES)},meters)`,
  })
  const res = await fetch(`${CARM_WFS_URL}?${params}`)
  if (!res.ok) throw new Error(`CARM WFS ${String(res.status)}`)
  const data = (await res.json()) as {
    features: { properties: { nombre: string; figura: string; norma: string; codigoenp: string } }[]
  }
  const byCode = new Map<string, RegionalSite>()
  for (const { properties } of data.features) {
    // PORN buffers and proposals are not protected spaces the visitor stands in
    if (/Resto Ámbito PORN|Sin figura asignada/i.test(properties.figura)) continue
    // The same park appears once per declaring act; keep the first (Ley 4/1992 lists first)
    if (byCode.has(properties.codigoenp)) continue
    byCode.set(properties.codigoenp, {
      code: properties.codigoenp,
      name: properties.nombre.trim(),
      figure: properties.figura.trim(),
      norm: properties.norma.trim(),
    })
  }
  return [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code))
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8')) as Beach[]
  const values: Record<string, ProtectedAreas> = {}
  let failed = 0
  for (const beach of beaches) {
    const [lat, lng] = beach.coordinates
    try {
      const [natura2000, regional] = await Promise.all([
        fetchNatura(lat, lng),
        fetchRegional(lat, lng),
      ])
      if (natura2000.length > 0 || regional.length > 0) {
        values[beach.code] = { natura2000, regional }
      }
      console.log(
        `  ${beach.code} ${beach.name}: ${String(natura2000.length)} Natura, ${String(regional.length)} ENP`,
      )
    } catch (error) {
      failed++
      console.error(`  ✗ ${beach.code} ${beach.name}: ${String(error)}`)
    }
  }
  const out = {
    natura2000Source: {
      label: 'Red Natura 2000, European Environment Agency (EEA), versión fin de 2024, CC BY 4.0',
      url: 'https://www.eea.europa.eu/en/datahub/datahubitem-view/6fc8ad2d-195d-40f4-bdec-576e7d1268e4',
    },
    regionalSource: {
      label: 'Espacios Naturales Protegidos, Comunidad Autónoma de la Región de Murcia (IDERM / SITMURCIA)',
      url: 'https://mapas-gis-inter.carm.es/geoserver/wfs?service=WFS&version=2.0.0&request=GetCapabilities',
    },
    bufferMetres: BUFFER_METRES,
    fetchedOn: new Date().toISOString().slice(0, 10),
    values,
  }
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2) + '\n')
  console.log(
    `\n${String(Object.keys(values).length)} beaches with protected areas saved (${String(failed)} failed)`,
  )
}

await main()
