---
id: TSK-161
title: Fix: Family signals contradict childSafe
status: active
priority: P2
tags: [data, content, bug]
created: 2026-11-04
source: report/RPT-062
depends-on: []
started: 2026-11-05
---

# Fix: Family signals contradict childSafe

## Description

68 of 141 `familiar` beaches and 10 of 34 beaches with "familias" in `metaDescription` have `childSafe: false`. Decide what each signal means, then correct the data.

See `.backlog/reports/complete/RPT-062-family-signals-contradict-childsafe-across.md`.

## Acceptance Criteria

- [ ] A rule is recorded in docs/business-rules.md for how familiar and childSafe relate
- [ ] No beach with childSafe false says Ideal para familias in metaDescription
- [ ] Familiar tags and the playas-familiares collection follow the recorded rule
- [ ] node scripts/validate-beaches.js passes
- [ ] Turso migration steps are run before pushing
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created
- [2026-11-05] Started