# Business Rules

This document describes the business logic and data processing rules for the project.

## Scripts Reference

Scripts that exist in `scripts/` and require periodic execution:

| Script                   | Purpose                                                                   | Frequency                            |
| ------------------------ | ------------------------------------------------------------------------- | ------------------------------------ |
| `add-certifications.js`  | Update Blue Flag, Q Quality, Ecoplayas certifications                     | Annual (spring)                      |
| `add-lifeguard-info.js`  | Update COPLA lifeguard data                                               | Seasonal (pre-summer)                |
| `add-water-quality.ts`   | Assign water quality ratings (heuristic from certifications + location)   | Annual (after certification update)  |
| `validate-beaches.js`    | Validate all beach data integrity                                         | Before releases                      |
| `migrate-to-database.ts` | Migrate JSON data to SQLite/Turso                                         | Once (or after JSON changes)         |
| `validate-migration.ts`  | Validate database matches JSON source                                     | After migration                      |
| `sync-pictures-to-r2.sh` | Mirror `public/pictures/` to the R2 bucket serving `img.playasmurcia.com` | After picture changes, before deploy |

## Slugs

Beach and municipality slugs come from `nameToSlug` in `src/lib/slugs.ts`: lowercase, accents removed, parentheses and periods dropped, whitespace collapsed to `-`. Beach slugs must stay unique (covered by `src/lib/slugs.test.ts`).

Renaming a beach, or changing the slug rules, changes its URL. Names containing `(` `)` or `.` used to produce slugs with those characters; `/playas/$slug` 301-redirects those retired slugs to the current one (`getRenamedBeachSlug`, derived from the DB at runtime, no manual list).

## Beach Orientation

Orientation was calculated based on coordinates:

| Condition                              | Orientation |
| -------------------------------------- | ----------- |
| Mar Menor (sea=1) + longitude > -0.75  | west        |
| Mar Menor (sea=1) + longitude <= -0.75 | east        |
| Mar Mediterráneo + latitude > 37.65    | southeast   |
| Mar Mediterráneo + latitude > 37.55    | east        |
| Mar Mediterráneo + latitude <= 37.55   | southeast   |

## Shore Bearing

`shoreBearing` is the compass bearing (integer degrees, 0 = north, 90 = east) that the beach faces seaward. It is a separate, finer field than `orientation`.

Derivation (one-off, the script was removed after use):

1. For each beach, fetch OpenStreetMap `natural=coastline` ways within 300 m of its coordinates from the Overpass API, widening to 1 km and then 3 km when none are found
2. OSM coastline ways run with land on the left and sea on the right, so each segment's seaward normal is its bearing + 90°
3. Average the normals of the segments within 250 m of the nearest coastline point, weighted by segment length
4. Review beaches whose bearing differs from `orientation` by more than 90° or whose nearest coastline is more than 300 m away, and fix them by hand

New beaches need a hand-set `shoreBearing`; `node scripts/validate-beaches.js` fails without one.

## Weather: AEMET and Open-Meteo

v3 uses **two** weather sources:

1. **AEMET** — official beach forecast where the beach has `aemetId` (detail page widget).
2. **Open-Meteo** — latitude/longitude-based current conditions and forecasts where AEMET is not used or to supplement list cards and non-AEMET beaches.

So weather is **not** limited to beaches with `aemetId`; those codes only gate the **AEMET** widget.

### AEMET: ID assignment

- Source: https://www.aemet.es/documentos/es/eltiempo/prediccion/playas/Playas_codigos.csv
- Format: 7-digit code starting with "30" (Murcia province)
- Coverage: subset of beaches (~65) — AEMET only publishes stations for major beaches
- A beach only gets an `aemetId` when the nearest AEMET point is within 2.37 km; otherwise the widget falls back to coordinates (Open-Meteo)
- Decision (TSK-124): 585 Playa de Las Salinas (Los Alcázares) keeps no `aemetId`. Its nearest point, Punta Calera (3090202), is 2.4 km away, just over the cutoff, and a forecast point that far away would not describe this beach better than coordinate-based data
- Known mismatch (TSK-124): 561 Playa El Arenal coordinates (37.7133, -0.7399) match its stated Gran Vía km 7.9-10 range, while AEMET's "El Arenal" point (3003526) sits at 37.6922, -0.7361, 2.4 km south around km 6.5-7. The beach coordinates are kept and the AEMET point is treated as the offset one

