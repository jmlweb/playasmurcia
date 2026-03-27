/**
 * Assigns water quality ratings to beaches based on certifications and location.
 *
 * Data source: Heuristic based on official certifications and geographic features.
 * The official source is MITECO Shapefile (annual beach census), but downloading
 * and parsing shapefiles is complex. This script uses logic-based inference instead.
 *
 * This script should be RETAINED - water quality data changes annually.
 * Re-run when certification data is updated.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

type Beach = {
  code: string
  name: string
  sea: number
  certifications?: Array<string>
  description: string
  [key: string]: unknown
}

// Sea indices
const SEA_MAR_MENOR = 1

// Beaches near industrial/port areas with potentially lower quality
const LOWER_QUALITY_NAMES = ['portmán', 'escombreras']

function inferWaterQuality(
  beach: Beach,
): 'excellent' | 'good' | 'sufficient' | 'poor' {
  const certs = beach.certifications || []
  const nameLower = beach.name.toLowerCase()

  // Industrial/port areas → sufficient
  if (LOWER_QUALITY_NAMES.some((n) => nameLower.includes(n))) {
    return 'sufficient'
  }

  // Blue flag → excellent
  if (certs.includes('blue-flag')) {
    return 'excellent'
  }

  // Q-quality → excellent or good
  if (certs.includes('q-quality')) {
    return 'excellent'
  }

  // Mar Menor → good (lagoon with less water renewal)
  if (beach.sea === SEA_MAR_MENOR) {
    return 'good'
  }

  // Open Mediterranean beaches → excellent by default
  return 'excellent'
}

function main() {
  const filePath = join(process.cwd(), 'data', 'beaches.json')
  const beaches: Array<Beach> = JSON.parse(readFileSync(filePath, 'utf-8'))

  const stats = { excellent: 0, good: 0, sufficient: 0, poor: 0 }

  for (const beach of beaches) {
    const quality = inferWaterQuality(beach)
    beach.waterQuality = quality
    stats[quality]++
  }

  writeFileSync(filePath, JSON.stringify(beaches, null, 2) + '\n')

  console.log(`\nWater Quality Distribution (${beaches.length} beaches):`)
  console.log(
    `  Excellent:  ${stats.excellent} (${((stats.excellent / beaches.length) * 100).toFixed(1)}%)`,
  )
  console.log(
    `  Good:       ${stats.good} (${((stats.good / beaches.length) * 100).toFixed(1)}%)`,
  )
  console.log(
    `  Sufficient: ${stats.sufficient} (${((stats.sufficient / beaches.length) * 100).toFixed(1)}%)`,
  )
  console.log(
    `  Poor:       ${stats.poor} (${((stats.poor / beaches.length) * 100).toFixed(1)}%)`,
  )
}

main()
