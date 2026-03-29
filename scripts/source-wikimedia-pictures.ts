/**
 * Semi-automated workflow to source beach pictures from multiple open sources.
 *
 * Sources:
 *   1. Wikimedia Commons text search (beach name + municipality)
 *   2. Wikimedia Commons geosearch (coordinates within 500m radius)
 *   3. Flickr CC-licensed photos (text + geo search)
 *
 * Phase 1 (--search): Searches all sources, downloads candidate images to
 *   data/source/wikimedia-candidates/<beachCode>/ and writes a manifest.
 *
 * Phase 2 (--review): Interactive CLI to review candidates per beach.
 *   User picks images, they're copied to public/pictures/ and added to beaches.json.
 *
 * Usage:
 *   pnpm tsx scripts/source-wikimedia-pictures.ts --search
 *   pnpm tsx scripts/source-wikimedia-pictures.ts --review
 *   pnpm tsx scripts/source-wikimedia-pictures.ts --search --review
 */

import { createInterface } from "node:readline"
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"

const ROOT = resolve(import.meta.dirname, "..")
const BEACHES_PATH = join(ROOT, "data", "beaches.json")
const MUNICIPALITIES_PATH = join(ROOT, "data", "municipalities.json")
const CANDIDATES_DIR = join(ROOT, "data", "source", "wikimedia-candidates")
const MANIFEST_PATH = join(CANDIDATES_DIR, "manifest.json")
const PUBLIC_PICTURES = join(ROOT, "public", "pictures")

const UA =
  "PlayasMurcia-ImageBot/1.0 (https://www.playasmurcia.com; contact@playasmurcia.com)"
const CONCURRENCY = 3
const FETCH_TIMEOUT_MS = 30_000
const MAX_RESULTS_PER_BEACH = 8
const MIN_IMAGE_SIZE = 2048 // bytes
const GEO_RADIUS_METERS = 2000 // 2km — many beaches are small coves with photos tagged nearby

const COMMONS_API = "https://commons.wikimedia.org/w/api.php"
// Wikimedia category names for beach photos by municipality
const WM_BEACH_CATEGORIES: Record<string, Array<string>> = {
  Cartagena: ["Beaches_of_Cartagena,_Spain", "Costa_de_Cartagena"],
  Lorca: ["Beaches_of_Lorca"],
  "Águilas": ["Beaches_of_Águilas", "Águilas"],
  "Mazarrón": ["Beaches_of_Mazarrón", "Mazarrón"],
  "San Javier": ["Beaches_of_San_Javier", "La_Manga_del_Mar_Menor"],
  "La Manga": ["La_Manga_del_Mar_Menor"],
  "Los Alcázares": ["Los_Alcázares"],
  "San Pedro del Pinatar": ["San_Pedro_del_Pinatar"],
  "La Unión": ["La_Unión,_Spain"],
}

const ACCEPTED_LICENSES_WM = new Set([
  "cc-by-sa-4.0", "cc-by-sa-3.0", "cc-by-sa-2.5", "cc-by-sa-2.0",
  "cc-by-4.0", "cc-by-3.0", "cc-by-2.5", "cc-by-2.0",
  "cc-zero", "pd", "public domain",
])

type Beach = {
  code: string
  name: string
  municipality: number
  coordinates: [number, number]
  pictures?: Array<string>
  pictureQualityScore?: number
  [key: string]: unknown
}

type Municipality = { name: string; id: string }

type Candidate = {
  beachCode: string
  source: "wikimedia" | "wm-category" | "wm-geo"
  title: string
  license: string
  url: string
  width: number
  height: number
  descriptionUrl: string
  filename: string
}

type Manifest = {
  searchedAt: string
  candidates: Record<string, Array<Candidate>>
}

// ─── Shared helpers ──────────────────────────────────────────────────

async function fetchJson(url: string): Promise<unknown> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}

async function downloadImage(url: string, dest: string): Promise<"ok" | "skip"> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "image/*,*/*;q=0.8" },
    })
    clearTimeout(timer)
    const ct = (res.headers.get("content-type") ?? "").toLowerCase()
    if (!res.ok || !ct.includes("image")) return "skip"
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < MIN_IMAGE_SIZE) return "skip"
    await writeFile(dest, buf)
    return "ok"
  } catch {
    clearTimeout(timer)
    return "skip"
  }
}

