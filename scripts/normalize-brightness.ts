/**
 * Normalizes brightness and contrast of beach photos using histogram stretching.
 *
 * For each image in public/pictures/, analyzes its luminance histogram and applies
 * a linear stretch so that the darkest pixels map to ~5% and the brightest to ~95%.
 * Images already within acceptable range are skipped.
 *
 * This modifies source files in-place. Run before optimize:images.
 *
 * Usage: pnpm normalize:brightness [--dry-run]
 */

import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { join, parse } from 'node:path'

const SRC_DIR = join(import.meta.dirname, '..', 'public', 'pictures')

/** Percentile thresholds — pixels below/above these are clipped */
const LOW_PERCENTILE = 0.01
const HIGH_PERCENTILE = 0.99

/** If the existing range already covers this fraction of 0–255, skip (conservative — only fix clearly bad images) */
const ACCEPTABLE_RANGE = 0.55

const dryRun = process.argv.includes('--dry-run')

async function analyzeBrightness(path: string) {
  const { data, info } = await sharp(path)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const totalPixels = info.width * info.height
  const histogram = new Uint32Array(256)

  for (let i = 0; i < data.length; i++) {
    histogram[data[i]]++
  }

  let cumulative = 0
  let low = 0
  for (let i = 0; i < 256; i++) {
    cumulative += histogram[i]
    if (cumulative >= totalPixels * LOW_PERCENTILE) {
      low = i
      break
    }
  }

  cumulative = 0
  let high = 255
  for (let i = 255; i >= 0; i--) {
    cumulative += histogram[i]
    if (cumulative >= totalPixels * (1 - HIGH_PERCENTILE)) {
      high = i
      break
    }
  }

  return { low, high, range: (high - low) / 255 }
}

async function normalizeImage(srcPath: string, name: string) {
  const { low, high, range } = await analyzeBrightness(srcPath)

  if (range >= ACCEPTABLE_RANGE) {
    return { name, status: 'skipped' as const, low, high }
  }

  if (dryRun) {
    return { name, status: 'would-fix' as const, low, high }
  }

  // sharp.normalize() does exactly this: linear histogram stretch
  // clipping the tails at 1% on each side
  const ext = parse(srcPath).ext.toLowerCase()
  const outputOptions =
    ext === '.png'
      ? { png: true as const }
      : { jpeg: true as const, quality: 92 }

  const buffer = await sharp(srcPath).normalize().toBuffer()

  if (outputOptions.png) {
    await sharp(buffer).png().toFile(srcPath)
  } else {
    await sharp(buffer).jpeg({ quality: 92 }).toFile(srcPath)
  }

  return { name, status: 'normalized' as const, low, high }
}

async function main() {
  const files = await readdir(SRC_DIR)
  const images = files.filter((f) => /\.(png|jpe?g)$/i.test(f))

  console.log(
    `Analyzing ${images.length} images...${dryRun ? ' (dry run)' : ''}`,
  )

  let normalized = 0
  let skipped = 0
  const results: Awaited<ReturnType<typeof normalizeImage>>[] = []

  for (const file of images) {
    const srcPath = join(SRC_DIR, file)
    const result = await normalizeImage(srcPath, file)
    results.push(result)

    if (result.status === 'skipped') {
      skipped++
    } else {
      normalized++
      console.log(
        `  ${dryRun ? 'Would normalize' : 'Normalized'}: ${file} (range ${result.low}–${result.high})`,
      )
    }
  }

  console.log(
    `\nDone: ${normalized} ${dryRun ? 'would be normalized' : 'normalized'}, ${skipped} skipped (already good)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
