---
id: TSK-180
title: Fix: Shared flagGreen URL loses the filter before flags settle
status: pending
priority: P4
tags: [bug, explorer]
created: 2026-11-07
source: report/RPT-078
depends-on: []
---

# Fix: Shared flagGreen URL loses the filter before flags settle

## Description

`src/routes/explorar/index.tsx:160-169` drops `flagGreen` until flags settle. If the user interacts first, the next URL write loses the filter from a shared link. See `.backlog/reports/complete/RPT-078-impeccable-audit-of-the-explorer.md`.

## Acceptance Criteria

- [ ] Interacting before flags settle keeps flagGreen in the URL
- [ ] Results still ignore flagGreen while flags are unavailable
- [ ] Regression test covers the early interaction

## Notes

## Learnings

## Progress Log

- [2026-11-07] Created