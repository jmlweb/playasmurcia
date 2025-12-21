# Data Schema

This document describes the data structure for beaches in the Region of Murcia, Spain.

## Data Files

| File | Description | Count |
|------|-------------|-------|
| `beaches.json` | Main dataset with all beach information | 194 beaches |
| `municipalities.json` | Coastal municipalities with INE codes | 9 municipalities |
| `seas.json` | Sea names (indexed array) | 2 seas |

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
  blueFlag: boolean         // EU Blue Flag certification
  nudist: boolean           // Nudist beach
  accessible: boolean       // Accessibility features
  promenade: boolean        // Has seafront promenade
  anchorageZone: boolean    // Boat anchoring allowed
  dogFriendly: boolean      // Officially allows dogs

  // Required - Content
  description: string       // AI-generated tourist description (2-3 sentences)
  access: string            // How to reach the beach
  nearby: string[]          // Array of nearby beach codes
  orientation: string       // Cardinal direction (east, southeast, etc.)
  instagramHashtag: string  // Instagram hashtag for the beach

  // Optional
  district?: string         // District within municipality
  phone?: string            // Emergency contact
  email?: string            // Contact email
  realUrl?: string          // Official website URL
  waves?: string            // Wave conditions (MODERADO, etc.)
  pictures?: string[]       // Image filenames
  aemetId?: string          // AEMET beach code for weather API
  accessInfo?: AccessInfo   // Structured access data (AI-extracted)
}
```

### AccessInfo

```typescript
interface AccessInfo {
  hasParking: boolean | null
  hasBusAccess: boolean | null
  hasBoatAccess: boolean | null
  walkingRequired: boolean | null
  roadType: 'asphalt' | 'dirt' | 'path' | 'unknown' | null
  difficultyLevel: 'easy' | 'moderate' | 'difficult' | null
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

## Relationships

```
municipalities.json (9 elements)
        ↓
        └─→ beaches.json[].municipality (index 0-8)

seas.json (2 elements)
        ↓
        └─→ beaches.json[].sea (index 0-1)

beaches.json[].nearby (array of codes)
        ↓
        └─→ References to other beaches.json[].code
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
- `nearby`: Array of valid beach `code` values

## Editing Guidelines

1. **Never manually edit generated fields** (`description`, `accessInfo`) - re-run scripts instead
2. **Preserve JSON formatting** - 2 spaces indentation, no trailing commas
3. **Keep arrays sorted** by `code` field when adding new beaches
4. **Update `nearby` arrays** when adding/removing beaches
5. **Verify coordinates** using mapping tools before adding
