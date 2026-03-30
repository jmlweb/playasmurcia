/**
 * Generates optimized WebP and AVIF variants from source images in public/pictures/.
 *
 * For each .png/.jpg source file, creates:
 *   - A WebP version at original size (quality 80)
 *   - An AVIF version at original size (quality 65)
 *   - A 1200px "full" variant in WebP and AVIF for detail pages
 *   - An 800px "medium" variant in WebP and AVIF for mid-size contexts
 *   - A 400px "thumb" variant in WebP and AVIF for card grids
 *
 * Output goes to public/pictures/optimized/ with the same base name.
 *
 * Usage: pnpm optimize:images
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'

const SRC_DIR = join(import.meta.dirname, '..', 'public', 'pictures')
const OUT_DIR = join(SRC_DIR, 'optimized')
const FULL_WIDTH = 1200
const MEDIUM_WIDTH = 800
const THUMB_WIDTH = 400
const WEBP_QUALITY = 80
const AVIF_QUALITY = 65

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const files = await readdir(SRC_DIR)
  const images = files.filter((f) => /\.(png|jpe?g)$/i.test(f))

  console.log(`Processing ${images.length} images...`)

  let created = 0
  let skipped = 0

  for (const file of images) {
    const srcPath = join(SRC_DIR, file)
    const { name } = parse(file)

    const outputs = [
      join(OUT_DIR, `${name}.webp`),
      join(OUT_DIR, `${name}.avif`),
      join(OUT_DIR, `${name}-full.webp`),
      join(OUT_DIR, `${name}-full.avif`),
      join(OUT_DIR, `${name}-medium.webp`),
      join(OUT_DIR, `${name}-medium.avif`),
      join(OUT_DIR, `${name}-thumb.webp`),
      join(OUT_DIR, `${name}-thumb.avif`),
    ]

    // Skip if all outputs already exist and are newer than source
    const srcStat = await stat(srcPath)
    const outputStats = await Promise.all(
      outputs.map((o) => stat(o).catch(() => null)),
    )
    const allFresh = outputStats.every((s) => s && s.mtimeMs > srcStat.mtimeMs)

    if (allFresh) {
      skipped++
      continue
    }

    const img = sharp(srcPath)

    await Promise.all([
      img.clone().webp({ quality: WEBP_QUALITY }).toFile(outputs[0]),
      img.clone().avif({ quality: AVIF_QUALITY }).toFile(outputs[1]),
      img
        .clone()
        .resize(FULL_WIDTH)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputs[2]),
      img
        .clone()
        .resize(FULL_WIDTH)
        .avif({ quality: AVIF_QUALITY })
        .toFile(outputs[3]),
      img
        .clone()
        .resize(MEDIUM_WIDTH)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputs[4]),
      img
        .clone()
        .resize(MEDIUM_WIDTH)
        .avif({ quality: AVIF_QUALITY })
        .toFile(outputs[5]),
      img
        .clone()
        .resize(THUMB_WIDTH)
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputs[6]),
      img
        .clone()
        .resize(THUMB_WIDTH)
        .avif({ quality: AVIF_QUALITY })
        .toFile(outputs[7]),
    ])

    created++
    if (created % 50 === 0) console.log(`  ${created} images processed...`)
  }

  console.log(`Done: ${created} optimized, ${skipped} skipped (up to date)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
