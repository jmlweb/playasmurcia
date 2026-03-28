# Data Schema

This document describes the data structure for beaches in the Region of Murcia, Spain.

## Data Files

| File | Description | Count |
|------|-------------|-------|
| `beaches.json` | Main dataset with all beach information | 194 beaches |
| `municipalities.json` | Coastal municipalities with INE codes | 9 municipalities |
| `seas.json` | Sea names (indexed array) | 2 seas |
| `activities.json` | Beach activities (indexed array) | 10 activities |
| `services.json` | Beach services (indexed array) | 9 services |
| `tags.json` | Beach tags for categorization (indexed array) | 17 tags |

## Data Sources

Data is aggregated from multiple official sources:

- **Region of Murcia Open Data**: https://datosabiertos.regiondemurcia.es
- **AEMET (Weather Agency)**: https://www.aemet.es - Beach predictions API
- **112 Region of Murcia**: https://www.112rmurcia.es - Emergency/safety info
- **Descriptions**: Generated with Ollama (`gemma3:4b`)

## Schemas

### Beach

```typescript
interface Beach {
  // Required - Basic
  code: string              // Unique beach identifier
  name: string              // Beach name (Spanish)
  municipality: number      // Index into municipalities.json
  sea: number               // Index into seas.json (0=Mediterráneo, 1=Mar Menor)
  coordinates: [number, number]  // [latitude, longitude]

  // Required - Characteristics
  soilType: string          // Sand/rock type description
  nudist: boolean           // Nudist beach
  promenade: boolean        // Has seafront promenade
  anchorageZone: boolean    // Boat anchoring allowed
  dogFriendly: boolean      // Officially allows dogs
  lifeguard: boolean        // Has lifeguard service (COPLA) in summer
  services: number[]        // Indices into services.json
  activities: number[]      // Indices into activities.json

  // Required - Content
  description: string       // AI-generated tourist description (2-3 sentences)
  access: string            // How to reach the beach
  nearby: string[]          // Array of nearby beach codes
  orientation: string       // Cardinal direction (east, southeast, etc.)
  instagramHashtag: string  // Instagram hashtag for the beach

  // Optional
  occupancyLevel?: "low" | "medium" | "high"  // Typical crowd level
  campingNearby?: boolean        // Camping within 3km
  metaDescription?: string       // SEO meta description (140-170 chars)
  seoKeywords?: string[]         // SEO keywords (5-10 items)
  certifications?: ("blue-flag" | "q-quality" | "ecoplayas")[]  // Official certifications
  bestSeason?: ("spring" | "summer" | "autumn" | "winter")[]  // Best visiting seasons
  district?: string         // District within municipality
  phone?: string            // Emergency contact
  email?: string            // Contact email
  realUrl?: string          // Official website URL
  waves?: string            // Wave conditions (MODERADO, etc.)
  pictures?: string[]       // Image filenames
  pictureQualityScore?: 0 | 1 | 2 | 3  // Derived from `pictures` + `public/pictures` files (see `pnpm score:picture-quality`)
  aemetId?: string          // AEMET beach code for weather API
  length?: number           // Beach length in meters (from OSM)
  accessDifficulty?: "easy" | "moderate" | "hard"  // How difficult to reach (~61% easy, ~22% moderate, ~17% hard)
  childSafe?: boolean       // Safe for young children (~38% true)
  naturalShade?: boolean    // Has natural shade from cliffs/trees (~29% true)
  waterQuality?: "excellent" | "good" | "sufficient" | "poor"  // Water quality rating
  translations?: { en: { description: string }, fr: { description: string }, de: { description: string } }
  tags?: number[]           // Indices into tags.json
}
```

### Activity

```typescript
interface Activity {
  id: string    // Unique identifier (e.g., "swimming")
  name: string  // Spanish display name (e.g., "Natación")
  icon: string  // Icon identifier for UI
}
```

### Service

```typescript
interface Service {
  id: string    // Unique identifier (e.g., "parking")
  name: string  // Spanish display name (e.g., "Parking")
  icon: string  // Icon identifier for UI
}
```

### Tag

```typescript
interface Tag {
  id: string    // Unique identifier (e.g., "familiar")
  name: string  // Spanish display name (e.g., "Familiar")
}
```

### Municipality

