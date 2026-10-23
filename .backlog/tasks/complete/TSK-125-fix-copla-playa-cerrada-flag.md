---
id: TSK-125
title: Fix: COPLA 'PLAYA CERRADA' flag is mapped to 'Sin bandera'
status: complete
priority: P2
tags: [bug, beach-status]
created: 2026-10-21
source: report/RPT-052
depends-on: []
started: 2026-10-23
completed: 2026-10-23
---

# Fix: COPLA 'PLAYA CERRADA' flag is mapped to 'Sin bandera'

## Description

Closed beaches in the COPLA feed (`<bandera>PLAYA CERRADA</bandera>`) fall back to `SIN BANDERA` in `toBeachFlag` (`src/lib/beach-status-112.ts:133-138`), so the widget says "Sin bandera" and the cards drop the flag. See `.backlog/reports/complete/RPT-052-copla-playa-cerrada-flag-is.md`.

## Acceptance Criteria

- [x] BeachFlag and VALID_FLAGS in src/lib/beach-status-112.ts include PLAYA CERRADA
- [x] Beach status widget shows a distinct closed label and colour
- [x] getBatchBeachFlags keeps PLAYA CERRADA for listing cards
- [x] Unit test covers a PLAYA CERRADA fixture

## Notes

## Learnings

- LRN-023: COPLA reports beach closures in the bandera field, and unknown values silently become SIN BANDERA
## Progress Log

- [2026-10-21] Created
- [2026-10-23] Started
- [2026-10-23] criterion 1 — evidence: NODE_ENV=test pnpm vitest run src/lib/beach-status-112.test.ts → 'keeps PLAYA CERRADA entries as a closed beach' passes (failed before: expected 'SIN BANDERA' to be 'PLAYA CERRADA') (2026-10-23)
- [2026-10-23] criterion 2 — evidence: NODE_ENV=test pnpm vitest run src/features/beaches/beach-status-widget.test.tsx → 2 passed: label 'Playa cerrada', bg-rose-900 circle distinct from every other flag (both failed before the widget change) (2026-10-23)
- [2026-10-23] criterion 3 — evidence: NODE_ENV=test pnpm vitest run src/lib/beach-status-112.test.ts src/features/beaches/beach-card.test.tsx → 'keeps closed beaches for the listing cards' and 'shows the PLAYA CERRADA flag' pass (failed before) (2026-10-23)
- [2026-10-23] criterion 4 — evidence: PLAYA CERRADA fixtures in src/lib/beach-status-112.test.ts; full suite NODE_ENV=test pnpm test → 362 passed; pnpm build and pnpm check exit 0 (2026-10-23)
- [2026-10-23] Completed