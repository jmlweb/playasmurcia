---
id: RPT-081
title: Full site review 2026-11-09: findings fixed and open
type: finding
severity: medium
status: triaged
created: 2026-11-09
triaged: 2026-11-09
task-id: TSK-192
---

## Summary

Full review of www.playasmurcia.com on 2026-11-09: production screenshots (desktop and mobile, Playwright), Lighthouse on the home and a beach page (accessibility 100 / 97, best practices 100, SEO 100), a fresh-context security review of the Worker entry and server functions, and a fresh-context correctness review of the data layer and live-conditions code. Baseline `pnpm check`, `pnpm test` and `pnpm build` were green. No critical defect. Eleven defects were fixed in the same session; six larger ones are open as tasks.

## Fixed in this session

1. **Cards and the length sort used the OSM length while the beach page showed ITREM.** Cala Cortina read 410 m on its card and 210 m on its page; sorting by length ranked Cala Canalicas (ITREM 30 m) above Playa del Estacio (ITREM 2900 m). `mapBeachFromDB` now sets `Beach.length` through `getDisplayLength`. Regression test: `src/lib/db-data/beach-mapper.test.ts`.
2. **Mar Menor water temperature came from the open-sea model.** The Open-Meteo marine API snaps lagoon points (37.72, -0.82) to the Mediterranean cell (37.625, -0.79). Lagoon beaches now show only the AEMET water temperature, or none (`src/lib/beach-forecast.ts`).
3. **Open-Meteo-only beaches could label yesterday as today** between 00:00 and 01:00 Madrid, because only AEMET days went through `dropPastDays` and the forecast is cached for an hour. 67 beaches have no `aemetId`. Open-Meteo days are now filtered too.
4. **Sitemap omitted `/colecciones/mar-menor` and `/colecciones/mar-mediterraneo`.** `scripts/generate-sitemap.ts` now maps `allCollections` (219 URLs, was 217).
5. **Beach markdown was edge-cached for an hour when one live source failed.** Only the all-empty case set `no-store`; a partial answer now does too (`src/lib/beach-conditions-markdown.ts`).
6. **Nearby-beach links hid their visible text from assistive tech** (`aria-label="Ver playa …"` dropped the distance; Lighthouse `label-content-name-mismatch`). The label is gone and the thumbnail is decorative.
7. **Water-quality source link was distinguishable by colour only** (1.12:1 against the surrounding text; Lighthouse `link-in-text-block`). It is now underlined.
8. **Explorer municipality filter was in database order** (Cartagena, Lorca, Águilas…), against the 2026-11-07 decision to list municipalities alphabetically.
9. **Unbounded text inputs on uncached server functions**: `beachName` / `municipalityName` in `use-beach-status.ts` and the WebMCP text fields are capped at 200 characters.
10. Explorer meta description fallback said 194 beaches (193).
11. `docs/business-rules.md` now records that `Beach.length` is the display length.

## Open

1. **65 beach descriptions quote the OSM length in prose** and now contradict the ITREM figure shown beside them (Cala Abierta: "Son 173 metros" next to "Longitud 80 m (ITREM)"). Hand-edited copy; some sentences build on the number, so it needs an editorial pass, not a search-and-replace.
2. **Activities data is not discriminating**: Natación 193/193, Kayak 193/193, Snorkel 189/193, Pesca 167/193. The "Actividades" block is the same on nearly every beach page and the Snorkel and Pesca filters remove almost nothing.
3. **55 of 193 beaches (28%) have no photo.** TSK-142 moved the count by two. On Cartagena's listing most of the lower half is placeholder cards.
4. **HTML cache key includes the raw query string** (`src/lib/html-cache.ts`): `/municipios?x=<random>` always misses, renders and stores a new entry (0.4–0.5 s against 0.06–0.09 s on a hit, measured on production). 404s are never cached. Unknown parameters such as `fbclid` also miss.
5. **Card-weather batch cache is keyed by the caller's set of codes** (`src/lib/open-meteo.ts`, `fetchBatchCardWeather`): distinct subsets of real codes each cost upstream Open-Meteo calls, which can exhaust the free quota for every visitor.
6. **Municipality pages render every beach on one page**: Cartagena is 69 cards and about 31,000 CSS px tall on a phone.

## Checked and clean

Security headers and CSP, markdown negotiation and `Vary`, SSRF surface, secrets, CI workflow, canonical URLs, JSON-LD, certification seasons, sun times, forecast merge, explorer search validation, collections indices, slug uniqueness, 112 flag matching (beyond RPT-056 and RPT-070). HTTP to HTTPS and apex to www redirect correctly.

## Not filed

A transient upstream 5xx is negatively cached for 30 minutes (AEMET) or 60 minutes (Open-Meteo); a calm day with a null dominant wind direction reads "N"; listing pages have no `og:title` (crawlers fall back to `<title>`).
