import { existsSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { imageSize } from "image-size"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const BEACHES_PATH = join(ROOT, "data", "beaches.json")
const PUBLIC_PICTURES = join(ROOT, "public", "pictures")

/** Keep in sync with SHORT_SIDE_SCORE_2_MIN in score-beach-picture-quality.ts */
const MIN_SHORT_SIDE = 600

/** Never delete these from disk (used by the app outside JSON). */
const PROTECTED_FILES = new Set(["default-beach.svg", "default-beach.png"])

type JsonBeach = {
  code: string
  pictures?: Array<string>
  [key: string]: unknown
}

function parseArgs(): { dryRun: boolean; deleteFiles: boolean } {
  const argv = process.argv.filter((a) => a !== "--")
  return {
    dryRun: argv.includes("--dry-run"),
    deleteFiles: argv.includes("--delete-files"),
  }
}

function rasterShortSide(filePath: string): number | null {
  try {
    const buf = readFileSync(filePath)
    const dim = imageSize(buf)
    if (!dim.width || !dim.height) return null
    if (dim.type === "svg") return null
    return Math.min(dim.width, dim.height)
  } catch {
    return null
  }
}

/** Keep filename if it should remain in the gallery list. */
function keepPicture(filename: string): { keep: boolean; reason: string } {
  if (filename.toLowerCase().endsWith(".svg")) {
    return { keep: true, reason: "svg" }
  }
  const filePath = join(PUBLIC_PICTURES, filename)
  if (!existsSync(filePath)) {
    return { keep: false, reason: "missing" }
  }
  const shortSide = rasterShortSide(filePath)
  if (shortSide === null) {
    return { keep: false, reason: "unreadable" }
  }
  if (shortSide < MIN_SHORT_SIDE) {
    return { keep: false, reason: `shortSide=${shortSide}` }
  }
  return { keep: true, reason: `shortSide=${shortSide}` }
}

function collectReferenced(beaches: Array<JsonBeach>): Set<string> {
  const set = new Set<string>()
  for (const b of beaches) {
    for (const p of b.pictures ?? []) set.add(p)
  }
  return set
}

function main(): void {
  const { dryRun, deleteFiles } = parseArgs()

  const raw = readFileSync(BEACHES_PATH, "utf-8")
  const beaches = JSON.parse(raw) as Array<JsonBeach>

  const beforeRef = collectReferenced(beaches)
  const removals: Array<{ code: string; removed: string; reason: string }> = []

  for (const beach of beaches) {
    const pics = beach.pictures
    if (!pics?.length) continue

    const next: Array<string> = []
    for (const name of pics) {
      const { keep, reason } = keepPicture(name)
      if (keep) next.push(name)
      else removals.push({ code: beach.code, removed: name, reason })
    }
    beach.pictures = next
  }

  const afterRef = collectReferenced(beaches)
  const unreferenced = [...beforeRef].filter((f) => !afterRef.has(f))

  console.log(
    `Min short side (width/height): ${MIN_SHORT_SIDE}px — same rule as picture quality score ≥2.`,
  )
  console.log(`Removed ${removals.length} picture reference(s) across beaches.`)
  if (removals.length <= 40) {
    for (const r of removals) {
      console.log(`  ${r.code}  − ${r.removed}  (${r.reason})`)
    }
  } else {
    for (const r of removals.slice(0, 20)) {
      console.log(`  ${r.code}  − ${r.removed}  (${r.reason})`)
    }
    console.log(`  … and ${removals.length - 20} more`)
  }

  console.log(`Files no longer referenced by any beach: ${unreferenced.length}`)

  if (dryRun) {
    console.log("Dry run: not writing beaches.json or deleting files.")
    return
  }

  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2) + "\n", "utf-8")
  console.log(`Updated ${BEACHES_PATH}`)

  if (deleteFiles) {
    let deleted = 0
    for (const name of unreferenced) {
      if (PROTECTED_FILES.has(name)) continue
      if (name.toLowerCase().endsWith(".svg")) continue
      const filePath = join(PUBLIC_PICTURES, name)
      if (existsSync(filePath)) {
        unlinkSync(filePath)
        deleted++
        console.log(`Deleted ${filePath}`)
      }
    }
    console.log(`Deleted ${deleted} file(s) from public/pictures.`)
  } else {
    console.log(
      "Omit --delete-files: raster files remain on disk (only JSON references were pruned).",
    )
  }

  console.log("Run: pnpm score:picture-quality && pnpm tsx scripts/migrate-to-database.ts")
}

main()
