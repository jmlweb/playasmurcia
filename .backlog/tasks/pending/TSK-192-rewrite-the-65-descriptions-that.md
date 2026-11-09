---
id: TSK-192
title: Rewrite the 65 descriptions that quote the OSM length
status: pending
priority: P2
tags: [content, data]
created: 2026-11-09
source: report/RPT-081
depends-on: []
---

# Rewrite the 65 descriptions that quote the OSM length

## Description

65 beach descriptions in data/beaches.json state the OSM length in prose (Cala Abierta: 'Son 173 metros') while the page shows a different ITREM length beside it (80 m). Find them by matching each beach's own length figure in its description against officialLength in data/beach-dimensions.json. Edit by hand: some sentences build on the number ('una de las más largas'), so a search-and-replace is not enough. Migrate Turso by hand before pushing. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [ ] No description states a length that differs from the figure the beach page shows
- [ ] node scripts/validate-beaches.js passes
- [ ] Production Turso migrated before the push

## Notes

## Learnings

## Progress Log

- [2026-11-09] Created