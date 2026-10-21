---
id: TSK-127
title: Fix: Explorer search validation accepts empty, unknown and prototype-key filter values
status: pending
priority: P4
tags: [bug, explorer]
created: 2026-10-21
source: report/RPT-054
depends-on: []
---

# Fix: Explorer search validation accepts empty, unknown and prototype-key filter values

## Description

`validateSearch` (`src/lib/explorer-search.ts:11-36`) turns `?municipality=` into `[0]` (Cartagena), passes unknown ids that hide every chip and the "Limpiar todo" button, and accepts inherited keys like `toString`. See `.backlog/reports/complete/RPT-054-explorer-search-validation-accepts-empty.md`.

## Acceptance Criteria

- [ ] parseNumberArray rejects empty strings and non-integer or negative values
- [ ] parseEnumArray uses an own-property check so prototype keys are rejected
- [ ] Unit tests cover ?municipality=, ?municipality=1.5 and ?accessDifficulty=toString

## Notes

## Learnings

## Progress Log

- [2026-10-21] Created