---
id: TSK-147
title: Official beach width and length from ITREM; review OSM length
status: pending
priority: P3
tags: [data, external-source, cleanup]
created: 2026-11-04
source: manual
depends-on: []
---

# Official beach width and length from ITREM; review OSM length

## Description

ITREM beach pages publish length and average width for 145 beaches. We do not store width today. Measured widths run from 5 m to 110 m, with a median of 18 m. Playa del Espejo uses a range (`20-35`), so a digits-only parse yields a wrong 2035.

Our `length` comes from OSM and differs by more than 2x from the ITREM length on 96 of 145 beaches. Cala Cortina is 410 m here and 210 m officially; Cala del Cuartel del Ciscar is 171 m here and 20 m officially. This fits the OSM-merge warning in `docs/business-rules.md`. Neither source has been established as correct.

Keep `length` untouched and add sourced `officialWidth` and `officialLength` fields. Do not overwrite `length`.

## Acceptance Criteria

- [ ] officialWidth and officialLength stored for the 145 beaches with data, with ranges such as 20-35 handled
- [ ] Report lists the 96 beaches where length differs by more than 2x from the official value
- [ ] Decision recorded on which length the UI shows
- [ ] Recommendation score impact checked, since length weighs 15%
- [ ] Retained script or data source documented

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).