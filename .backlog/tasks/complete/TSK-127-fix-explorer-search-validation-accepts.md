---
id: TSK-127
title: Fix: Explorer search validation accepts empty, unknown and prototype-key filter values
status: complete
priority: P4
tags: [bug, explorer]
created: 2026-10-21
source: report/RPT-054
depends-on: []
started: 2026-11-07
completed: 2026-11-07
---

# Fix: Explorer search validation accepts empty, unknown and prototype-key filter values

## Description

`parseNumberArray` and `parseEnumArray` (`src/lib/explorer-search.ts:15-40`) turn `?municipality=` into `[0]`, accept non-integers such as `1.5`, and accept inherited keys like `toString`. Unknown ids are no longer a problem: `dropUnknownFilterIds` removes them since edc38fb. See `.backlog/reports/complete/RPT-054-explorer-search-validation-accepts-empty.md`.

## Acceptance Criteria

- [x] parseNumberArray rejects empty strings and non-integer or negative values
- [x] parseEnumArray uses an own-property check so prototype keys are rejected
- [x] Unit tests cover ?municipality=, ?municipality=1.5 and ?accessDifficulty=toString

## Notes

## Learnings

## Progress Log

- [2026-10-21] Created
- [2026-11-07] Started
- [2026-11-07] parseId accepts only finite non-negative integers from non-blank strings or numbers; parseEnumArray uses Object.hasOwn; tests for empty, 1.5, negative, toString/constructor. Commit a78f861, merged 11ebd56.
- [2026-11-07] Completed