/**
 * Generates optimized WebP variants from source images in public/pictures/.
 *
 * For each .png/.jpg source file, creates:
 *   - A WebP version at original size (quality 80)
 *   - A small WebP thumbnail (400w) for card grids
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
const THUMB_WIDTH = 400
const WEBP_QUALITY = 80

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
    const fullWebp = join(OUT_DIR, `${name}.webp`)
    const thumbWebp = join(OUT_DIR, `${name}-thumb.webp`)

    // Skip if both outputs already exist and are newer than source
    const srcStat = await stat(srcPath)
    const fullExists = await stat(fullWebp).catch(() => null)
    const thumbExists = await stat(thumbWebp).catch(() => null)

    if (fullExists && thumbExists && fullExists.mtimeMs > srcStat.mtimeMs && thumbExists.mtimeMs > srcStat.mtimeMs) {
      skipped++
      continue
    }

    const img = sharp(srcPath)

    await img.clone().webp({ quality: WEBP_QUALITY }).toFile(fullWebp)

    await img.clone().resize(THUMB_WIDTH).webp({ quality: WEBP_QUALITY }).toFile(thumbWebp)

    created++
    if (created % 50 === 0) console.log(`  ${created} images processed...`)
  }

  console.log(`Done: ${created} optimized, ${skipped} skipped (up to date)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
