---
id: TSK-126
title: Fix: Nearby beaches lose their distance order
status: complete
priority: P3
tags: [bug, beach-detail]
created: 2026-10-21
source: report/RPT-053
depends-on: []
started: 2026-10-25
completed: 2026-10-25
---

# Fix: Nearby beaches lose their distance order

## Description

`getNearbyBeaches` (`src/lib/db-data/beach-queries.ts:213-228`) uses `inArray`, which returns rows in table order; 191 of 193 beaches get their distance-sorted `nearby` list reordered. See `.backlog/reports/complete/RPT-053-nearby-beaches-lose-their-distance.md`.

## Acceptance Criteria

- [x] getNearbyBeaches returns beaches in the order of its codes argument
- [x] Unit test asserts output order matches input order
- [x] Playas cercanas carousel shows the closest beach first

## Notes

## Learnings

- LRN-024: Drizzle inArray returns table order, so lookups by a code list must re-order
## Progress Log

- [2026-10-21] Created
- [2026-10-25] Started
- [2026-10-25] criterion 1 — evidence: pnpm vitest run src/lib/db-data.test.ts → getNearbyBeaches order tests failed before the fix (table order), pass after re-ordering by codes (2026-10-25)
- [2026-10-25] criterion 2 — evidence: src/lib/db-data.test.ts asserts output codes equal the input codes, forward and reversed, and skip unknown codes; pnpm test → 366 passed (2026-10-25)
- [2026-10-25] criterion 3 — evidence: getNearbyBeaches(Cala Abierta nearby) returns Cala Cerrada (0.09 km) first; nearby-carousel.test.tsx proves the carousel renders items in received order; loader maps without sorting. Live dev page not rendered: workerd rejects file: DB URLs and turso CLI is not installed (2026-10-25)
- [2026-10-25] Completed