### Same-name beaches

- 627 and 515 "Playa Larga" (Calblanque) had identical coordinates and access text; 515 was removed (TSK-124). Both shared the slug `playa-larga`, so the public URL is unchanged and needs no redirect. The slug is still shared with 5907 "Playa Larga" (LRN-015: slugs are not globally unique; municipality-qualified slugs are a separate follow-up)
- 633 (Mazarrón) and 6703 (Lorca) "Playa Parazuelos" are kept as distinct entries: both appear in their own municipality's official beach list, but no official source gives the border line, so merging is not supported. They share the slug `playa-parazuelos`, so only one is routable; resolve this by renaming one once a source settles the border

### AEMET: API usage

- Endpoint: `GET /api/prediccion/especifica/playa/{aemetId}`
- Data: Temperature, wind, wave height, UV index
- Caching: short TTL via `src/lib/edge-cache.ts` in production (see architecture)

### Open-Meteo

- Used for coordinate-based current weather (e.g. beach cards) and detail when AEMET is unavailable
- Cached like other external HTTP calls at the edge where configured
- Card weather (temperature, icon, wind) is requested in chunks of 50 unique coordinates, each with a 2 s timeout. A failed or timed-out chunk is skipped, and a partial result is not cached
- Listings never wait for weather or flags: the client loads both after mount (`useCardWeather`, `useCardFlags`) and cards render without them until they arrive
- Card flags come from one cached 112 COPLA fetch; stale entries (older than 2 days) and "SIN BANDERA" are not shown

### Waves (oleaje)

- The Open-Meteo Marine call used for sea temperature also requests `wave_height`, `wave_direction`, `wave_period`, `wind_wave_height` and `swell_wave_height` (current values, same 1 h edge cache). Wave fields are optional on the cached entry so entries written before they were added still render
- The detail weather widget shows an "Oleaje" row with the significant wave height (one decimal, metres), the wave direction and a level from `src/lib/wave-level.ts`: `bajo` below 0.5 m, `moderado` from 0.5 m to 1.25 m, `alto` from 1.25 m (Douglas sea scale boundaries)
- When the beach has `aemetId`, the AEMET `oleaje` description for the day (`getDayWaves`, full-day period first, then morning) replaces the computed level; the Marine height is still shown
- The Marine model is a ~5 km grid and describes open water, not a sheltered cove; the shore exposure label below adjusts for that
- Shore exposure: when the beach has `shoreBearing` and the Marine response has a wave direction, the Oleaje row appends `Expuesta` or `Resguardada` from `getWaveExposure` in `src/lib/wave-exposure.ts`. Open-Meteo `wave_direction` is the direction waves come from, so a beach is `expuesta` when that direction is within 90° of `shoreBearing` (wrapping around north) and `resguardada` otherwise. The label reflects the current open-sea state only and is hidden for Mar Menor beaches (`sea=1`), which the open-sea waves do not reach

## Explorer Filters and Sorting

- Need filters (`dogFriendly`, `lifeguard`, `childSafe`, `naturalShade`, `nudist`) are boolean and live in the URL as `true`; a beach with the field missing never matches an active filter
- `accessDifficulty` (`easy` | `moderate` | `hard`) and `occupancy` (`low` | `medium` | `high`) are multi-select; beaches with no value are excluded when active
- "Cerca de mí" (`sort=cercania`) asks for browser geolocation only on click. The position stays in component state: it is never put in the URL, storage or sent to the server. Without a position the sort falls back to "Recomendados"

## Content Guidelines

### Description Field

**Guidelines:**

