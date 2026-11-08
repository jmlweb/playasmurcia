---
id: TSK-130
title: Fix: WebMCP search_beaches accepts prototype keys as accessDifficulty and occupancy
status: complete
priority: P4
tags: [bug, webmcp]
created: 2026-10-25
source: report/RPT-057
depends-on: []
started: 2026-11-08
completed: 2026-11-08
---

# Fix: WebMCP search_beaches accepts prototype keys as accessDifficulty and occupancy

## Description

`asEnum` (`src/features/webmcp/tool-input.ts:51-58`) uses `value in allowed`, so prototype keys such as `toString` pass as `accessDifficulty`/`occupancy` and the WebMCP search returns an empty list. See `.backlog/reports/complete/RPT-057-webmcp-searchbeaches-accepts-prototype-keys.md`. Sibling of TSK-127.

## Acceptance Criteria

- [x] asEnum uses an own-property check so prototype keys are rejected — evidence: Object.hasOwn in asEnum, src/features/webmcp/tool-input.ts (2026-11-08)
- [x] parseSearchInput({ accessDifficulty: "toString", occupancy: "constructor" }) leaves both fields undefined — evidence: tool-input.test.ts rejects prototype keys → pnpm test exit 0 (2026-11-08)
- [x] Unit test in the tool-input tests covers prototype keys — evidence: tool-input.test.ts: rejects prototype keys as enum values (2026-11-08)

## Notes

## Learnings

## Progress Log

- [2026-10-25] Created
- [2026-11-08] Started
- [2026-11-08] Commit 35f16c2. pnpm test, pnpm check exit 0.
- [2026-11-08] Completed