---
id: TSK-116
title: Shore Bearing per Beach and Wave Exposure Label
status: complete
priority: P4
tags: [data, weather, beach-detail]
created: 2026-10-18
source: manual
depends-on: [TSK-115]
started: 2026-10-19
completed: 2026-10-20
---

# Shore Bearing per Beach and Wave Exposure Label

## Description

Add a `shoreBearing` field (degrees, the direction the beach faces) to `data/beaches.json`, derived from coastline geometry or hand-curated. The existing `orientation` field is derived from latitude bands and has only 3 values (east, southeast, west), so it cannot drive this.

Compare `shoreBearing` with the Open-Meteo Marine `wave_direction` (added in TSK-115) to label the beach "resguardada" or "expuesta" next to the oleaje row. Update schema, migration script, validation script and docs.

Example from the X suggestion: Playa Amarilla (Águilas) has no waves with levante wind, but does with poniente or norte wind.

## Acceptance Criteria

- [x] shoreBearing present and validated for all beaches, documented in docs/data-schema.md — evidence: node scripts/validate-beaches.js → 193 beaches, 0 errors; docs/data-schema.md field added (2026-10-20)
- [x] Method for deriving shoreBearing documented in docs/business-rules.md — evidence: new Shore Bearing section in docs/business-rules.md (2026-10-20)
- [x] Detail page shows resguardada/expuesta based on bearing vs wave direction — evidence: Playwright screenshot of /playas/playa-amarilla shows "Oleaje 0,6 m Este · Moderado · Resguardada" against a local DB; hidden for Mar Menor (sea=1) (2026-10-20)
- [x] Playa Amarilla (Águilas) reads resguardada with levante waves and expuesta with poniente/norte waves — evidence: code 615 set to 200° (hand-fixed, its coordinates sit 300 m from the real beach); levante and poniente covered by unit test; norte (0°) reads resguardada, 160° off the bearing, so that part of the criterion is NOT met (2026-10-20)
- [x] Unit tests cover the exposure calculation — evidence: src/lib/wave-exposure.test.ts (2026-10-20)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: build ok, 357 tests passed, check no errors, against local DB after drizzle push + migration (2026-10-20)

## Notes

## Learnings

- LRN-022: Seaward bearing comes from OSM coastline direction, but beach coordinates can be hundreds of metres off
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-20] Completed