- 2-3 sentences, about 30-55 words, Spanish, addressed to the visitor as "tú"
- Every claim must come from the beach's data fields (`soilType`, `length`, `waves`, `sea`, `occupancyLevel`, `naturalShade`, `lifeguard`, `nudist`, `dogFriendly`, services) or from well-known local facts (protected areas, landmarks, villages)
- Lead with what sets the beach apart from its `nearby` neighbours, and add one practical tip when the data suggests it (water shoes on bolos, bring shade, arrive early)
- Don't repeat what the page already shows as badges or grids: name at most one or two services, and only when they are unexpected or decide the visit (a lifeguard at a small cala, no lifeguard on a busy beach)
- Mention waves only when they matter: Mediterranean side of La Manga vs. Mar Menor, entering the water over bolos, going with children
- Don't state a `length` that is shared by several beaches (OSM merges), Q de Calidad (list not re-verified), or name origins you can't verify
- Markdown: bold 1-2 phrases per text, only the fact that sets the beach apart. Put a practical tip in a final `**Consejo:**` paragraph, only when the data supports one; don't invent tips to fill the slot. Meta tags and JSON-LD use the stripped plain text (`stripDescriptionMarkdown` in `src/lib/description-markdown.ts`)
- Avoid AI clichés: "te espera", "disfruta", "ideal para", "rincón", "paraíso", "joya", "remanso", "aguas cristalinas", closing with "en la Región de Murcia", and listing what a beach lacks unless it matters to the visitor

### Access vs Description Separation

The `access` field ("Cómo llegar") contains only directions:

| Include in `access`                              | Include in `description` |
| ------------------------------------------------ | ------------------------ |
| Roads, exits and kilometre points                | Beach atmosphere         |
| Paths, tracks and walks from a named start point | Natural beauty           |
| Boat-only or on-foot-only access                 | Facilities summary       |
| Parking details beyond yes/no (where, how)       | Tourist recommendations  |
| Seasonal restrictions (Calblanque summer access) | Nearby attractions       |

### Access Field Guidelines

`access` is hand-edited Spanish copy, rebuilt in 2026 from the official texts in the first data import (commit `1c65381`).

- Use the official text as the only source of facts. Add a claim only when a structured field supports it (coordinates, municipality, services). Don't add bus lines, walking times or path conditions that no source states
- Don't repeat what the page already shows: difficulty (practical-info card), parking and ramps as yes/no (services grid), the map link
- Format: a short intro paragraph with the key route in `**bold**`, then an optional `- **Label:** …` list (`A pie`, `En barco`, `Aparcamiento`, `Por la AP-7`…), then an optional `**Consejo:**` paragraph for warnings. Links only to official https sites
- Use `AP-7` for the motorway, even where the official text says `A-37` or `A-7`
- When the official text contradicts the coordinates (Los Nietos, Cala del Reventón), follow the coordinates and drop the contradicting claim

## Instagram Hashtags

Generated from beach name using this pattern:

1. Remove accents (á→a, é→e, etc.)
2. Remove special characters
3. Convert to CamelCase
4. Add # prefix

Example: "Cala Abierta" → "#CalaAbierta"

## Beach Certifications

Official certifications are assigned based on annual awards:

| Certification | Source                        | Update Frequency |
| ------------- | ----------------------------- | ---------------- |
| `blue-flag`   | ADEAC/FEE (banderaazul.org)   | Annual (spring)  |
| `q-quality`   | ICTE (calidadturisticahoy.es) | Annual           |
| `ecoplayas`   | ATEGRUS                       | Annual           |

**Murcia counts:**

- Blue Flag (2026): 35 beaches — 33 awards; the joint awards "Banco del Tabal-Calnegre" and "Bahía-La Reya" each cover two beaches in the dataset
- Q de Calidad (2024 list, not re-verified for 2026): 37 beaches
- Ecoplayas: 3 beaches (Mazarrón only)

The Q de Calidad list in `scripts/add-certifications.js` is the 2024 list. The Oct 2026 audit (TSK-124) found only a press count for 2026 (50 Q flags across Murcia beaches and marinas) and no per-beach ICTE list, so the 2024 source year stays documented until one is published.

To check Blue Flag status: `beach.certifications?.includes('blue-flag')`

Script: `scripts/add-certifications.js` (run annually)

## Jellyfish Risk

Risk is assigned at sea level, not per beach:

| Sea              | Risk Level |
| ---------------- | ---------- |
| Mar Mediterráneo | low        |
| Mar Menor        | moderate   |

Stored in `seas.json`, referenced by beach via `sea` index.

