# Data Schema

This document describes the data structure for beaches in the Region of Murcia, Spain.

> **Source of truth**: `src/db/schema.ts` (database) and `src/types/beach.ts` (TypeScript types). This document is a human-readable reference — always verify against source files when in doubt.

## Data Files

| File | Description | Count |
|------|-------------|-------|
| `beaches.json` | Main dataset with all beach information | 193 beaches |
| `municipalities.json` | Coastal municipalities with INE codes | 8 municipalities |
| `seas.json` | Sea names (indexed array) | 2 seas |
| `activities.json` | Beach activities (indexed array) | 10 activities |
| `services.json` | Beach services (indexed array); `assisted-bathing` (index 9) is set from `accessibility.json` | 10 services |
| `tags.json` | Beach tags for categorization (indexed array) | 17 tags |
| `certification-seasons.json` | Season year of each certification list, keyed by certification (`{ "blue-flag": 2026, "q-quality": 2024 }`). Written by `scripts/add-certifications.js`; not migrated to the DB — the site bundles it at build time | 2 entries |
| `picture-credits.json` | Author, licence and source page of pictures sourced from Wikimedia Commons, keyed by the picture filename used in `pictures` (`{ "wm-geo-567.jpg": { author, license, source, title, descriptionUrl } }`). Written by `scripts/source-wikimedia-pictures.ts` when a candidate is approved; not migrated to the DB. Only CC BY, CC BY-SA, CC0 and public domain are accepted. Pictures from earlier sourcing runs have no entry yet | 2 entries |
| `zones.json` | Hand-curated beach zones (see [Zones](#zones)): the zone list, the mapping of every ITREM locality label, manual assignments with a reason, and `unresolved` beaches with a reason. Bundled by `src/lib/zones.ts` for names and order | 30 zones |
| `smoke-free-beaches.json` | The 16 spaces of the regional Red de Playas sin Humo keyed by beach code, with the covered stretch when the list names only part of a beach, the source URL and the confirmation note (the list is undated; the 30 May 2025 press release confirms 16). Bundled by `src/lib/beach-notices.ts`; not migrated | 16 codes |
| `access-restrictions.json` | Published summer vehicle limits and shuttles keyed by beach code (`{ year, recurring, summary, shuttle?, sourceLabel, sourceUrl, shuttleSourceLabel?, shuttleSourceUrl? }`): Calblanque (BORM order each year), Puntas de Calnegre (access-ordering service, no ban) and Cuatro Calas (2026 regional barriers, dates not published). The year is shown on the page so stale data is visible. Bundled by `src/lib/beach-notices.ts`; not migrated | 23 codes |
| `accessibility.json` | FAMDIF accessibility sheet per beach as published on the ITREM beach pages, keyed by beach code (`{ year, category, assistedBathing?: 'staff' \| 'loan' \| 'none', amphibiousChairs?, amphibiousCrutches?, walkway?, adaptedToilets?, adaptedChangingRooms?, adaptedShade?, adaptedBathingZone?, season?, hours?, bookingNote?, sourceUrl, imagesUrl? }`). Written by `scripts/fetch-beach-accessibility.ts`; bundled by `src/lib/accessibility.ts`; not migrated. `assistedBathing: 'staff'` is mirrored as the `assisted-bathing` service in `beaches.json` | 67 codes |
| `marinas.json` | The 19 leisure ports from the ITREM `puerto_deportivo` pages with coordinates, site and phone, plus the 3 excluded entries and why. Bundled by `src/lib/marinas.ts` (nearest marina per beach at render time); not migrated | 19 marinas |
| `marine-reserves.json` | Marine reserves shown at zone level (`zones` lists the zone ids): area, creation year, summary, integral zone and the diving authorisation rule, with sources. Bundled by `src/lib/marine-reserves.ts`; not migrated | 1 reserve |
| `protected-areas.json` | Natura 2000 sites (EEA, end-2024 release) and regional Espacios Naturales Protegidos (CARM WFS) within 200 m of each beach, keyed by beach code (`{ natura2000: [{ code, name, type }], regional: [{ code, name, figure, norm }] }`). Written by `scripts/fetch-protected-areas.ts`; bundled by `src/lib/protected-areas.ts`, which also marks the marine-only sites; not migrated | 158 codes |
| `beach-dimensions.json` | Official length and average width per beach from the ITREM sheet ("Características"), keyed by beach code (`{ officialLength?, officialWidth?, officialWidthRange?: [min, max], sourceUrl }`). Written by `scripts/fetch-itrem-dimensions.ts`; bundled by `src/lib/beach-dimensions.ts`; not migrated. `length` in `beaches.json` stays the OSM value | 154 codes |
| `municipality-facts.json` | Official facts per municipality, keyed by INE code (see [Municipality facts](#municipality-facts)). Bundled by `src/lib/municipality-facts.ts` at build time; not migrated to the DB | 5 blocks |
| `source/itrem-localities.json` | Raw ITREM locality labels per beach code, fetched on 2026-11-06 by `scripts/assign-zones.ts --fetch`. Evidence for `zone`; not migrated, not bundled | 193 codes |

## Data Sources

Data is aggregated from multiple official sources:

- **Region of Murcia Open Data**: https://datosabiertos.regiondemurcia.es
- **AEMET (Weather Agency)**: https://www.aemet.es - Beach predictions API
- **112 Region of Murcia**: https://www.112rmurcia.es - Emergency/safety info
- **Descriptions**: Hand-edited Spanish copy (Oct 2026 rewrite), grounded in the beach's own data fields. EN/FR/DE `translations` are older Gemma output, not shown on the site
- **Access**: Hand-edited Spanish copy (Oct 2026 rewrite), rebuilt from the official texts of the first import
- **Zones**: Locality line of the ITREM beach pages (Instituto de Turismo de la Región de Murcia), `https://itrem.carm.es/es/playa/<slug>-<code>/`, curated by hand in `zones.json`. See [Zones](#zones)

## Schemas

### Beach

```typescript
interface Beach {
  // Required - Basic
  code: string // Unique beach identifier
  name: string // Beach name (Spanish)
  municipality: number // Index into municipalities.json
  sea: number // Index into seas.json (0=Mediterráneo, 1=Mar Menor)
  coordinates: [number, number] // [latitude, longitude]

  // Required - Characteristics
  soilType: string // Sand/rock type description
  nudist: boolean // Nudist beach
  promenade: boolean // Has seafront promenade
  anchorageZone: boolean // Boat anchoring allowed
  dogFriendly: boolean // Officially allows dogs
  lifeguard: boolean // Has lifeguard service (COPLA) in summer
  services: number[] // Indices into services.json
  activities: number[] // Indices into activities.json

  // Required - Content
  description: string // Hand-edited tourist description, markdown subset (see below)
  access: string // Hand-edited directions, same markdown subset as description
  nearby: string[] // Nearby beach codes, closest first
  orientation: string // Cardinal direction (east, southeast, etc.)
  shoreBearing: number // Integer 0-359, compass degrees the beach faces seaward (see Shore Bearing in business-rules.md)
  instagramHashtag: string // Instagram hashtag for the beach

  // Optional
  occupancyLevel?: 'low' | 'medium' | 'high' // Typical crowd level
  campingNearby?: boolean // Camping within 3km
  metaDescription?: string // Generated and no longer rendered; pages use getBeachSummary(description)
  seoKeywords?: string[] // SEO keywords (5-10 items)
  certifications?: ('blue-flag' | 'q-quality' | 'ecoplayas')[] // Official certifications; season year per list in certification-seasons.json
  bestSeason?: ('spring' | 'summer' | 'autumn' | 'winter')[] // Best visiting seasons
  district?: string // District within municipality
  zone?: string // Zone id from zones.json (e.g. "la-manga"); absent only for beaches in zones.json `unresolved`
  phone?: string // Emergency contact
  email?: string // Contact email
  realUrl?: string // Official website URL
  address?: string // Street or locality line from the official source (43 beaches, Mazarrón/Águilas/Lorca); never just the municipality name
  postalCode?: string // Five-digit postal code (42 beaches)
  waves?: string // Wave conditions (MODERADO, etc.)
  pictures?: string[] // Image filenames; pictures[0] is the hand-picked cover
  pictureQualityScore?: 0 | 1 | 2 | 3 // Derived from `pictures` + `public/pictures` files (see `pnpm score:picture-quality`)
  aemetId?: string // AEMET beach code for weather API
  length?: number // Beach length in meters (from OSM); the page and the score prefer the ITREM length in beach-dimensions.json when published
  accessDifficulty?: 'easy' | 'moderate' | 'hard' // How difficult to reach (~61% easy, ~22% moderate, ~17% hard)
  childSafe?: boolean // Safe for young children (~38% true)
  naturalShade?: boolean // Has natural shade from cliffs/trees (~29% true)
  waterQuality?: 'excellent' | 'good' | 'sufficient' | 'poor' // Official EU bathing-water class (Directive 2006/7/EC); absent when no sampling point matches
  waterQualitySource?: {
    // Set exactly when waterQuality is set (pnpm tsx scripts/add-bathing-water-quality.ts)
    season: number // Bathing season the class belongs to (e.g. 2025)
    samplingPointId: string // EEA bathingWaterIdentifier, always "ES620…" (Región de Murcia)
    samplingPointName: string
    distanceMeters: number // Integer, beach coordinates to sampling point, at most 500
    profileUrl?: string // NÁYADE bathing-water profile (https), cited on the beach page
  }
  translations?: {
    en: { description: string }
    fr: { description: string }
    de: { description: string }
  }
  tags?: number[] // Indices into tags.json
}
```

### Activity

```typescript
interface Activity {
  id: string // Unique identifier (e.g., "swimming")
  name: string // Spanish display name (e.g., "Natación")
  icon: string // Icon identifier for UI
}
```

### Service

```typescript
interface Service {
  id: string // Unique identifier (e.g., "parking")
  name: string // Spanish display name (e.g., "Parking")
  icon: string // Icon identifier for UI
}
```

### Tag

```typescript
interface Tag {
  id: string // Unique identifier (e.g., "familiar")
  name: string // Spanish display name (e.g., "Familiar")
}
```

### Municipality

```typescript
interface Municipality {
  name: string // Municipality name (Spanish)
  id: string // 5-digit INE code (starts with "30")
}
```

### Sea

```typescript
interface Sea {
  name: string // Sea name (Spanish)
  jellyfishRisk: string // Risk level: "low" | "moderate"
}
```

### Municipality facts

`data/municipality-facts.json` has five blocks. Each `values` map is keyed by the 5-digit INE code from `municipalities.json`. A municipality without a key shows nothing for that block (no estimate).

```typescript
{
  population: {
    source: string
    sourceUrl: string
    year: number
    values: Record<string, number>
  }
  appraisedValue: {
    source: string
    sourceUrl: string
    quarter: string
    regionalAverage: number
    values: Record<string, number>
  } // €/m²
  income: {
    source: string
    sourceUrl: string
    apiUrl: string // INE JSON API, whole table; filter series by Nombre "<Municipio>. Dato base. Renta neta media por persona. "
    year: number // Income year (ADRH 2024 = income 2024, published 2026-10-19)
    publishedOn: string
    nationalAverage: number
    note: string // Comparability caveat shown on the page
    values: Record<string, number> // € per person, net
  }
  touristHousing: {
    source: string
    sourceUrl: string
    apiUrls: string[] // Tables 39363 (homes, beds) and 39366 (share %)
    period: string // Reference month, e.g. "mayo de 2026"
    releaseFrequency: string // From the INE page: twice a year, May and November
    nationalSharePercent: number
    values: Record<string, { homes: number; beds: number; sharePercent: number }>
  }
  touristOffices: {
    source: string
    verifiedOn: string
    values: Record<
      string,
      { name: string; address: string; phone: string; url: string }[]
    >
  }
}
```

- **Population**: INE table 2883, 1 January 2025, all 8 municipalities. API: `https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/2883?tip=AM&nult=1` (series "<Municipality>. Total. Total habitantes. Personas.").
- **Appraised value**: mean appraised value of free-market housing ("Total vivienda libre" block only, not "up to 5 years old"), Ministry of Transport, published by CREM (`sec71.pdf`), Q2 2026. Only Águilas, Cartagena, Lorca, Mazarrón and San Javier appear in the table; San Pedro del Pinatar, La Unión and Los Alcázares have no figure. It is municipality-wide, so Lorca's value mostly reflects inland housing. It is not a median or a sale price, and the page says so. Notarial (Penotariado) data is excluded: no documented API or reuse terms.
- **Tourist offices**: the CARM open dataset `OficinasdeTurismo.json` (22 entries for our municipalities, last updated Feb 2024) was only a lead. On 2026-11-07 each office was re-checked on the municipality's own site and the file stores the current values. The dataset was stale for Lorca (moved to Palacio de Guevara), Mazarrón (new phone), La Unión (now at the Museo Minero) and San Javier (Plaza de España). Cartagena and San Pedro del Pinatar show no office until their official pages are readable; the Águilas information points (Calabardina, La Colonia, Las Delicias) and the La Manga points are not listed for the same reason.

### Zones

A zone is the place visitors use to think about the coast: a locality (Lo Pagán, Santiago de la Ribera, Isla Plana) or a tourism area (La Manga del Mar Menor, Calblanque, Cabo Cope). The municipality page groups its beaches by zone. `district` cannot do this: it is sparse and mixes naming styles.

**Source.** ITREM beach pages, `https://itrem.carm.es/es/playa/<slug>-<code>/`, show a locality line under the beach name, such as `LO PAGAN (San Pedro del Pinatar)`. The page ID is our beach `code`, and the slug part of the URL is ignored. The line is not in the open dataset `Playas.json`. The pages are served as ISO-8859-1 (Latin-1), so decode them as Latin-1 before reading names.

**Coverage on 2026-11-06** (`data/source/itrem-localities.json`): 157 of 193 codes have a page, 154 pages have a label, and there are 36 distinct labels. 21 labels name only the municipality (for example `Mazarrón`). The task that introduced zones measured 148 labels and 34 values on 2026-11-04; the snapshot is the reference.

**Curation** (`data/zones.json`):

```typescript
{
  zones: { id: string; name: string; kind: "locality" | "area"; municipalities: number[] }[]  // Coastal order, north to south-west
  itremLabels: Record<string, string | null>   // Every raw ITREM label → zone id; null when it names only the municipality
  manual: Record<string, { zone: string; reason: string }>  // Beach code → zone, overriding or filling in ITREM
  unresolved: Record<string, string>           // Beach code → why no zone is assigned
}
```

- Zone names restore the diacritics ITREM drops (`LO PAGAN` → `Lo Pagán`, `LA AZOHIA` → `La Azohía`).
- `kind: "area"` marks tourism or protected areas (La Manga del Mar Menor, Calblanque, Cabo Tiñoso, Cabo Cope, Cuatro Calas, Salinas de San Pedro); everything else is a locality.
- A zone can span municipalities: La Manga del Mar Menor is in Cartagena and San Javier.
- Calblanque is not La Manga: ITREM labels some Calblanque beaches `LA MANGA DEL MAR MENOR`, and `manual` overrides them.
- Every beach has a zone or an entry in `unresolved`. The 60 beaches without a usable label (no page, no label, or a municipality-only label) were reviewed by hand against name, description, neighbours and coordinates.

`scripts/assign-zones.ts` writes `zone` into `beaches.json` (`unresolved` first, then `manual`, then the label). It fails on an ITREM label that `itremLabels` does not list.

## Database Schema

The database (Turso/libSQL via Drizzle ORM) mirrors the JSON data with proper relational structure. Defined in `src/db/schema.ts`.

### Entity Tables

| Table            | PK          | Key Columns                                                                                                                         | Notes    |
| ---------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `municipalities` | `id` (int)  | `name`, `ine_code`                                                                                                                  | 8 rows   |
| `seas`           | `id` (int)  | `name`, `jellyfish_risk`                                                                                                            | 2 rows   |
| `services`       | `id` (int)  | `service_id` (unique), `name`, `icon`                                                                                               | 9 rows   |
| `activities`     | `id` (int)  | `activity_id` (unique), `name`, `icon`                                                                                              | 10 rows  |
| `tags`           | `id` (int)  | `tag_id` (unique), `name`                                                                                                           | 17 rows  |
| `beaches`        | `id` (auto) | `code` (unique), `name`, FK `municipality_id`, FK `sea_id`, `picture_quality_score` (nullable int), `zone` (nullable text, zone id) | 193 rows |

### Junction Tables

| Table              | FKs                                              | Notes                   |
| ------------------ | ------------------------------------------------ | ----------------------- |
| `beach_services`   | `beach_id` → beaches, `service_id` → services    | Cascade delete on beach |
| `beach_activities` | `beach_id` → beaches, `activity_id` → activities | Cascade delete on beach |
| `beach_tags`       | `beach_id` → beaches, `tag_id` → tags            | Cascade delete on beach |

### Key Differences from JSON

| Aspect        | JSON                                         | Database                                                                                |
| ------------- | -------------------------------------------- | --------------------------------------------------------------------------------------- |
| References    | Array indices (e.g., `municipality: 3`)      | Foreign keys (`municipality_id`)                                                        |
| Many-to-many  | Integer arrays (e.g., `services: [0, 2, 5]`) | Junction tables                                                                         |
| Array fields  | Native arrays                                | JSON TEXT columns (`nearby`, `seoKeywords`, `certifications`, `bestSeason`, `pictures`) |
| Object fields | Native objects                               | JSON TEXT column `water_quality_source` (`waterQualitySource`)                          |
| Coordinates   | `[lat, lng]` tuple                           | Separate `latitude`/`longitude` REAL columns                                            |

## JSON Relationships

```
municipalities.json (8 elements)
        ↓
        └─→ beaches.json[].municipality (index 0-7)

seas.json (2 elements)
        ↓
        └─→ beaches.json[].sea (index 0-1)

activities.json (10 elements)
        ↓
        └─→ beaches.json[].activities (array of indices 0-9)

services.json (10 elements)
        ↓
        └─→ beaches.json[].services (array of indices 0-8)

tags.json (17 elements)
        ↓
        └─→ beaches.json[].tags (array of indices 0-16)

beaches.json[].nearby (array of codes)
        ↓
        └─→ References to other beaches.json[].code
```

### Database Relationships

```
municipalities ──< beaches (municipality_id FK)
seas ──< beaches (sea_id FK)
beaches ──< beach_services >── services
beaches ──< beach_activities >── activities
beaches ──< beach_tags >── tags
```

## Validation Rules

### Coordinates

- Latitude: 37.37 - 37.9 (Murcia region bounds)
- Longitude: -1.7 - -0.6 (Murcia region bounds)
- Format: `[latitude, longitude]` (NOT `[lng, lat]`)

### URLs

- Must start with `http://` or `https://`
- HTTPS preferred
- Verify accessibility before adding

### Phone Numbers

- Spanish format with spaces: `968 47 37 07`
- Emergency suffix allowed: `/112`

### Images

- `pictures`: Array of filenames (not full URLs). `pictures[0]` is the cover used by the hero, cards and social image
- `pictureQualityScore`: Optional 0–3. **0** = no `pictures` entries; **1** = entries exist but no usable raster on disk or best short side under 600; **2** = short side under 1200; **3** = short side 1200+. Regenerate with `pnpm score:picture-quality`.
- To drop sub-threshold files from `pictures` arrays (and optionally from disk), run `pnpm run prune:small-pictures -- --dry-run` then without `--dry-run`; use `--delete-files` only after checking the dry-run output.
- Base URL: `https://www.turismoregiondemurcia.es/webs/murciaturistica/fotos/1/playas/`
- Minimum size: 640x480 pixels

### Codes

| Field           | Format                        | Example     |
| --------------- | ----------------------------- | ----------- |
| `code`          | Unique string                 | `"575"`     |
| `aemetId`       | 7-digit, starts with "30"     | `"3001610"` |
| Municipality ID | 5-digit INE, starts with "30" | `"30016"`   |

### Text Fields

| Field         | Language | Constraints                                                                                                                                                                                                                                                           |
| ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Spanish  | May include "Cala", "Playa" prefix                                                                                                                                                                                                                                    |
| `description` | Spanish  | 2-3 sentences plus optional tip. Markdown subset: paragraphs separated by a blank line, `**bold**`, and a final `**Consejo:**` paragraph rendered as a callout. Every `**` must be paired (checked by `validate-beaches.js`)                                          |
| `access`      | Spanish  | Directions only (see `docs/business-rules.md`). Same markdown subset as `description`, plus `- ` bullet lists and `[text](https://…)` links. Links must use https, and `* ` bullets or `#` headings are rejected (both checked by `validate-beaches.js`)              |
| `soilType`    | Spanish  | Descriptive, one of 25 canonical values. Sand follows `Arena <grain>[ y <colour or mix>]` with the grain first (`Arena fina y blanca`, never `Arena blanca y fina`); other materials are `Bolos`, `Grava`, `Roca`, `Piedras y roca`, their mixes, or `Sin determinar` |

### References

- `municipality`: Valid index 0-8
- `sea`: Valid index 0-1
- `activities`: Array of valid indices 0-9
- `services`: Array of valid indices 0-8
- `tags`: Array of valid indices 0-16
- `nearby`: Array of valid beach `code` values
- `zone`: A zone id from `zones.json` whose `municipalities` include the beach's municipality. Required unless the code is in `zones.json` `unresolved`, which forbids it

## Editing Guidelines

1. **`description` and `access` are hand-edited copy** - edit them directly, following the guidelines in `docs/business-rules.md`. No script rewrites them
2. **Preserve JSON formatting** - 2 spaces indentation, no trailing commas
3. **Keep arrays sorted** by `code` field when adding new beaches
4. **Update `nearby` arrays** when adding/removing beaches
5. **Verify coordinates** using mapping tools before adding
