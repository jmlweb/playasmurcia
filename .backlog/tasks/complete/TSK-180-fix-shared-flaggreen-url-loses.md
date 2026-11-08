---
id: TSK-180
title: Fix: Shared flagGreen URL loses the filter before flags settle
status: complete
priority: P4
tags: [bug, explorer]
created: 2026-11-07
source: report/RPT-078
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Fix: Shared flagGreen URL loses the filter before flags settle

## Description

`src/routes/explorar/index.tsx:160-169` drops `flagGreen` until flags settle. If the user interacts first, the next URL write loses the filter from a shared link. See `.backlog/reports/complete/RPT-078-impeccable-audit-of-the-explorer.md`.

## Acceptance Criteria

- [x] Interacting before flags settle keeps flagGreen in the URL — evidence: keepUnsettledFlagGreen in src/lib/explorer-search.ts, applied in updateFilters (2026-11-08)
- [x] Results still ignore flagGreen while flags are unavailable — evidence: filters memo still strips flagGreen while !flagGreenAvailable (unchanged) (2026-11-08)
- [x] Regression test covers the early interaction — evidence: explorer-search.test.ts keepUnsettledFlagGreen suite → pnpm test exit 0 (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created
- [2026-11-08] Started
- [2026-11-08] Commit 729a5b0. Clear all bypasses the carry-over on purpose.
- [2026-11-08] Completed