---
id: TSK-138
title: Expand aemetId coverage
status: complete
priority: P4
tags: [data, weather]
created: 2026-10-28
source: manual
depends-on: [TSK-144]
started: 2026-11-08
completed: 2026-11-08
---

# Expand aemetId coverage

## Description

Only 64 of 193 beaches have an `aemetId`. Match more beaches against the AEMET beach catalogue so more beaches get the official forecast.

## Acceptance Criteria

- [x] New aemetId values are matched by name and coordinates, never by name alone — evidence: Nearest AEMET catalogue point (Playas_codigos.csv, 30 Murcia points) by coordinates within the existing 2.37 km rule; no name matching (2026-11-08)
- [x] Each new ID returns a valid AEMET forecast — evidence: All 22 distinct new IDs return estado 200 and a datos payload from opendata.aemet.es (curl loop, 2026-11-08) (2026-11-08)
- [x] Coverage before and after reported in the task log — evidence: Coverage 64 → 126 of 193 beaches (62 new); 67 beaches have no point within 2.37 km and keep Open-Meteo (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-04] Lowered to P4 and made dependent on TSK-144: new IDs show nothing until the parser works, and Open-Meteo already covers every beach.
- [2026-11-08] Started
- [2026-11-08] Rule and counts recorded in docs/business-rules.md (AEMET: ID assignment).
- [2026-11-08] Completed