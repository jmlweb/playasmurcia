---
id: TSK-192
title: Rewrite the 65 descriptions that quote the OSM length
status: blocked
priority: P2
tags: [content, data]
created: 2026-11-09
source: report/RPT-081
depends-on: []
started: 2026-11-11
blocked-by: Criterion 3 needs the production Turso migration (NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts), which the maintainer must run by hand before merging; this unattended run has no authorization to write to production
---

# Rewrite the 65 descriptions that quote the OSM length

## Description

65 beach descriptions in data/beaches.json state the OSM length in prose (Cala Abierta: 'Son 173 metros') while the page shows a different ITREM length beside it (80 m). Find them by matching each beach's own length figure in its description against officialLength in data/beach-dimensions.json. Edit by hand: some sentences build on the number ('una de las más largas'), so a search-and-replace is not enough. Migrate Turso by hand before pushing. Source: .backlog/reports/complete/RPT-081-full-site-review-2026-11-09-findings.md.

## Acceptance Criteria

- [x] No description states a length that differs from the figure the beach page shows
- [x] node scripts/validate-beaches.js passes
- [ ] Production Turso migrated before the push

## Notes

## Learnings

- LRN-048: Length claims in descriptions hide behind km rounding; match near the OSM figure, compare as the page rounds
## Progress Log

- [2026-11-09] Created
- [2026-11-11] Started
- [2026-11-11] criterion 1 — evidence: new validate-beaches.js rule (stated length vs getDisplayLength, figures within 15% of OSM length) failed with 79 errors on main, 0 after rewriting 79 descriptions; full scan of description + translations leaves only 2 distances (Cala Cortina 4 km road, La Isla 700 m walk) (2026-11-11)
- [2026-11-11] criterion 2 — evidence: node scripts/validate-beaches.js → Errors: 0, Warnings: 0; pnpm build, pnpm check, pnpm test (695 passed) green (2026-11-11)
- [2026-11-11] Blocked: Criterion 3 needs the production Turso migration (NODE_ENV=production pnpm tsx --env-file=.env scripts/migrate-to-database.ts), which the maintainer must run by hand before merging; this unattended run has no authorization to write to production