---
id: TSK-141
title: Accessible beaches: assisted bathing and amphibious chairs
status: complete
priority: P3
tags: [data, accessibility]
created: 2026-10-28
source: manual
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Accessible beaches: assisted bathing and amphibious chairs

## Description

Add the regional and municipal accessible-beach lists (assisted bathing, amphibious chairs, accessible walkways) as structured data, with season dates and hours where published. Today accessibility is only the `wheelchair-ramp` service.

## Acceptance Criteria

- [x] Each entry cites its source and season — evidence: data/accessibility.json: 67 ITREM/FAMDIF sheets, each with sourceUrl, year 2026, season and hours where published (scripts/fetch-beach-accessibility.ts) (2026-11-08)
- [x] Assisted bathing shown as a service distinct from wheelchair-ramp — evidence: assisted-bathing service (index 9) set on the 14 beaches with staff-assisted bathing; AccessibilityPanel distinguishes staff vs chair loan; accessibility.test.ts (2026-11-08)
- [x] The Accesible collection uses the new data — evidence: collections.ts accesibles filterFn includes SERVICE_ASSISTED_BATHING (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-11-08] Started
- [2026-11-08] Research (agent, 2026-11-08): regional press list of 17 assisted-bathing beaches; sheets also mark Barnuevo, La Azohía-El Cuartel and El Lastre. Cruz Roja is not the operator anywhere. Prod migrated, validate-migration 18/18.
- [2026-11-08] Completed