// ─── Wikimedia Commons ───────────────────────────────────────────────

async function wmTextSearch(query: string): Promise<Array<string>> {
  const params = new URLSearchParams({
    action: "query", format: "json", list: "search",
    srnamespace: "6", srsearch: `${query} filetype:bitmap`,
    srlimit: "10",
  })
  const data = (await fetchJson(`${COMMONS_API}?${params}`)) as {
    query?: { search?: Array<{ title: string }> }
  }
  return data.query?.search?.map((r) => r.title) ?? []
}

async function wmGeoSearch(lat: number, lon: number, radius: number): Promise<Array<string>> {
  const params = new URLSearchParams({
    action: "query", format: "json", list: "geosearch",
    gsnamespace: "6", // File namespace
    gscoord: `${lat}|${lon}`,
    gsradius: String(radius),
    gslimit: "20",
  })
  const data = (await fetchJson(`${COMMONS_API}?${params}`)) as {
    query?: { geosearch?: Array<{ title: string }> }
  }
  return data.query?.geosearch?.map((r) => r.title) ?? []
}

async function wmGetImageInfo(titles: Array<string>): Promise<Array<Candidate | null>> {
  if (titles.length === 0) return []
  // API limit: 50 titles per request
  const batch = titles.slice(0, 50)
  const params = new URLSearchParams({
    action: "query", format: "json",
    titles: batch.join("|"),
    prop: "imageinfo",
    iiprop: "url|size|extmetadata",
    iiurlwidth: "1200",
  })
  const data = (await fetchJson(`${COMMONS_API}?${params}`)) as {
    query?: { pages?: Record<string, unknown> }
  }
  const pages = data.query?.pages ?? {}

  return Object.values(pages).map((page: unknown) => {
    const p = page as {
      title?: string
      imageinfo?: Array<{
        url?: string; thumburl?: string
        width?: number; height?: number
        descriptionurl?: string
        extmetadata?: { LicenseShortName?: { value?: string } }
      }>
    }
    const info = p.imageinfo?.[0]
    if (!info?.url || !info.width || !info.height) return null
    // Skip tiny images
    if (info.width < 400 && info.height < 400) return null

    const license = (info.extmetadata?.LicenseShortName?.value ?? "").toLowerCase()
    const isAccepted = [...ACCEPTED_LICENSES_WM].some(
      (l) => license.includes(l) || l.includes(license),
    )
    if (!isAccepted && license !== "") return null

    return {
      beachCode: "", source: "wikimedia" as const,
      title: p.title ?? "", license,
      url: info.thumburl ?? info.url,
      width: info.width, height: info.height,
      descriptionUrl: info.descriptionurl ?? "",
      filename: "",
    }
  })
}

// ─── Wikimedia Category Search ───────────────────────────────────────

async function wmCategoryMembers(category: string): Promise<Array<string>> {
  const params = new URLSearchParams({
    action: "query", format: "json",
    list: "categorymembers",
    cmtitle: `Category:${category}`,
    cmtype: "file",
    cmlimit: "50",
  })
  const data = (await fetchJson(`${COMMONS_API}?${params}`)) as {
    query?: { categorymembers?: Array<{ title: string }> }
  }
  return data.query?.categorymembers?.map((m) => m.title) ?? []
}

// ─── Phase 1: Search ─────────────────────────────────────────────────

