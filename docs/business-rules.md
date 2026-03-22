# Business Rules

This document describes the business logic and data processing rules for the project.

## Scripts Reference

Scripts that exist in `scripts/` and require periodic execution:

| Script | Purpose | Frequency |
|--------|---------|-----------|
| `add-certifications.js` | Update Blue Flag, Q Quality, Ecoplayas certifications | Annual (spring) |
| `add-lifeguard-info.js` | Update COPLA lifeguard data | Seasonal (pre-summer) |
| `validate-beaches.js` | Validate all beach data integrity | Before releases |
| `migrate-to-database.ts` | Migrate JSON data to SQLite/Turso | Once (or after JSON changes) |
| `validate-migration.ts` | Validate database matches JSON source | After migration |

## Beach Orientation

Orientation was calculated based on coordinates:

| Condition | Orientation |
|-----------|-------------|
| Mar Menor (sea=1) + longitude > -0.75 | west |
| Mar Menor (sea=1) + longitude <= -0.75 | east |
| Mar Mediterráneo + latitude > 37.65 | southeast |
| Mar Mediterráneo + latitude > 37.55 | east |
| Mar Mediterráneo + latitude <= 37.55 | southeast |

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

## Content Guidelines

### Description Field

**Guidelines:**
- 2-3 sentences, max 150 words
- Spanish language
- Tourist-oriented, highlight key features
- Include: sand type, water conditions, accessibility
- Avoid: promotional language, unverified claims

### Access vs Description Separation

The `access` field must contain only practical information:

| Include in `access` | Include in `description` |
|---------------------|--------------------------|
| Parking availability | Beach atmosphere |
| Bus/transport access | Natural beauty |
| Walking requirements | Facilities summary |
| Road type (asphalt/dirt) | Tourist recommendations |
| Difficulty level | Nearby attractions |

## Instagram Hashtags

Generated from beach name using this pattern:

1. Remove accents (á→a, é→e, etc.)
2. Remove special characters
3. Convert to CamelCase
4. Add # prefix

Example: "Cala Abierta" → "#CalaAbierta"

## Beach Certifications

Official certifications are assigned based on annual awards:

| Certification | Source | Update Frequency |
|---------------|--------|------------------|
| `blue-flag` | ADEAC/FEE (banderaazul.org) | Annual (spring) |
| `q-quality` | ICTE (calidadturisticahoy.es) | Annual |
| `ecoplayas` | ATEGRUS | Annual |

**2025 Murcia counts:**
- Blue Flag: 29 beaches
- Q de Calidad: 37 beaches
- Ecoplayas: 3 beaches (Mazarrón only)

To check Blue Flag status: `beach.certifications?.includes('blue-flag')`

Script: `scripts/add-certifications.js` (run annually)

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

## Best Season

Best visiting seasons are inferred using Ollama based on:

| Factor | Impact |
|--------|--------|
| Orientation | South/southwest = more winter sun |
| Sea | Mar Menor = warmer in spring/autumn |
| Tags | Sheltered calas = wind protection |
| Services | Urban beaches = year-round access |

**Season distribution:**
- Most beaches: `["spring", "summer", "autumn"]`
- Sheltered south-facing: `["spring", "summer", "autumn", "winter"]`
- All beaches include summer

## Dog-Friendly Beaches

Official dog-friendly beaches are designated by municipal ordinances.

Data updated manually when municipal ordinances change. No recurring script.

## Lifeguard Service

Lifeguard data comes from the COPLA system (112 Región de Murcia).

Script: `scripts/add-lifeguard-info.js` (run seasonally)

## Occupancy Level

Typical crowd level is inferred from beach characteristics:

| Level | Criteria |
|-------|----------|
| high | Urban beaches, promenade, accessible tag, La Manga/Los Alcázares/San Pedro, 2+ certifications |
| low | Wild/isolated/nudist tags, remote calas without lifeguard or services |
| medium | Everything else |

**Distribution:** ~47% high, ~26% medium, ~26% low

Calculated once and stored in beach records. No recurring script.

## Camping Nearby

Beaches within 3km of a verified campsite are flagged as `campingNearby: true`.

| Municipality | Campsites |
|--------------|-----------|
| San Javier | Camping Mar Menor, Camping Pueblo |
| Cartagena | Camping Los Madriles, Camping El Portús |
| Mazarrón | Camping Playa de Mazarrón, Las Torres, Los Delfines |
| Águilas | Camping Bellavista, Camperpark Duemo |
| Lorca | Camping Playa Parazuelos |

**Distribution:** 42 beaches (22%)

Calculated once and stored in beach records. Script deleted after run.

## Meta Descriptions

SEO-optimized descriptions generated with Ollama:

| Requirement | Value |
|-------------|-------|
| Length | 140-170 characters |
| Language | Spanish |
| Keywords | Beach name, municipality, "Murcia", "Costa Cálida" |

Script auto-corrects length by asking Ollama to expand/shorten until in range.

Generated once with Ollama and stored in beach records. Script deleted after run.

## SEO Keywords

Keywords extracted with Ollama for search optimization:

| Requirement | Value |
|-------------|-------|
| Count | 5-10 keywords per beach |
| Content | Beach name, municipality, type, activities, characteristics |
| Format | Lowercase strings |

Generated once with Ollama and stored in beach records. Script deleted after run.
