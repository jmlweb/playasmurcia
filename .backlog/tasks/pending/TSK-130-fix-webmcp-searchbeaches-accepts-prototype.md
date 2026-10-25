---
id: TSK-130
title: Fix: WebMCP search_beaches accepts prototype keys as accessDifficulty and occupancy
status: pending
priority: P4
tags: []
created: 2026-10-25
source: report/RPT-057
depends-on: []
---

# Fix: WebMCP search_beaches accepts prototype keys as accessDifficulty and occupancy

## Description

`asEnum` (`src/features/webmcp/tool-input.ts:51-58`) uses `value in allowed`, so prototype keys such as `toString` pass as `accessDifficulty`/`occupancy` and the WebMCP search returns an empty list. See `.backlog/reports/complete/RPT-057-webmcp-searchbeaches-accepts-prototype-keys.md`. Sibling of TSK-127.

## Acceptance Criteria

- [ ] asEnum uses an own-property check so prototype keys are rejected
- [ ] parseSearchInput({ accessDifficulty: "toString", occupancy: "constructor" }) leaves both fields undefined
- [ ] Unit test in the tool-input tests covers prototype keys

## Notes

## Learnings

## Progress Log

- [2026-10-25] Created