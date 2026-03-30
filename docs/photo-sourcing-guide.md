# Beach Photo Sourcing Guide

76 of 194 beaches (39%) currently have no photos. This document outlines where to find photos and the workflow for adding them.

## Current Coverage

| Municipality          | Missing | Total | Coverage |
| --------------------- | ------- | ----- | -------- |
| Cartagena             | 28      | ~60   | ~53%     |
| Aguilas               | 17      | ~30   | ~43%     |
| Mazarron              | 13      | ~30   | ~57%     |
| Lorca                 | 11      | ~15   | ~27%     |
| San Javier            | 5       | ~15   | ~67%     |
| San Pedro del Pinatar | 1       | ~8    | ~88%     |
| Los Alcazares         | 1       | ~5    | ~80%     |

Priority order: **Lorca > Aguilas > Cartagena > Mazarron** (worst coverage first).

## Free / Open-License Sources

### 1. Wikimedia Commons (recommended first)

- **URL**: https://commons.wikimedia.org
- **Search**: `"Playa [name] Murcia"` or `"Cala [name] Cartagena"`
- **License**: CC BY-SA 4.0 or public domain — compatible with this project
- **Quality**: Variable. Filter by resolution > 1200px wide
- **Batch approach**: Use the Wikimedia API to search by category:
  - `Category:Beaches of Cartagena`
  - `Category:Beaches of the Region of Murcia`
  - `Category:Aguilas (Murcia)`
  - `Category:Costa Calida`

### 2. Flickr (Creative Commons)

- **URL**: https://www.flickr.com/search/?text=playa+murcia&license=2%2C3%2C4%2C5%2C6%2C9
- **License filter**: CC BY, CC BY-SA, CC0 only (license codes 2, 3, 4, 5, 6, 9)
- **Search tips**: Use beach name + municipality, e.g. `"Cala Cortina" Cartagena`
- **Quality**: Often high. Check original resolution before downloading

### 3. Regional Tourism Portals

- **CARM Turismo**: https://www.murciaturistica.es — has beach listings with photos
- **Costa Calida**: https://www.costacalida.es — regional tourism brand
- **Note**: Contact the portal for reuse permission. Government content may be reusable under Spanish law (Ley 37/2007 de reutilizacion de informacion del sector publico)

### 4. Municipality Tourism Pages

| Municipality          | Tourism Portal                           |
| --------------------- | ---------------------------------------- |
| Cartagena             | https://www.cartagena.es/turismo         |
| Aguilas               | https://www.aguilas.es (seccion turismo) |
| Mazarron              | https://www.mazarron.es/turismo          |
| Lorca                 | https://www.lorca.es/turismo             |
| San Javier            | https://www.sanjavier.es                 |
| San Pedro del Pinatar | https://www.sanpedrodelpinatar.es        |
| Los Alcazares         | https://www.losalcazares.es              |
| La Union              | https://www.launion.es                   |
| Cartagena (Portman)   | Same as Cartagena above                  |

**License note**: Municipality-published photos are often reusable for informational sites. Contact the ayuntamiento press office to confirm.

### 5. Google Street View / Mapillary

- **Mapillary**: https://www.mapillary.com — CC BY-SA licensed street-level imagery
- Good for beaches that lack tourism photos (remote calas)
- Extract frames from panoramic coverage

### 6. Unsplash / Pexels (generic only)

- Only useful as fallback for very generic coastal shots
- Unlikely to have specific beach photos from Murcia
- License: Unsplash License / Pexels License (free commercial use)

## Workflow for Adding Photos

### 1. Find and download

```bash
# For each beach without photos:
# 1. Search Wikimedia Commons first
# 2. Then Flickr CC
# 3. Then municipality portals
# Download to public/pictures/
```

### 2. Naming convention

Files follow the pattern: `beachcode_g.ext` where `beachcode` matches the beach's `code` field or a descriptive slug. Examples:

- `calaroja_g.png`
- `recurso-1-524-1p_g.jpg`

### 3. Optimize

```bash
pnpm optimize:images
```

This generates WebP, AVIF, and size variants (thumb 400px, medium 800px, full 1200px) automatically.

### 4. Update data

Add filenames to the `pictures` array in `data/beaches.json`:

```json
{
  "code": "beach-code",
  "pictures": ["newphoto_g.jpg"]
}
```

### 5. Verify

```bash
pnpm build   # Ensures no broken image references
```

## License Tracking

When adding photos, note the source and license in a spreadsheet or comment. Recommended format:

| Beach  | Photo File  | Source    | License      | Author  | URL         |
| ------ | ----------- | --------- | ------------ | ------- | ----------- |
| Cala X | calax_g.jpg | Wikimedia | CC BY-SA 4.0 | User123 | https://... |

Keep this record for attribution requirements (CC BY-SA requires author credit).
