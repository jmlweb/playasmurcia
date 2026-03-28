import { mkdir, stat, writeFile } from "node:fs/promises"
import { basename, resolve } from "node:path"

const NEXO_JSON =
  "https://nexo.carm.es/nexo/archivos/recursos/opendata/json/Playas.json"

/** Staging area for raw downloads — not served by Vite (see `public/pictures/` for site assets). */
const OUTPUT_DIR = resolve(process.cwd(), "data/source/playas-nexo-images")
const PUBLIC_PICTURES = resolve(process.cwd(), "public/pictures")

const UA =
  "Mozilla/5.0 (compatible; playasmurcia-image-sync/1.0; +https://www.playasmurcia.com)"
const CONCURRENCY = 12
const FETCH_TIMEOUT_MS = 45_000

function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

function collectFotoUrls(record: Record<string, unknown>): Array<string> {
  const out: Array<string> = []
  for (const key of Object.keys(record)) {
    if (!/^Foto\s*\d+$/i.test(key)) continue
    const v = record[key]
    if (v == null) continue
    const s = String(v).trim()
    if (s) out.push(s)
  }
  return out
}

function safeFileNameFromUrl(url: string): string {
  const u = new URL(url)
  const name = basename(decodeURIComponent(u.pathname))
  if (!name || name === "/" || name.includes("..")) {
    throw new Error(`Unsafe or empty filename for URL: ${url}`)
  }
  return name
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function downloadOne(url: string, dest: string): Promise<"ok" | "skip_bad"> {
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
    if (!res.ok || !ct.includes("image")) {
      return "skip_bad"
    }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 512) return "skip_bad"
    await writeFile(dest, buf)
    return "ok"
  } catch {
    clearTimeout(timer)
    return "skip_bad"
  }
}

async function main() {
  const raw = stripBom(await fetch(NEXO_JSON).then((r) => r.text()))
  const rows = JSON.parse(raw) as Array<Record<string, unknown>>
  const urls = [...new Set(rows.flatMap((r) => collectFotoUrls(r)))]

  await mkdir(OUTPUT_DIR, { recursive: true })

  let skippedPublic = 0
  let skippedOutput = 0
  let downloaded = 0
  let failed = 0

  const tasks = urls.map((url) => async () => {
    let name: string
    try {
      name = safeFileNameFromUrl(url)
    } catch {
      failed++
      return
    }
    const outPath = resolve(OUTPUT_DIR, name)
    const pubPath = resolve(PUBLIC_PICTURES, name)

    if (await fileExists(pubPath)) {
      skippedPublic++
      return
    }
    if (await fileExists(outPath)) {
      skippedOutput++
      return
    }

    const r = await downloadOne(url, outPath)
    if (r === "ok") downloaded++
    else failed++
  })

  let i = 0
  async function worker() {
    for (;;) {
      const j = i++
      if (j >= tasks.length) break
      await tasks[j]()
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  console.log(
    JSON.stringify(
      {
        totalUrls: urls.length,
        outputDir: OUTPUT_DIR,
        downloaded,
        skippedAlreadyInPublic: skippedPublic,
        skippedAlreadyInOutput: skippedOutput,
        failedOrNotImage: failed,
      },
      null,
      2,
    ),
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
