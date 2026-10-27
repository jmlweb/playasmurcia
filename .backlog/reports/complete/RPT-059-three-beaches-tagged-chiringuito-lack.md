---
id: RPT-059
title: Three beaches tagged Chiringuito lack the chiringuito service and miss the Con chiringuito collection
type: finding
severity: low
status: triaged
created: 2026-10-27
triaged: 2026-10-27
task-id: TSK-132
---

## Description

Three beaches in `data/beaches.json` carry tag `7` ("Chiringuito", `data/tags.json`) but not service `6` ("Chiringuito", `data/services.json`):

| Beach | Code | Line | services | tags |
|---|---|---|---|---|
| Playa Carrión | 692 | `data/beaches.json:5437` | `[0,8,1,5,3]` | `[6,3,0,2,7]` |
| Playa de Bahía | 662 | `data/beaches.json:6089` | `[0,1,5,8]` | `[6,0,2,7]` |
| Playa El Pedruchillo | 674 | `data/beaches.json:15314` | `[8,1,2,4,5,3]` | `[6,3,2,7]` |

The `con-chiringuito` collection filters on the service only (`src/lib/collections.ts:124`, `b.services.includes(SERVICE_CHIRINGUITO)`), and the explorer services filter does the same. Result: the beach page shows a "Chiringuito" tag, yet the beach is absent from `/colecciones/con-chiringuito` and from explorer results filtered by the Chiringuito service. The site contradicts itself.

The reverse check (service `6` without tag `7`) returns 0 beaches, so the mismatch is limited to these three.

`node scripts/validate-beaches.js` passes (`Errors: 0`, `Warnings: 0`), so the validator does not check tag/service consistency.

## Reproduction

```
$ jq '[.[] | select((.tags//[])|index(7)) | select((.services|index(6))|not) | .name]' data/beaches.json
["Playa Carrión", "Playa de Bahía", "Playa El Pedruchillo"]
```

## Suggested fix

Check each of the three beaches against a source (council beach page, Google Maps). Then either add service `6` or drop tag `7` in `data/beaches.json`, and migrate. Optionally add a warning to `scripts/validate-beaches.js` when tag `7` and service `6` disagree.