async function runSearch(): Promise<void> {
  const beaches = JSON.parse(await readFile(BEACHES_PATH, "utf-8")) as Array<Beach>
  const municipalities = JSON.parse(await readFile(MUNICIPALITIES_PATH, "utf-8")) as Array<Municipality>
  const missing = beaches.filter((b) => !b.pictures || b.pictures.length === 0)
  console.log(`Found ${missing.length} beaches without pictures`)

  await mkdir(CANDIDATES_DIR, { recursive: true })

  let manifest: Manifest
  try {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"))
    const existing = Object.values(manifest.candidates).filter((c) => c.length > 0).length
    console.log(`Loaded manifest: ${existing} beaches already have candidates`)
  } catch {
    manifest = { searchedAt: "", candidates: {} }
  }

  let searched = 0
  let totalCandidates = 0

  const tasks = missing.map((beach) => async () => {
    // Skip if already has candidates from previous run
    if (manifest.candidates[beach.code]?.length) {
      searched++
      return
    }

    const muniName = municipalities[beach.municipality]?.name ?? ""
    const [lat, lon] = beach.coordinates
    const beachDir = join(CANDIDATES_DIR, beach.code)
    await mkdir(beachDir, { recursive: true })

    const allCandidates: Array<Candidate> = []
    const seenUrls = new Set<string>()

    function addCandidates(candidates: Array<Candidate | null>) {
      for (const c of candidates) {
        if (!c || seenUrls.has(c.url) || allCandidates.length >= MAX_RESULTS_PER_BEACH) continue
        seenUrls.add(c.url)
        allCandidates.push(c)
      }
    }

    // 1) Wikimedia geosearch — photos taken at/near this location (best signal)
    try {
      const geoTitles = await wmGeoSearch(lat, lon, GEO_RADIUS_METERS)
      if (geoTitles.length > 0) {
        const infos = await wmGetImageInfo(geoTitles)
        addCandidates(infos.map((c) => c ? { ...c, source: "wm-geo" as const } : null))
      }
    } catch { /* ignore */ }

    // 2) Wikimedia text search
    const queries = [
      `${beach.name} ${muniName} Murcia`,
      `playa ${beach.name} Murcia`,
      `${beach.name} beach ${muniName}`,
    ]
    for (const q of queries) {
      if (allCandidates.length >= MAX_RESULTS_PER_BEACH) break
      try {
        const titles = await wmTextSearch(q)
        if (titles.length > 0) {
          const infos = await wmGetImageInfo(titles)
          addCandidates(infos)
        }
      } catch { /* ignore */ }
    }

    // 3) Wikimedia category search — browse municipality categories
    if (allCandidates.length < MAX_RESULTS_PER_BEACH) {
      const categories = WM_BEACH_CATEGORIES[muniName] ?? []
      for (const cat of categories) {
        if (allCandidates.length >= MAX_RESULTS_PER_BEACH) break
        try {
          const catTitles = await wmCategoryMembers(cat)
          if (catTitles.length > 0) {
            // Filter titles that might match this beach name
            const beachWords = beach.name.toLowerCase().split(/\s+/)
            const relevant = catTitles.filter((t) => {
              const tl = t.toLowerCase()
              return beachWords.some((w) => w.length > 3 && tl.includes(w))
            })
            if (relevant.length > 0) {
              const infos = await wmGetImageInfo(relevant.slice(0, 10))
              addCandidates(infos.map((c) => c ? { ...c, source: "wm-category" as const } : null))
            }
          }
        } catch { /* ignore */ }
      }
    }

    // Download candidates
    const downloaded: Array<Candidate> = []
    for (let idx = 0; idx < allCandidates.length; idx++) {
      const c = allCandidates[idx]
      const ext = c.url.match(/\.(jpe?g|png|webp)(?:[?#]|$)/i)?.[1]?.toLowerCase() ?? "jpg"
      const filename = `${c.source}-${beach.code}-${idx + 1}.${ext}`
      const destPath = join(beachDir, filename)

      const result = await downloadImage(c.url, destPath)
      if (result === "ok") {
        downloaded.push({ ...c, beachCode: beach.code, filename })
      }
    }

    manifest.candidates[beach.code] = downloaded
    totalCandidates += downloaded.length
    searched++

    const icon = downloaded.length > 0 ? "✓" : "✗"
    const sources = [...new Set(downloaded.map((c) => c.source))].join("+") || "-"
    console.log(`  ${icon} ${beach.name} (${muniName}) — ${downloaded.length} [${sources}]`)

    // Periodic save
    if (searched % 10 === 0) {
      manifest.searchedAt = new Date().toISOString()
      await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n")
    }
  })

  // Run with concurrency limit
  let i = 0
  async function worker() {
    for (;;) {
      const j = i++
      if (j >= tasks.length) break
      await tasks[j]()
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  manifest.searchedAt = new Date().toISOString()
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n")

  const withCandidates = Object.values(manifest.candidates).filter((c) => c.length > 0).length
  const withoutCandidates = Object.values(manifest.candidates).filter((c) => c.length === 0).length
  console.log(`\nSearch complete:`)
  console.log(`  Beaches searched: ${searched}`)
  console.log(`  Total candidates: ${totalCandidates}`)
  console.log(`  With candidates: ${withCandidates}`)
  console.log(`  No results: ${withoutCandidates}`)
}

// ─── Phase 2: Review ─────────────────────────────────────────────────

async function runReview(): Promise<void> {
  const beaches = JSON.parse(await readFile(BEACHES_PATH, "utf-8")) as Array<Beach>
  const municipalities = JSON.parse(await readFile(MUNICIPALITIES_PATH, "utf-8")) as Array<Municipality>

  let manifest: Manifest
  try {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"))
  } catch {
    console.error("No manifest found. Run --search first.")
    process.exit(1)
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q: string): Promise<string> =>
    new Promise((res) => rl.question(q, res))

  const missing = beaches.filter((b) => !b.pictures || b.pictures.length === 0)

  let approved = 0
  let skipped = 0
  let reviewed = 0

  console.log(`\n═══ Beach Picture Review ═══`)
  console.log(`${missing.length} beaches without pictures\n`)

  for (const beach of missing) {
    const candidates = manifest.candidates[beach.code]
    if (!candidates || candidates.length === 0) {
      skipped++
      continue
    }

    const muniName = municipalities[beach.municipality]?.name ?? ""
    reviewed++

    console.log(`\n─── ${beach.name} (${muniName}) [${beach.code}] ───`)
    console.log(`    ${candidates.length} candidate(s):\n`)

    for (let i = 0; i < candidates.length; i++) {
      const c = candidates[i]
      const filePath = join(CANDIDATES_DIR, beach.code, c.filename)
      let fileSize = "?"
      try {
        const s = await stat(filePath)
        fileSize = `${Math.round(s.size / 1024)}KB`
      } catch {
        fileSize = "missing"
      }
      console.log(`    [${i + 1}] ${c.filename}`)
      console.log(`        ${c.width}x${c.height}  ${fileSize}  ${c.source}  License: ${c.license}`)
      console.log(`        ${c.descriptionUrl}`)
    }

    const answer = await ask(
      `\n    Pick (1-${candidates.length}), [s]kip, [q]uit: `,
    )

    if (answer.toLowerCase() === "q") {
      console.log("\nQuitting review.")
      break
    }
    if (answer.toLowerCase() === "s" || answer.trim() === "") {
      console.log("    → Skipped")
      skipped++
      continue
    }

    const pick = parseInt(answer, 10)
    if (isNaN(pick) || pick < 1 || pick > candidates.length) {
      console.log("    → Invalid, skipping")
      skipped++
      continue
    }

    const chosen = candidates[pick - 1]
    const srcPath = join(CANDIDATES_DIR, beach.code, chosen.filename)
    const ext = chosen.filename.match(/\.(jpe?g|png|webp)$/i)?.[0] ?? ".jpg"
    const destFilename = `${chosen.source}-${beach.code}${ext}`
    const destPath = join(PUBLIC_PICTURES, destFilename)

    try {
      await copyFile(srcPath, destPath)
      if (!beach.pictures) beach.pictures = []
      beach.pictures.push(destFilename)
      console.log(`    ✓ Added ${destFilename}`)
      approved++
    } catch (e) {
      console.error(`    ✗ Error: ${e}`)
      skipped++
    }
  }

  rl.close()

  if (approved > 0) {
    await writeFile(BEACHES_PATH, JSON.stringify(beaches, null, 2) + "\n")
    console.log(`\nSaved beaches.json with ${approved} new pictures`)
  }

  console.log(`\n═══ Review Summary ═══`)
  console.log(`  Reviewed: ${reviewed}`)
  console.log(`  Approved: ${approved}`)
  console.log(`  Skipped:  ${skipped}`)
  console.log(`  Remaining: ${missing.length - approved} without pictures`)

  if (approved > 0) {
    console.log(`\nNext steps:`)
    console.log(`  1. pnpm optimize:images        # Generate WebP variants`)
    console.log(`  2. pnpm score:picture-quality   # Update quality scores`)
  }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const doSearch = args.includes("--search")
  const doReview = args.includes("--review")

  if (!doSearch && !doReview) {
    console.log("Usage:")
    console.log("  pnpm tsx scripts/source-wikimedia-pictures.ts --search")
    console.log("  pnpm tsx scripts/source-wikimedia-pictures.ts --review")
    console.log("  pnpm tsx scripts/source-wikimedia-pictures.ts --search --review")
    process.exit(0)
  }

  if (doSearch) {
    console.log("═══ Phase 1: Multi-Source Search ═══\n")
    await runSearch()
  }
  if (doReview) {
    await runReview()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
