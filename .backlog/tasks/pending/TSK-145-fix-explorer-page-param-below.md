---
id: TSK-145
title: Fix: Explorer page param below 1 renders an empty results grid
status: pending
priority: P4
tags: [bug, explorer]
created: 2026-11-03
source: report/RPT-061
depends-on: []
---

# Fix: Explorer page param below 1 renders an empty results grid

## Description

`validateSearch` (`src/lib/explorer-search.ts:66-67`) checks `page > 0` before flooring, so `?page=0.5` becomes `page: 0`. `src/routes/explorar/index.tsx:100` keeps `0` (`??`), and the slice at lines 158-161 becomes `slice(-15, 0)`, an empty grid while the summary still counts every match.

Fix: floor first, then accept only values `>= 1`. Add a regression test.

Report: `.backlog/reports/complete/RPT-061-explorer-page-param-below-1.md`

## Acceptance Criteria

- [ ] validateSearch returns page only when Math.floor(page) is a finite integer >= 1
- [ ] /explorar?page=0.5 shows the first page of results
- [ ] src/lib/explorer-search.test.ts covers page 0.5 and page 0
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-03] Created