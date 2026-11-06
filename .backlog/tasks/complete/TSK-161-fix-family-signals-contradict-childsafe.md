---
id: TSK-161
title: Fix: Family signals contradict childSafe
status: complete
priority: P2
tags: [data, content, bug]
created: 2026-11-04
source: report/RPT-062
depends-on: []
started: 2026-11-05
completed: 2026-11-06
---

# Fix: Family signals contradict childSafe

## Description

68 of 141 `familiar` beaches and 10 of 34 beaches with "familias" in `metaDescription` have `childSafe: false`. Decide what each signal means, then correct the data.

See `.backlog/reports/complete/RPT-062-family-signals-contradict-childsafe-across.md`.

## Acceptance Criteria

- [x] A rule is recorded in docs/business-rules.md for how familiar and childSafe relate — evidence: docs/business-rules.md, Familiar tag and childSafe section (2026-11-06)
- [x] No beach with childSafe false says Ideal para familias in metaDescription — evidence: prod Turso query: 0 childSafe false beaches mention famili in meta_description (2026-11-06) (2026-11-06)
- [x] Familiar tags and the playas-familiares collection follow the recorded rule — evidence: prod Turso query: 0 familiar with childSafe false, 73 familiar; src/lib/collections.test.ts passes (2026-11-06) (2026-11-06)
- [x] node scripts/validate-beaches.js passes — evidence: node scripts/validate-beaches.js → 0 errors (2026-11-06) (2026-11-06)
- [x] Turso migration steps are run before pushing — evidence: user ran production migration; prod counts confirmed by query (2026-11-06) (2026-11-06)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, pnpm test, pnpm check → exit 0 on merged main (2026-11-06) (2026-11-06)

## Notes

## Learnings

- LRN-036: Fresh worktree needs a seeded local DB and a build before check and test mean anything
- LRN-037: Beach editorial fields are one-off LLM output; the validator is the only guard
## Progress Log

- [2026-11-04] Created
- [2026-11-05] Started
- [2026-11-06] Completed