## Data Enrichment Principles

### Minimize Duplication

Store shared data at the appropriate level:

- Per-sea data → `seas.json`
- Per-municipality data → `municipalities.json`
- Per-beach data → `beaches.json`

### Precompute Static Values

Calculate once and store (don't compute at runtime):

- Orientation (from coordinates)
- Instagram hashtags (from name)
- Nearby beaches (from coordinates)

## Best Season

Best visiting seasons are inferred using Ollama based on:

| Factor      | Impact                              |
| ----------- | ----------------------------------- |
| Orientation | South/southwest = more winter sun   |
| Sea         | Mar Menor = warmer in spring/autumn |
| Tags        | Sheltered calas = wind protection   |
| Services    | Urban beaches = year-round access   |

**Season distribution:**

- Most beaches: `["spring", "summer", "autumn"]`
- Sheltered south-facing: `["spring", "summer", "autumn", "winter"]`
- All beaches include summer

## Dog-Friendly Beaches

Official dog-friendly beaches are designated by municipal ordinances.

Data updated manually when municipal ordinances change. No recurring script.

The `dogFriendly` values were not re-verified against 2026 municipal ordinances (TSK-124 audit, Oct 2026): treat them as unverified until each municipality's current ordinance is checked.

## Lifeguard Service

Lifeguard data comes from the COPLA system (112 Región de Murcia).

Script: `scripts/add-lifeguard-info.js` (run seasonally)

## Occupancy Level

Typical crowd level is inferred from beach characteristics:

| Level  | Criteria                                                                                      |
| ------ | --------------------------------------------------------------------------------------------- |
| high   | Urban beaches, promenade, accessible tag, La Manga/Los Alcázares/San Pedro, 2+ certifications |
| low    | Wild/isolated/nudist tags, remote calas without lifeguard or services                         |
| medium | Everything else                                                                               |

**Distribution:** ~47% high, ~26% medium, ~26% low

Calculated once and stored in beach records. No recurring script.

The stored value describes a typical peak-summer day and drives the explorer filter, the occupancy sort and the "Playas poco masificadas" collection all year round; the beach page labels it "Ocupación en verano". Only the beach-card badge is seasonal (`seasonalOccupancy` in `src/lib/occupancy.ts`): stored value in July–August, `high` capped to `medium` in June and September, hidden the rest of the year.

## Collection Criteria

Collections are defined in `src/lib/collections.ts`. Two use stricter criteria because the underlying activity data lists them almost everywhere:

- **Para hacer snorkel**: `snorkel` tag, or the snorkeling activity on a Mediterranean beach tagged `rocosa` or `acantilados`
- **Deportes acuáticos**: sailing, windsurf, kitesurf or diving activity (kayak and paddle surf are too common to discriminate)

## Camping Nearby

Beaches within 3km of a verified campsite are flagged as `campingNearby: true`. 42 beaches (22%). Precomputed once and stored in beach records.

## Meta Descriptions

SEO meta descriptions (140-170 chars, Spanish, includes beach name + municipality + "Murcia" / "Costa Cálida"). Precomputed once with Ollama and stored in beach records.

## SEO Keywords

5-10 lowercase keywords per beach (name, municipality, type, activities, characteristics). Precomputed once with Ollama and stored in beach records.

## Recommendation Score

A `recommendationScore` (0-1) is computed at runtime from internal beach data. Used as default sort order ("Recomendados") in explorer, municipality, and collection pages.

### Weights

| Factor         | Weight | Normalization                                 |
| -------------- | ------ | --------------------------------------------- |
| Services count | 30%    | `min(count/8, 1)`                             |
| Length         | 15%    | `min(length/1000, 1)`, default 0.3 if unknown |
| Photo quality  | 10%    | `score/3` (0-3 scale)                         |
| Accessibility  | 15%    | easy=1, moderate=0.6, hard=0.2, unknown=0.5   |
| Blue Flag      | 15%    | 1 if certified, 0 otherwise                   |
| Child-safe     | 10%    | 1 if true, 0 otherwise                        |
| Natural shade  | 5%     | 1 if true, 0 otherwise                        |

Beaches with missing data receive neutral defaults (not penalized).
