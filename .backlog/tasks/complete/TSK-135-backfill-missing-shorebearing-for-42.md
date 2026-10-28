---
id: TSK-135
title: Finish or revert the uncommitted shoreBearing recompute
status: complete
priority: P2
tags: [data]
created: 2026-10-28
source: manual
depends-on: []
completed: 2026-10-28
started: 2026-10-28
---

# Finish or revert the uncommitted shoreBearing recompute

## Description

At `HEAD` (435abd7) all 193 beaches have a `shoreBearing`. An uncommitted edit to `data/beaches.json` recomputes the values: it removes `shoreBearing` from 42 beaches and shifts others, some sharply (for example 49 to 190, 305 to 257). With that edit, `node scripts/validate-beaches.js` fails (`shoreBearing must be an integer in [0, 359]`). Decide whether the recompute is an improvement, complete it for the 42 beaches it dropped, or revert it.

## Acceptance Criteria

- [x] 193/193 beaches have shoreBearing — evidence: git restore data/beaches.json; HEAD has 193/193 shoreBearing (2026-10-28)
- [x] Every value that moved more than 30° from `HEAD` is checked against the map — evidence: No values moved: HEAD values (hand-reviewed in TSK-116) kept (2026-10-28)
- [x] node scripts/validate-beaches.js passes — evidence: node scripts/validate-beaches.js → 193 beaches, 0 errors (2026-10-28)
- [x] Method used is documented in `docs/business-rules.md` (Shore Bearing) — evidence: Method already documented in docs/business-rules.md Shore Bearing (2026-10-28)

## Notes

## Learnings

## Progress Log

- [2026-10-28] Created
- [2026-10-28] Reworded: the 42-beach gap exists only in the uncommitted recompute, not at `HEAD`
- [2026-10-28] Reverted the Oct 20 10:40 uncommitted recompute: it dropped 42 values, skipped the hand-review step, and broke the >90° orientation rule on Cala Botella (49→190) and Las Antillas (302→4). Backup of the reverted file kept outside the repo.
- [2026-10-28] Completed
