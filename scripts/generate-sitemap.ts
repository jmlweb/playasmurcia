import { writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { beachToSlug, getAllBeaches } from "../src/lib/db-data"

const BASE_URL = "https://www.playasmurcia.com"

async function generateSitemap() {
  const beaches = await getAllBeaches()
  const today = new Date().toISOString().split("T")[0]

  const urls = [
    `  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...beaches.map(
      (beach) => `  <url>
    <loc>${BASE_URL}/playas/${beachToSlug(beach)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`

  const outputPath = resolve(import.meta.dirname, "../public/sitemap.xml")
  writeFileSync(outputPath, xml, "utf-8")

  console.log(`Sitemap generated with ${urls.length} URLs → public/sitemap.xml`)
}

generateSitemap()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to generate sitemap:", err)
    process.exit(1)
  })
