---
id: TSK-116
title: Shore Bearing per Beach and Wave Exposure Label
status: pending
priority: P4
tags: [data, weather, beach-detail]
created: 2026-10-18
source: manual
depends-on: [TSK-115]
---

# Shore Bearing per Beach and Wave Exposure Label

## Description

Add a `shoreBearing` field (degrees, the direction the beach faces) to `data/beaches.json`, derived from coastline geometry or hand-curated. The existing `orientation` field is derived from latitude bands and has only 3 values (east, southeast, west), so it cannot drive this.

Compare `shoreBearing` with the Open-Meteo Marine `wave_direction` (added in TSK-115) to label the beach "resguardada" or "expuesta" next to the oleaje row. Update schema, migration script, validation script and docs.

Example from the X suggestion: Playa Amarilla (Águilas) has no waves with levante wind, but does with poniente or norte wind.

## Acceptance Criteria

- [ ] shoreBearing present and validated for all beaches, documented in docs/data-schema.md
- [ ] Method for deriving shoreBearing documented in docs/business-rules.md
- [ ] Detail page shows resguardada/expuesta based on bearing vs wave direction
- [ ] Playa Amarilla (Águilas) reads resguardada with levante waves and expuesta with poniente/norte waves
- [ ] Unit tests cover the exposure calculation
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created