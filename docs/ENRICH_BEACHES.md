# Enrich Beach Data - Murcia Beaches

> **Goal**: Enrich data from `@data/beaches.json` with as much static information as possible using open data sources, AI (Ollama), and web scraping/queries.

## 📋 Table of Contents

- [Rules and Principles](#rules-and-principles)
- [Current Data Status](#current-data-status)
- [Scripts Created](#scripts-created)
- [Enrichment Roadmap](#enrichment-roadmap)
- [Proposed Fields Schema](#proposed-fields-schema)
- [Open Data Sources](#open-data-sources)
- [Recommended Execution Order](#recommended-execution-order)
- [Common Tasks](#common-tasks)
- [Script Template](#script-template)
- [Additional Suggestions](#additional-suggestions)

---

## Rules and Principles

1. **Avoid duplicate data**: Do not store redundant information
2. **Automated scripts**: It's recommended to create scripts to process large volumes of data
3. **Static data only**: Only store persistent, non-ephemeral data. For real-time data (weather, beach status), see [CREATE_SERVICES.md](./CREATE_SERVICES.md)
4. **Quality over quantity**: Prioritize accuracy and official sources
5. **Maintainability**: Document sources and methods to facilitate future updates

---

## Current Data Status

- **Total beaches**: 194
- **Mediterranean**: 151 beaches
- **Mar Menor**: 43 beaches
- **Municipalities**: 9

### Fields Coverage

| Field | Coverage | Notes |
|-------|----------|-------|
| `code`, `name`, `municipality`, `sea`, `coordinates` | 194/194 | Required fields |
| `soilType`, `blueFlag`, `nudist`, `accessible`, `promenade`, `anchorageZone` | 194/194 | Boolean/string fields |
| `description` | 194/194 | AI-generated via Ollama |
| `access` | 194/194 | Text directions |
| `accessInfo` | 189/194 | AI-extracted structured data |
| `pictures` | 187/194 | Image arrays |
| `aemetId` | 65/194 | AEMET weather API codes |
| `nearby` | 194/194 | Related beach codes |
| Optional (phone, email, address, waves) | 85/194 | Sparse coverage |

---

## Scripts Created

### 1. Generate Descriptions (`scripts/generate-descriptions.js`) ✅ Executed

Generates tourist descriptions for each beach using Ollama (gemma3:4b).

```bash
node scripts/generate-descriptions.js
```

- Adds `description` field to each beach
- Processes beaches without description
- Saves progress every 10 beaches

### 2. Add AEMET IDs (`scripts/add-aemet-ids.js`) ✅ Executed

Maps beach codes to AEMET weather prediction API codes.

```bash
node scripts/add-aemet-ids.js
```

- Adds `aemetId` field for beaches with AEMET coverage (65 beaches)
- Required for weather prediction integration (used by services, see [CREATE_SERVICES.md](./CREATE_SERVICES.md))

### 3. Improve Access Info (`scripts/improve-access.js`) ✅ Executed

Extracts structured data from the existing `access` text field using Ollama.

```bash
node scripts/improve-access.js
```

Adds `accessInfo` object with:
- `hasParking`: boolean
- `hasBusAccess`: boolean
- `hasBoatAccess`: boolean
- `walkingRequired`: boolean
- `roadType`: "asphalt" | "dirt" | "path" | "unknown"
- `difficultyLevel`: "easy" | "moderate" | "difficult"

---

## Enrichment Roadmap

### Phase 1: High Priority (High Value + Feasible)

| Field | Type | Source | Script | Status |
|-------|------|--------|--------|--------|
| `dogFriendly` | boolean | Official sources + web search | `add-dog-friendly.js` | ⏳ Pending |
| `lifeguard` | boolean | 112 Murcia / official sources | `add-lifeguard-info.js` | ⏳ Pending |
| `services` | string[] | Ollama extraction + web | `extract-services.js` | ⏳ Pending |
| `waterQuality` | string | MITECO census | `add-water-quality.js` | ⏳ Pending |
| `webcamUrl` | string | Public webcams (municipalities, SkylineWebcams) | `add-webcams.js` | ⏳ Pending |

**Services values**: `["showers", "toilets", "restaurant", "bar", "chiringuito", "parking", "umbrellas", "sunbeds", "footwash", "first-aid", "wheelchair-ramp", "floating-chairs"]`

**Water quality values**: `"excellent" | "good" | "sufficient" | "poor"`


### Phase 2: Medium Priority (Useful + Moderate Effort)

| Field | Type | Source | Script | Status |
|-------|------|--------|--------|--------|
| `length` | number | OpenStreetMap Overpass API | `add-dimensions.js` | ⏳ Pending |
| `activities` | string[] | Ollama inference + web | `extract-activities.js` | ⏳ Pending |
| `bestSeason` | string[] | Ollama inference | `add-best-season.js` | ⏳ Pending |
| `seasonalServices` | object | Official sources | `add-seasonal-services.js` | ⏳ Pending |
| `googlePlaceId` | string | Google Places API | `add-google-place-ids.js` | ⏳ Pending |
| `certifications` | string[] | Official sources | `add-certifications.js` | ⏳ Pending |


**Activities values**: `["swimming", "snorkeling", "diving", "kayak", "paddleboard", "windsurf", "kitesurf", "sailing", "fishing", "volleyball"]`

**Best season values**: `["spring", "summer", "autumn", "winter"]`

**Seasonal services structure**:
```json
{
  "lifeguardStart": "2025-06-15",
  "lifeguardEnd": "2025-09-15",
  "chiringuito": true,
  "accessibilityRamp": true
}
```

**Certifications values**: `["blue-flag", "q-quality", "iso-14001", "ecoplayas"]`

### Phase 3: Low Priority (Nice to Have)

| Field | Type | Source | Script | Status |
|-------|------|--------|--------|--------|
| `occupancyLevel` | string | Manual research / estimates | Manual | ⏳ Pending |
| `historicalInfo` | string | Wikipedia scraping | `add-historical.js` | ⏳ Pending |
| `campingNearby` | boolean | OSM / web search | `add-camping.js` | ⏳ Pending |

### Phase 4: i18n & SEO (Content Enhancement)

| Field | Type | Source | Script | Status |
|-------|------|--------|--------|--------|
| `translations` | object | Ollama/LLM translation | `generate-translations.js` | ⏳ Pending |
| `metaDescription` | string | Ollama generation | `generate-meta-descriptions.js` | ⏳ Pending |
| `seoKeywords` | string[] | Ollama extraction | `generate-seo-keywords.js` | ⏳ Pending |

**Translations structure** (static, not on-the-fly):
```json
{
  "en": { "name": "Open Cove", "description": "..." },
  "de": { "name": "Offene Bucht", "description": "..." },
  "fr": { "name": "Crique Ouverte", "description": "..." }
}
```

**Note**: Murcia receives significant tourism from UK, Germany, and France. Static translations are SEO-friendly (unlike Google Translate widgets).

---

## Proposed Fields Schema

```typescript
interface Beach {
  // Existing required fields
  code: string
  name: string
  municipality: number          // Index into municipalities.json
  sea: number                   // 0 = Mediterranean, 1 = Mar Menor
  coordinates: [number, number] // [latitude, longitude]
  soilType: string
  blueFlag: boolean
  nudist: boolean
  accessible: boolean
  promenade: boolean
  anchorageZone: boolean
  access: string
  nearby: string[]

  // Existing generated fields
  description: string
  accessInfo?: AccessInfo
  aemetId?: string
  pictures?: string[]

  // Existing optional fields
  address?: string
  district?: string
  phone?: string
  email?: string
  realUrl?: string
  postalCode?: string
  waves?: "TRANQUILO" | "SUAVE" | "MODERADO"

  // Phase 1: High Priority
  dogFriendly?: boolean
  lifeguard?: boolean           // Has lifeguard service (summer)
  services?: string[]
  waterQuality?: "excellent" | "good" | "sufficient" | "poor"
  jellyfishRisk?: "low" | "moderate" | "high"
  webcamUrl?: string            // Public webcam URL

  // Phase 2: Medium Priority
  length?: number               // Meters
  orientation?: string          // Cardinal direction beach faces
  activities?: string[]
  bestSeason?: string[]
  seasonalServices?: SeasonalServices
  googlePlaceId?: string        // For Google Reviews integration
  certifications?: string[]     // ["blue-flag", "q-quality", ...]

  // Phase 3: Low Priority
  occupancyLevel?: "low" | "medium" | "high"
  historicalInfo?: string
  campingNearby?: boolean
  instagramHashtag?: string     // e.g., "#PlayaDeBolnuevo"

  // Phase 4: i18n & SEO
  translations?: Translations
  metaDescription?: string      // SEO meta description (Spanish)
  seoKeywords?: string[]
}

interface AccessInfo {
  hasParking: boolean | null
  hasBusAccess: boolean | null
  hasBoatAccess: boolean | null
  walkingRequired: boolean | null
  roadType: "asphalt" | "dirt" | "path" | "unknown" | null
  difficultyLevel: "easy" | "moderate" | "difficult" | null
}

interface SeasonalServices {
  lifeguardStart?: string       // ISO date "2025-06-15"
  lifeguardEnd?: string         // ISO date "2025-09-15"
  chiringuito?: boolean
  accessibilityRamp?: boolean   // PRM floating chairs, ramps
}

interface Translations {
  en?: { name: string; description: string }
  de?: { name: string; description: string }
  fr?: { name: string; description: string }
}
```

---

## Open Data Sources

### 1. AEMET OpenData (Weather Prediction) ✅ Integrated

**Documentation**: https://opendata.aemet.es/dist/index.html

**Beach codes**: https://www.aemet.es/documentos/es/eltiempo/prediccion/playas/Playas_codigos.csv

**Endpoint**: `GET /api/prediccion/especifica/playa/{aemetId}`

**Authentication**: Requires API key (free registration)

**Usage**: The `aemetId` field is stored in `beaches.json` for use by real-time weather services. See [CREATE_SERVICES.md](./CREATE_SERVICES.md) for implementation details.

**Note**: Weather data is ephemeral - use for real-time display only, do not store in `beaches.json`.

### 2. Región de Murcia Open Data (Beach Status)

**Portal**: https://datosabiertos.regiondemurcia.es/carm/catalogo/turismo/informacion-del-estado-de-las-playas-de-la-region-de-murcia

**Endpoint**: `https://www.112rmurcia.es/copla/copla.xml`

**Format**: XML

**Update frequency**: Hourly (summer only, 9:00-23:00)

**License**: http://datosabiertos.regiondemurcia.es/avisolegal

**Potential use**: Extract `lifeguard` presence from real-time data and store as static field.

**Note**: Beach status data is ephemeral. For real-time integration, see [CREATE_SERVICES.md](./CREATE_SERVICES.md).

### 3. MITECO - Water Quality Data

**Portal**: https://www.miteco.gob.es/en/cartografia-y-sig/ide/descargas/agua/censo-aguas-bano.html

**Data**: Annual beach water quality census

**Format**: Shapefile (.shp), WMS service

**Relevant fields**: Water quality classification (Excellent/Good/Sufficient/Poor)

**Update**: Annual (summer sampling results)

**Script approach**:
1. Download latest Shapefile from MITECO
2. Filter by Murcia region (province code 30)
3. Match beach names to our database
4. Extract `calidad` field and map to our schema

### 4. OpenStreetMap - Beach Dimensions & Amenities

**API**: Overpass API (https://overpass-api.de/)

**Query example**:
```
[out:json];
area["name"="Región de Murcia"]->.murcia;
(
  way["natural"="beach"](area.murcia);
  node["natural"="beach"](area.murcia);
);
out body;
```

**Potential data**:
- Beach length (calculate from way geometry)
- Amenities tagged in OSM (toilets, showers, parking)
- Surface type verification

### 5. Official Dog Beach Lists

**Sources**:
- https://www.murciaturistica.es (regional tourism portal)
- Municipal websites (Cartagena, Águilas, Mazarrón, etc.)
- Annual "playas caninas" announcements

**Known dog-friendly beaches in Murcia**:
- Cala del Gorguel (Cartagena)
- Playa de Cobaticas (Mazarrón)
- Playa de la Rambla de los Clérigos (Águilas)
- Check official 2024/2025 lists for updates

### 6. Public Webcams

**Sources**:
- **SkylineWebcams**: https://www.skylinewebcams.com (search "Murcia", "La Manga", etc.)
- **Windy**: https://www.windy.com/webcams (filter by location)
- **Municipal webcams**: Some ayuntamientos provide beach cams
- **Port authorities**: Puerto de Cartagena, Puerto de Águilas

**Script approach**:
1. Search each webcam source for Murcia beaches
2. Verify webcam is still active (HTTP 200)
3. Store permanent URL (not embed, just direct link)
4. Update periodically as webcams change

**Example webcam sources**:
- La Manga: SkylineWebcams
- Puerto de Mazarrón: Municipal cam
- Águilas: Port authority cam

### 7. Jellyfish Reporting & Historical Data

**Context**: Mar Menor has frequent jellyfish issues (especially *Cotylorhiza tuberculata* and *Rhizostoma pulmo*). Mediterranean coast less affected.

**Sources**:
- **MedusApp** (citizen science app): Historical sighting data
- **IEO (Instituto Español de Oceanografía)**: Scientific reports
- **112 Murcia summer reports**: Seasonal patterns
- **Local news archives**: Historical patterns

**Script approach**:
1. Default Mar Menor beaches to `"moderate"` or `"high"` risk
2. Mediterranean beaches default to `"low"`
3. Refine based on historical reports and known problem areas
4. This is static historical risk, not real-time alerts

**Note**: For real-time jellyfish alerts, see [CREATE_SERVICES.md](./CREATE_SERVICES.md) for user-reporting widget implementation.

### 8. Google Places API

**API**: https://developers.google.com/maps/documentation/places/web-service

**Endpoint**: Place Search / Place Details

**Use cases**:
- Obtain `googlePlaceId` for each beach
- Enable Google Reviews display on frontend
- Fetch user ratings and photos

**Script approach**:
1. Use Nearby Search with beach coordinates
2. Filter results by name similarity
3. Store `place_id` for later use
4. Frontend fetches reviews dynamically (not stored)

**Note**: Google Places API has usage costs. Only fetch place IDs once, then use them for real-time queries. See [CREATE_SERVICES.md](./CREATE_SERVICES.md) for reviews integration.

### 9. Blue Flag & Certifications

**Sources**:
- **FEE (Foundation for Environmental Education)**: https://www.banderaazul.org
- **ICTE (Q de Calidad Turística)**: https://www.calidadturistica.es
- **ADEAC**: Annual beach certification lists

**Update frequency**: Annual (certifications announced in spring)

**Script approach**:
1. Download current year's Blue Flag list for Murcia
2. Match beach names to our database
3. Add to `certifications` array
4. Also update existing `blueFlag` boolean for consistency

### 10. Seasonal Services Calendar

**Sources**:
- **112 Murcia**: Annual lifeguard deployment dates
- **Municipal BOPs**: Official bulletins with service dates
- **Tourism offices**: Chiringuito licenses, accessibility equipment

**Typical Murcia dates**:
- Lifeguard service: June 15 - September 15 (main beaches)
- Extended beaches: June 1 - September 30
- Chiringuitos: Easter - October
- PRM accessibility: Varies by municipality

**Script approach**:
1. Research official 2025 dates for each municipality
2. Store in `seasonalServices` object
3. Update annually before summer season

---

## Recommended Execution Order

### ✅ Already Completed

```bash
# 1. AEMET ID mapping (instant, no API needed)
node scripts/add-aemet-ids.js

# 2. Generate descriptions (requires Ollama, ~30min)
ollama serve  # if not running
node scripts/generate-descriptions.js

# 3. Extract access info (requires Ollama, ~20min)
node scripts/improve-access.js
```

### ⏳ Next Steps (Phase 1)

```bash
# 4. Add dog-friendly beaches (web research + official sources)
node scripts/add-dog-friendly.js

# 5. Add lifeguard info (112 Murcia data)
node scripts/add-lifeguard-info.js

# 6. Extract services from descriptions (Ollama, ~25min)
node scripts/extract-services.js

# 7. Add water quality (MITECO Shapefile parsing)
node scripts/add-water-quality.js

# 8. Add webcam URLs (manual research + verification)
node scripts/add-webcams.js
```

### Phase 2

```bash
# 9. Add beach dimensions from OSM
node scripts/add-dimensions.js

# 12. Extract activities (Ollama inference)
node scripts/extract-activities.js

# 13. Add seasonal services calendar
node scripts/add-seasonal-services.js

# 14. Add Google Place IDs (requires API key)
node scripts/add-google-place-ids.js

# 15. Add certifications (Blue Flag, Q Calidad)
node scripts/add-certifications.js
```

### Phase 3

```bash
# 14. Add historical info (Wikipedia)
node scripts/add-historical.js

# 18. Add camping nearby info
node scripts/add-camping.js
```

### Phase 4 (i18n & SEO)

```bash
# 19. Generate translations (Ollama, ~2h for 3 languages)
node scripts/generate-translations.js

# 20. Generate meta descriptions (Ollama, ~30min)
node scripts/generate-meta-descriptions.js

# 21. Generate SEO keywords (Ollama, ~20min)
node scripts/generate-seo-keywords.js
```

---

## Common Tasks

### Adding a New Beach (from existing sources)

1. Get data from official sources (Region of Murcia, 112)
2. Add entry with all required fields (except `description`)
3. Run `generate-descriptions.js` to generate description
4. Run `improve-access.js` to extract access info
5. Optionally run `add-aemet-ids.js` to check for AEMET code

### Adding a New Beach (from scratch)

When a beach is not in official sources, gather data using:

1. **Web search**: Find the beach name, location, and basic info
2. **Google Maps / OpenStreetMap**: Extract coordinates and verify location
3. **Tourism websites**: Get descriptions, photos, and amenities
4. **Local municipality sites**: Official info, contact details, accessibility

**Required steps**:
1. Search for the beach and gather all available information
2. Determine the municipality (must exist in `municipalities.json`)
3. Get precise coordinates (verify they fall within Murcia bounds)
4. Identify the sea (Mediterranean or Mar Menor)
5. Research soil type, accessibility, and other characteristics
6. Add entry with all required fields
7. Run scripts to generate description and check AEMET coverage

### Updating Beach Information

1. Edit the specific fields in `beaches.json`
2. If updating `access`, delete `accessInfo` and re-run `improve-access.js`
3. Never edit `description` directly - delete and regenerate if needed

### Validating Data

Before committing, verify:
- [ ] All required fields present
- [ ] Coordinates within Murcia bounds (lat: 37.4-37.9, lng: -1.7 to -0.6)
- [ ] Municipality/sea indices are valid (0-8 / 0-1)
- [ ] URLs are accessible
- [ ] No duplicate `code` values

**Suggested validation script**:
```bash
# Create scripts/validate-data.js to check all beaches
node scripts/validate-data.js
```

---

## Script Template

Use this template for new enrichment scripts:

```javascript
import { readFileSync, writeFileSync } from 'fs'

const BEACHES_PATH = './data/beaches.json'
const SAVE_INTERVAL = 10

async function main() {
  const beaches = JSON.parse(readFileSync(BEACHES_PATH, 'utf-8'))
  let processed = 0

  for (const beach of beaches) {
    // Skip if already has the field
    if (beach.newField !== undefined) continue

    try {
      // Process beach...
      beach.newField = await processBeach(beach)
      processed++

      // Save progress periodically
      if (processed % SAVE_INTERVAL === 0) {
        writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
        console.log(`Saved progress: ${processed} beaches processed`)
      }
    } catch (error) {
      console.error(`Error processing ${beach.name}:`, error.message)
    }
  }

  // Final save
  writeFileSync(BEACHES_PATH, JSON.stringify(beaches, null, 2))
  console.log(`Done! Processed ${processed} beaches`)
}

async function processBeach(beach) {
  // Implementation here
}

main().catch(console.error)
```

### Script Best Practices

1. **Error handling**: Always wrap processing in try-catch to continue on errors
2. **Progress saving**: Save periodically (every N beaches) to avoid data loss
3. **Idempotency**: Scripts should be safe to run multiple times
4. **Logging**: Log progress and errors for debugging
5. **Validation**: Validate data before writing to file
6. **Backup**: Consider creating a backup before running scripts that modify data

---

## Additional Suggestions

### Data Quality Improvements

- **Coordinate validation**: Ensure all coordinates are within Murcia bounds
- **Name normalization**: Standardize beach name formats
- **Image validation**: Verify all image URLs are accessible
- **Link checking**: Periodically check external URLs for broken links

### Performance Optimizations

- **Batch processing**: Process multiple beaches in parallel when possible
- **Rate limiting**: Respect API rate limits (especially for Google Places, AEMET)
- **Caching**: Cache API responses during script execution to avoid duplicate requests

### Documentation

- **Source tracking**: Consider adding a `sources` field to track where data came from
- **Last updated**: Add `lastUpdated` timestamp for each field to track freshness
- **Change log**: Maintain a changelog for significant data updates

