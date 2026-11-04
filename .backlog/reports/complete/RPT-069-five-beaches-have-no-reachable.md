---
id: RPT-069
title: Five beaches have no reachable page because their slugs collide
type: bug
severity: high
status: triaged
created: 2026-11-04
triaged: 2026-11-04
task-id: TSK-168
---

## Summary

`nameToSlug` builds beach slugs from the name alone, and same-name beaches in different municipalities share one slug. `getSlugToCodeMap` keeps the last row, so 5 of the 193 beaches have no page, and every link to them opens a different beach. Two of them are 2026 Blue Flag beaches in Águilas. This was recorded in LRN-015 and LRN-018 and left "to follow-up" in the TSK-124 evidence, but no task was filed.

## Details

| Slug | Beach with no page | Beach served on production (2026-11-05) |
|------|--------------------|-----------------------------------------|
| `playa-amarilla` | 586 Mazarrón | 615 Águilas |
| `playa-de-levante` | 693 Águilas (Blue Flag, Q) | 525 Cartagena |
| `playa-de-poniente` | 596 Águilas (Blue Flag, Q) | 564 San Javier |
| `playa-larga` | 627 Cartagena | 5907 Lorca |
| `playa-parazuelos` | 6703 Lorca | 633 Mazarrón |

- Cause: `src/lib/slugs.ts` (`nameToSlug`, `beachToSlug`) and `src/lib/db-data/beach-queries.ts:67` (`new Map(rows.map(...))`, last row wins).
- `/sitemap.xml` lists 193 `/playas/` URLs, only 188 of them unique.
- `src/lib/slugs.test.ts` only guards punctuation collisions, not same-name beaches.
- `docs/business-rules.md:86` proposes renaming one Parazuelos beach once a source settles the border. That covers one pair of five.

Related gap: the retired URL `/playas/cala-mijo.-(cueva-de-las-palomas)` returns 404 instead of a 301. Legacy slugs are derived from the current name, and TSK-123 removed the period from that name, so this URL can no longer be derived. The TSK-123 log records the route-level 301 as untested. Other retired slugs checked on production do return 301.

## Steps to Reproduce

1. Open https://www.playasmurcia.com/municipios/aguilas and follow the Playa de Levante link.
2. The page shows the Cartagena beach (`addressLocality` is Cartagena), not the Águilas Blue Flag beach.
3. Count `/playas/` entries in https://www.playasmurcia.com/sitemap.xml: 193 entries, 188 unique.

## Expected vs Actual

- Expected: each of the 193 beaches has its own URL, and links open that beach.
- Actual: 5 beaches have no page, and links to them open a same-name beach elsewhere.

## Error messages/logs

None. The wrong beach renders with status 200.
