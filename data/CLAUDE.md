# Data Directory Rules

This directory contains structured data about beaches in the Region of Murcia, Spain.

## Data Files

| File | Description |
|------|-------------|
| `beaches.json` | Main dataset with all beach information |
| `municipalities.json` | Coastal municipalities with INE codes |
| `seas.json` | Sea names (indexed array) |

## Data Sources

Data is aggregated from multiple official sources:

- **Region of Murcia Open Data**: https://datosabiertos.regiondemurcia.es
- **AEMET (Weather Agency)**: https://www.aemet.es - Beach predictions API
- **112 Region of Murcia**: https://www.112rmurcia.es - Emergency/safety info
- **Descriptions**: Generated with Ollama (`gemma3:4b`) using `scripts/generate-descriptions.js`

## Beach Schema

All visible fields are required for each beach entry:

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

  // Required - Content
  description: string       // AI-generated tourist description (2-3 sentences)
  access: string            // How to reach the beach
  nearby: string[]          // Array of nearby beach codes

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

interface AccessInfo {
  hasParking: boolean | null
  hasBusAccess: boolean | null
  hasBoatAccess: boolean | null
  walkingRequired: boolean | null
  roadType: 'asphalt' | 'dirt' | 'path' | 'unknown' | null
  difficultyLevel: 'easy' | 'moderate' | 'difficult' | null
}
```

## Validation Rules

### Coordinates
- Latitude: Must be between 37.37 and 37.9 (Murcia region bounds)
- Longitude: Must be between -1.7 and -0.6 (Murcia region bounds)
- Format: `[latitude, longitude]` (NOT `[lng, lat]`)

### URLs
- Must be valid URLs starting with `http://` or `https://`
- Prefer HTTPS when available
- Verify URLs are accessible before adding

### Phone Numbers
- Format: Spanish format with spaces (e.g., `968 47 37 07`)
- Emergency numbers can include `/112` suffix

### Images
- `pictures`: Array of filenames (not full URLs)
- Base URL: `https://www.turismoregiondemurcia.es/webs/murciaturistica/fotos/1/playas/`
- Full URL: `{baseUrl}{filename}` (e.g., `https://www.turismoregiondemurcia.es/webs/murciaturistica/fotos/1/playas/arturo2_g.jpg`)
- Validation:
  - URL must return HTTP 200
  - Image must be at least 640x480 pixels

### Codes
- `code`: String, unique across all beaches
- `aemetId`: 7-digit string starting with `30` (Murcia province code)
- Municipality IDs: 5-digit INE codes starting with `30`

### Text Fields
- `name`: Spanish, may include "Cala", "Playa" prefix
- `description`: 2-3 sentences, max ~150 words, Spanish
- `soilType`: Descriptive Spanish text (e.g., "Arena fina y dorada")

### References
- `municipality`: Valid index into `municipalities.json` (0-8)
- `sea`: Valid index into `seas.json` (0 or 1)
- `nearby`: Array of valid beach `code` values

## Editing Guidelines

1. **Never manually edit generated fields** (`description`, `accessInfo`) - re-run scripts instead
2. **Preserve JSON formatting** - 2 spaces indentation, no trailing commas
3. **Keep arrays sorted** by `code` field when adding new beaches
4. **Update `nearby` arrays** when adding/removing beaches
5. **Verify coordinates** using mapping tools before adding

