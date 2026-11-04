---
id: TSK-163
title: Fix: Map raw waves enum to Spanish labels
status: pending
priority: P3
tags: [ui, bug, beach-detail]
created: 2026-11-04
source: report/RPT-064
depends-on: []
---

# Fix: Map raw waves enum to Spanish labels

## Description

`practical-info-card.tsx:139` renders `waves` unmapped, so visitors see `MODERADO`. TSK-137 may decide to remove this label, so check it first.

See `.backlog/reports/complete/RPT-064-raw-waves-enum-shown-on.md`.

## Acceptance Criteria

- [ ] Más detalles shows Spanish labels for every waves value
- [ ] Mapping lives in one shared presentation helper
- [ ] Unit test covers the mapping
- [ ] If TSK-137 removes the static label, this task is closed against that decision
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created