# Business Rules

This document describes the business logic and data processing rules for the project.

## Beach Orientation

Orientation is calculated automatically based on coordinates:

| Condition | Orientation |
|-----------|-------------|
| Mar Menor (sea=1) + longitude > -0.75 | west |
| Mar Menor (sea=1) + longitude <= -0.75 | east |
| Mar Mediterráneo + latitude > 37.65 | southeast |
| Mar Mediterráneo + latitude > 37.55 | east |
| Mar Mediterráneo + latitude <= 37.55 | southeast |

Script: `scripts/add-orientation.js`

## AEMET Integration

Weather predictions are available for beaches with `aemetId`.

### ID Assignment

- Source: https://www.aemet.es/documentos/es/eltiempo/prediccion/playas/Playas_codigos.csv
- Format: 7-digit code starting with "30" (Murcia province)
- Coverage: ~65 beaches (AEMET only tracks major beaches)

### API Usage

- Endpoint: `GET /api/prediccion/especifica/playa/{aemetId}`
- Data: Temperature, wind, wave height, UV index
- Cache: 30 minutes (data is ephemeral, not stored)

Script: `scripts/add-aemet-ids.js`

## Content Generation

### Description Generation

Descriptions are generated using Ollama (`gemma3:4b`) for cost efficiency.

**Guidelines:**
- 2-3 sentences, max 150 words
- Spanish language
- Tourist-oriented, highlight key features
- Include: sand type, water conditions, accessibility
- Avoid: promotional language, unverified claims

Script: `scripts/generate-descriptions.js`

### Access vs Description Separation

The `access` field must contain only practical information:

| Include in `access` | Include in `description` |
|---------------------|--------------------------|
| Parking availability | Beach atmosphere |
| Bus/transport access | Natural beauty |
| Walking requirements | Facilities summary |
| Road type (asphalt/dirt) | Tourist recommendations |
| Difficulty level | Nearby attractions |

Script: `scripts/consolidate-access-description.js`

## Instagram Hashtags

Generated automatically from beach name:

1. Remove accents (á→a, é→e, etc.)
2. Remove special characters
3. Convert to CamelCase
4. Add # prefix

Example: "Cala Abierta" → "#CalaAbierta"

Script: `scripts/add-social-tags.js`

## Jellyfish Risk

Risk is assigned at sea level, not per beach:

| Sea | Risk Level |
|-----|------------|
| Mar Mediterráneo | low |
| Mar Menor | moderate |

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

### Script Patterns

All enrichment scripts should:
1. Read current `beaches.json`
2. Process only beaches missing the target field
3. Save progress every 10 beaches (recovery on failure)
4. Validate before writing
5. Log progress to console
