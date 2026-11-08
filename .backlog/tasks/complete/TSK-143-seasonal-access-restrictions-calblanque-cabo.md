---
id: TSK-143
title: Seasonal access restrictions (Calblanque, Cabo Cope, Cala Cerrada)
status: complete
priority: P4
tags: [data, access]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Seasonal access restrictions (Calblanque, Cabo Cope, Cala Cerrada)

## Description

Some beaches have summer car-access limits and shuttle buses published each year by the Ayuntamientos or CARM. Store them with source and year.

## Acceptance Criteria

- [x] Seasonal access-restriction field added to the schema and docs — evidence: data/access-restrictions.json bundled via src/lib/beach-notices.ts (no DB column, LRN-027); docs/data-schema.md and business-rules.md (2026-11-08)
- [x] Filled for every beach with a published restriction (dates, car limits, shuttle bus) — evidence: 23 beaches: Calblanque (BORM Orden 25-03-2026 + Calblanque 440 shuttle), Calnegre (ordering service, no ban), Cuatro Calas (2026 barriers, no dates) (2026-11-08)
- [x] Source year shown so out-of-date data is visible — evidence: AccessRestrictionNotice shows Acceso en verano (2026) and the source; Playwright on /playas/playa-de-calblanque (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-04] If this adds beaches columns, migrate Turso by hand before pushing: production breaks otherwise (LRN-027).
- [2026-11-08] Started
- [2026-11-08] Cabo Cope: no published restriction found. Cala Cerrada: only the regional Cuatro Calas measures of July 2026.
- [2026-11-08] Completed