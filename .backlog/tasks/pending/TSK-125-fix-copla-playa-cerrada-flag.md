---
id: TSK-125
title: Fix: COPLA 'PLAYA CERRADA' flag is mapped to 'Sin bandera'
status: pending
priority: P2
tags: [bug, beach-status]
created: 2026-10-21
source: report/RPT-052
depends-on: []
---

# Fix: COPLA 'PLAYA CERRADA' flag is mapped to 'Sin bandera'

## Description

Closed beaches in the COPLA feed (`<bandera>PLAYA CERRADA</bandera>`) fall back to `SIN BANDERA` in `toBeachFlag` (`src/lib/beach-status-112.ts:133-138`), so the widget says "Sin bandera" and the cards drop the flag. See `.backlog/reports/complete/RPT-052-copla-playa-cerrada-flag-is.md`.

## Acceptance Criteria

- [ ] BeachFlag and VALID_FLAGS in src/lib/beach-status-112.ts include PLAYA CERRADA
- [ ] Beach status widget shows a distinct closed label and colour
- [ ] getBatchBeachFlags keeps PLAYA CERRADA for listing cards
- [ ] Unit test covers a PLAYA CERRADA fixture

## Notes

## Learnings

## Progress Log

- [2026-10-21] Created