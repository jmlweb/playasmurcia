---
id: TSK-123
title: Fix content defects: Los Alcázares email, La Concha copy, Cala Mijo name, slug punctuation
status: complete
priority: P2
tags: [data, seo]
created: 2026-10-18
source: RPT-051
depends-on: []
started: 2026-10-19
completed: 2026-10-19
---

# Fix content defects: Los Alcázares email, La Concha copy, Cala Mijo name, slug punctuation

## Description

### Description

Content defects visible to users: a suspicious contact email on 7 Los Alcázares beaches, broken description copy on Playa de La Concha, a stray period in a beach name, and parentheses in slugs.

See .backlog/reports/complete/RPT-051-contentdata-issues-visible-in-ui.md for details.

## Acceptance Criteria

- [ ] turismo@ayto.di3d.es verified against the official Los Alcázares council site and corrected on all 7 beaches (or removed if no official address)
- [ ] Playa de La Concha description reads grammatically; other descriptions audited for the "… y socorrista." pattern
- [ ] "Cala Mijo. (Cueva de las Palomas)" renamed without the stray period
- [ ] Slug generation strips parentheses and periods; old slugs 301-redirect to new ones
- [ ] node scripts/validate-beaches.js passes; production Turso migrated before push
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

- LRN-014: Worktree agents must call /usr/bin/git
- LRN-015: Beach slugs are not globally unique
## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-19] Completed with criteria unticked: user directed completion after merge; build/test/check re-run green on merged main, production migration run by user, pushed; route-level 301 untested
- [2026-10-19] Completed