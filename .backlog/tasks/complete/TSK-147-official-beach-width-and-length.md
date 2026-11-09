---
id: TSK-147
title: Official beach width and length from ITREM; review OSM length
status: complete
priority: P3
tags: [data, external-source, cleanup]
created: 2026-11-04
source: manual
depends-on: []
started: 2026-11-09
completed: 2026-11-09
---

# Official beach width and length from ITREM; review OSM length

## Description

ITREM beach pages publish length and average width for 145 beaches. We do not store width today. Measured widths run from 5 m to 110 m, with a median of 18 m. Playa del Espejo uses a range (`20-35`), so a digits-only parse yields a wrong 2035.

Our `length` comes from OSM and differs by more than 2x from the ITREM length on 96 of 145 beaches. Cala Cortina is 410 m here and 210 m officially; Cala del Cuartel del Ciscar is 171 m here and 20 m officially. This fits the OSM-merge warning in `docs/business-rules.md`. Neither source has been established as correct.

Keep `length` untouched and add sourced `officialWidth` and `officialLength` fields. Do not overwrite `length`.

## Acceptance Criteria

- [x] officialWidth and officialLength stored for the 145 beaches with data, with ranges such as 20-35 handled — evidence: data/beach-dimensions.json: 154 beaches with officialLength and officialWidth; 690 El Espejo keeps officialWidthRange [20,35]; beach-dimensions.test.ts (2026-11-09)
- [x] Report lists the 96 beaches where length differs by more than 2x from the official value — evidence: .backlog/reports/complete/RPT-080-osm-vs-itrem-beach-length.md lists the 102 beaches over 2x (not 96: the recount after fixing the thousands-separator parse) (2026-11-09)
- [x] Decision recorded on which length the UI shows — evidence: docs/business-rules.md Beach Length and Width: page and score show the ITREM length labelled (ITREM), OSM as fallback; OSM length kept untouched (2026-11-09)
- [x] Recommendation score impact checked, since length weighs 15% — evidence: 135 beaches change score; top 10 reshuffles (679 Calarreona 1st → 6th, 660 Las Delicias 1st); hand-picked home slots unaffected; recorded in RPT-080 (2026-11-09)
- [x] Retained script or data source documented — evidence: scripts/fetch-itrem-dimensions.ts documented in docs/development.md and data-schema.md (2026-11-09)

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).
- [2026-11-09] Started
- [2026-11-09] First parse read 1.963 m as 1 m (Spanish thousands dot); fixed before the report.
- [2026-11-09] Completed