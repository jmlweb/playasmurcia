import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Haversine formula to calculate distance between two points in meters
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000 // Earth's radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// Calculate total length of a way from its geometry points
function calculateWayLength(geometry) {
  let totalLength = 0
  for (let i = 0; i < geometry.length - 1; i++) {
    const p1 = geometry[i]
    const p2 = geometry[i + 1]
    totalLength += haversineDistance(p1.lat, p1.lon, p2.lat, p2.lon)
  }
  return Math.round(totalLength)
}

// Find centroid of a geometry
function calculateCentroid(geometry) {
  const sumLat = geometry.reduce((sum, p) => sum + p.lat, 0)
  const sumLon = geometry.reduce((sum, p) => sum + p.lon, 0)
  return {
    lat: sumLat / geometry.length,
    lon: sumLon / geometry.length
  }
}

async function fetchOsmBeaches() {
  const query = `
    [out:json][timeout:60];
    area["name"="Región de Murcia"]->.murcia;
    (
      way["natural"="beach"](area.murcia);
      relation["natural"="beach"](area.murcia);
    );
    out body geom;
  `

  console.log('Fetching beach data from OpenStreetMap...')

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`
  })

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`)
  }

  const data = await response.json()
  console.log(`Found ${data.elements.length} beaches in OSM`)

  return data.elements
}

// Find minimum distance from a point to any point in the geometry
function minDistanceToGeometry(lat, lon, geometry) {
  let minDist = Infinity
  for (const p of geometry) {
    const dist = haversineDistance(lat, lon, p.lat, p.lon)
    if (dist < minDist) minDist = dist
  }
  return minDist
}

function matchBeachToOsm(beach, osmBeaches, maxDistance = 500) {
  const [beachLat, beachLon] = beach.coordinates
  let bestMatch = null
  let bestDistance = Infinity

  for (const osmBeach of osmBeaches) {
    if (!osmBeach.geometry || osmBeach.geometry.length < 2) continue

    // Check distance to any point in the geometry (not just centroid)
    const distance = minDistanceToGeometry(beachLat, beachLon, osmBeach.geometry)

    if (distance < bestDistance && distance < maxDistance) {
      bestDistance = distance
      bestMatch = osmBeach
    }
  }

  return bestMatch
}

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  const osmBeaches = await fetchOsmBeaches()

  let added = 0
  let skipped = 0

  for (const beach of beaches) {
    if (beach.length !== undefined) {
      skipped++
      continue
    }

    const osmMatch = matchBeachToOsm(beach, osmBeaches)

    if (osmMatch && osmMatch.geometry) {
      const length = calculateWayLength(osmMatch.geometry)

      // Validate reasonable length (10m - 3000m)
      if (length >= 10 && length <= 3000) {
        beach.length = length
        added++
        console.log(`✓ ${beach.name}: ${length}m`)
      } else {
        console.log(`⚠ ${beach.name}: invalid length ${length}m (skipped)`)
      }
    } else {
      console.log(`✗ ${beach.name}: no OSM match found`)
    }
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`\nDone! Added length to ${added} beaches (${skipped} already had data)`)
}

main().catch(console.error)