```typescript
interface Municipality {
  name: string  // Municipality name (Spanish)
  id: string    // 5-digit INE code (starts with "30")
}
```

### Sea

```typescript
interface Sea {
  name: string         // Sea name (Spanish)
  jellyfishRisk: string  // Risk level: "low" | "moderate"
}
```

## Database Schema

The database (Turso/libSQL via Drizzle ORM) mirrors the JSON data with proper relational structure. Defined in `src/db/schema.ts`.

### Entity Tables

| Table | PK | Key Columns | Notes |
|-------|----|-------------|-------|
| `municipalities` | `id` (int) | `name`, `ine_code` | 9 rows |
| `seas` | `id` (int) | `name`, `jellyfish_risk` | 2 rows |
| `services` | `id` (int) | `service_id` (unique), `name`, `icon` | 9 rows |
| `activities` | `id` (int) | `activity_id` (unique), `name`, `icon` | 10 rows |
| `tags` | `id` (int) | `tag_id` (unique), `name` | 17 rows |
| `beaches` | `id` (auto) | `code` (unique), `name`, FK `municipality_id`, FK `sea_id`, `picture_quality_score` (nullable int) | 194 rows |

### Junction Tables

| Table | FKs | Notes |
|-------|-----|-------|
| `beach_services` | `beach_id` → beaches, `service_id` → services | Cascade delete on beach |
| `beach_activities` | `beach_id` → beaches, `activity_id` → activities | Cascade delete on beach |
| `beach_tags` | `beach_id` → beaches, `tag_id` → tags | Cascade delete on beach |

### Key Differences from JSON

| Aspect | JSON | Database |
|--------|------|----------|
| References | Array indices (e.g., `municipality: 3`) | Foreign keys (`municipality_id`) |
| Many-to-many | Integer arrays (e.g., `services: [0, 2, 5]`) | Junction tables |
| Array fields | Native arrays | JSON TEXT columns (`nearby`, `seoKeywords`, `certifications`, `bestSeason`, `pictures`) |
| Coordinates | `[lat, lng]` tuple | Separate `latitude`/`longitude` REAL columns |

## JSON Relationships

```
municipalities.json (9 elements)
        ↓
        └─→ beaches.json[].municipality (index 0-8)

seas.json (2 elements)
        ↓
        └─→ beaches.json[].sea (index 0-1)

activities.json (10 elements)
        ↓
        └─→ beaches.json[].activities (array of indices 0-9)

services.json (9 elements)
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

- `pictures`: Array of filenames (not full URLs)
- `pictureQualityScore`: Optional 0–3. **0** = no `pictures` entries; **1** = entries exist but no usable raster on disk or best short side under 600; **2** = short side under 1200; **3** = short side 1200+. Regenerate with `pnpm score:picture-quality`.
- To drop sub-threshold files from `pictures` arrays (and optionally from disk), run `pnpm run prune:small-pictures -- --dry-run` then without `--dry-run`; use `--delete-files` only after checking the dry-run output.
- Base URL: `https://www.turismoregiondemurcia.es/webs/murciaturistica/fotos/1/playas/`
- Minimum size: 640x480 pixels

### Codes

| Field | Format | Example |
|-------|--------|---------|
| `code` | Unique string | `"575"` |
| `aemetId` | 7-digit, starts with "30" | `"3001610"` |
| Municipality ID | 5-digit INE, starts with "30" | `"30016"` |

### Text Fields

| Field | Language | Constraints |
|-------|----------|-------------|
| `name` | Spanish | May include "Cala", "Playa" prefix |
| `description` | Spanish | 2-3 sentences, ~150 words max |
| `soilType` | Spanish | Descriptive (e.g., "Arena fina y dorada") |

### References

- `municipality`: Valid index 0-8
- `sea`: Valid index 0-1
- `activities`: Array of valid indices 0-9
- `services`: Array of valid indices 0-8
- `tags`: Array of valid indices 0-16
- `nearby`: Array of valid beach `code` values

## Editing Guidelines

1. **Never manually edit generated fields** (`description`, `access`) - re-run scripts instead
2. **Preserve JSON formatting** - 2 spaces indentation, no trailing commas
3. **Keep arrays sorted** by `code` field when adding new beaches
4. **Update `nearby` arrays** when adding/removing beaches
5. **Verify coordinates** using mapping tools before adding
