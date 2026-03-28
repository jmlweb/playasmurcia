import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { imageSize } from "image-size"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const BEACHES_PATH = join(ROOT, "data", "beaches.json")
const PUBLIC_PICTURES = join(ROOT, "public", "pictures")

/** Below this short side → score 1 (when any raster exists). */
const SHORT_SIDE_SCORE_2_MIN = 600
/** Below this short side → score 2; at or above → score 3. */
const SHORT_SIDE_SCORE_3_MIN = 1200

/** 0 = no `pictures`; 1 = low / no usable file; 2–3 = resolution bands. */
type PictureQualityScore = 0 | 1 | 2 | 3

type JsonBeach = {
  code: string
  pictures?: Array<string>
  pictureQualityScore?: PictureQualityScore
  [key: string]: unknown
}

type ReportRow = {
  code: string
  pictureQualityScore: PictureQualityScore
  previousPictureQualityScore: number | undefined
  bestShortSide: number | null
  readableRasterCount: number
}

function parseArgs(): { dryRun: boolean; jsonOut: string | undefined } {
  const argv = process.argv.filter((a) => a !== "--")
  const dryRun = argv.includes("--dry-run")
  const j = argv.indexOf("--json-out")
  const jsonOut =
    j !== -1 && argv[j + 1] && !argv[j + 1].startsWith("-")
      ? resolve(argv[j + 1])
      : undefined
  return { dryRun, jsonOut }
}

function bestShortSideForBeach(beach: JsonBeach): {
  best: number | null
  readableRasterCount: number
} {
  const pics = beach.pictures
  if (!pics?.length) return { best: null, readableRasterCount: 0 }

  let best: number | null = null
  let readableRasterCount = 0

  for (const name of pics) {
    if (name.toLowerCase().endsWith(".svg")) continue
    const filePath = join(PUBLIC_PICTURES, name)
    if (!existsSync(filePath)) continue
    try {
      const buf = readFileSync(filePath)
      const dim = imageSize(buf)
      if (!dim.width || !dim.height) continue
      if (dim.type === "svg") continue
      const shortSide = Math.min(dim.width, dim.height)
      readableRasterCount++
      if (best === null || shortSide > best) best = shortSide
    } catch {
      // unreadable or unsupported
    }
  }

  return { best, readableRasterCount }
}

function scoreFromReadableRasters(
  best: number | null,
  readableRasterCount: number,
): PictureQualityScore {
  if (readableRasterCount === 0) return 1
  if (best === null) return 1
  if (best < SHORT_SIDE_SCORE_2_MIN) return 1
  if (best < SHORT_SIDE_SCORE_3_MIN) return 2
  return 3
}

function pictureQualityScoreForBeach(beach: JsonBeach): PictureQualityScore {
  const pics = beach.pictures
  if (!pics?.length) return 0
  const { best, readableRasterCount } = bestShortSideForBeach(beach)
  return scoreFromReadableRasters(best, readableRasterCount)
}

function main(): void {
  const { dryRun, jsonOut } = parseArgs()

  const raw = readFileSync(BEACHES_PATH, "utf-8")
  const beaches = JSON.parse(raw) as Array<JsonBeach>

  const report: Array<ReportRow> = []
  const counts: Record<PictureQualityScore, number> = { 0: 0, 1: 0, 2: 0, 3: 0 }
  let changed = 0

  for (const beach of beaches) {
    const { best, readableRasterCount } = bestShortSideForBeach(beach)
    const score = pictureQualityScoreForBeach(beach)
    const prev = beach.pictureQualityScore
    if (prev !== score) changed++
    counts[score]++

    report.push({
      code: beach.code,
      pictureQualityScore: score,
      previousPictureQualityScore: prev,
      bestShortSide: best,
      readableRasterCount,
    })

    beach.pictureQualityScore = score
  }

  console.log(
    `0 = no pictures; 1 = listed files but none usable or shortSide < ${SHORT_SIDE_SCORE_2_MIN}; 2 = shortSide < ${SHORT_SIDE_SCORE_3_MIN}; 3 = otherwise.`,
  )
  console.log(
    `Scores: 0=${counts[0]}, 1=${counts[1]}, 2=${counts[2]}, 3=${counts[3]}`,
  )
  console.log(`Beaches with score change vs previous JSON: ${changed}`)

  if (jsonOut) {
    writeFileSync(jsonOut, JSON.stringify(report, null, 2) + "\n", "utf-8")
    console.log(`Wrote report: ${jsonOut}`)
  }

  if (dryRun) {
    console.log("Dry run: not writing beaches.json")
    return
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2) + "\n", "utf-8")
  console.log(`Updated ${BEACHES_PATH}`)
}

main()
