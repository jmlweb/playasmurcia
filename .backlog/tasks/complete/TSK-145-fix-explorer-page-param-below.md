---
id: TSK-145
title: Fix: Explorer page param below 1 renders an empty results grid
status: complete
priority: P4
tags: [bug, explorer]
created: 2026-11-03
source: report/RPT-061
depends-on: [TSK-127]
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Explorer page param below 1 renders an empty results grid

## Description

`parsePage` (`src/lib/explorer-search.ts:55-57`) checks `page > 0` before flooring, so `?page=0.5` becomes `page: 0`. `src/routes/explorar/index.tsx:191` keeps `0` (`??`), which gives an empty grid while the summary still counts every match. `validateListingSearch` uses the same parser, so collections and municipalities need checking too.

Fix: floor first, then accept only values `>= 1`. Add a regression test.

Report: `.backlog/reports/complete/RPT-061-explorer-page-param-below-1.md`

## Acceptance Criteria

- [x] validateSearch returns page only when Math.floor(page) is a finite integer >= 1
- [x] /explorar?page=0.5 shows the first page of results, and collection and municipality listings do too
- [x] src/lib/explorer-search.test.ts covers page 0.5 and page 0
- [x] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-03] Created
- [2026-11-04] Depends on TSK-127: both edit validateSearch, so ship them together.
- [2026-11-07] Started
- [2026-11-07] parsePage floors first, then accepts integers >= 1. /explorar, /colecciones/calas-escondidas and /municipios/cartagena verified with page=0.5 (municipio redirects 307 to the clean URL). Tests for 0.5 and 0. Commit bc3a771, merged 11ebd56. build/check/test green.
- [2026-11-07] Completed