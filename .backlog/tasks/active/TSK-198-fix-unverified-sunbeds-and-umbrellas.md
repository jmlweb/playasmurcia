---
id: TSK-198
title: Fix unverified sunbeds and umbrellas services
status: blocked
priority: P2
tags: [data, services, quality]
created: 2026-11-10
source: manual
depends-on: []
started: 2026-11-17
blocked-by: Criteria 3-4 need the production Turso migration run by hand with prod credentials (NODE_ENV=production pnpm tsx scripts/migrate-to-database.ts, then validate counts per LRN-046) and a check that /playas La Reya (code 648) no longer shows Hamacas; the unattended run has no prod access
---

# Fix unverified sunbeds and umbrellas services

## Description

Services were extracted by scripts/extract-services.js with gemma3:4b from beach descriptions, so the model guessed. 124 of 193 beaches showed Hamacas and 78 showed Sombrillas, including small calas like La Reya (Junta de los Mares).

Data cleared in data/beaches.json: sunbeds and umbrellas now stay only where the beach text mentions them (7 and 2). Validation passes.

Remaining: commit, run the Turso production migration by hand (CI does not migrate), verify the La Reya page. Optional follow-up: source real data (municipal concession lists) for rental beaches.

## Acceptance Criteria

- [x] data/beaches.json keeps sunbeds only where beach text mentions hamacas (7 beaches)
- [x] data/beaches.json keeps umbrellas only where beach text mentions sombrillas (2 beaches)
- [ ] Prod Turso migration run by hand
- [ ] La Reya page no longer shows Hamacas
- [x] docs/data-schema.md notes services are not verified for sunbeds and umbrellas

## Notes

## Learnings

- LRN-050: Unset NODE_ENV=production before local tests and DB seeding
- LRN-051: Type JSON-imported beach services as readonly number[] before includes
## Progress Log

- [2026-11-10] Created
- [2026-11-17] Started
- [2026-11-17] criterion 1 — evidence: pnpm vitest run src/lib/rental-services-data.test.ts → 'lists sunbeds only on the 7 beaches whose text mentions hamacas' passes; fails on pre-fix data (2026-11-17)
- [2026-11-17] criterion 2 — evidence: pnpm vitest run src/lib/rental-services-data.test.ts → 'lists umbrellas only on the 2 beaches whose text mentions sombrillas' passes; fails on pre-fix data (2026-11-17)
- [2026-11-17] criterion 5 — evidence: docs/data-schema.md services.json row and References note umbrellas (4) and sunbeds (5) as not verified → git diff docs/data-schema.md (2026-11-17)
- [2026-11-17] Blocked: Criteria 3-4 need the production Turso migration run by hand with prod credentials (NODE_ENV=production pnpm tsx scripts/migrate-to-database.ts, then validate counts per LRN-046) and a check that /playas La Reya (code 648) no longer shows Hamacas; the unattended run has no prod access