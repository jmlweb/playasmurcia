---
id: TSK-166
title: Fix: Beach detail copy and accessibility defects
status: pending
priority: P4
tags: [ui, bug, accessibility]
created: 2026-11-04
source: report/RPT-067
depends-on: []
---

# Fix: Beach detail copy and accessibility defects

## Description

Fix the small defects on beach detail: casing of "Rampa Accesible", 20px contact links, generic gallery alt text, English Leaflet labels, and possibly weak breadcrumb contrast. Changing `data/services.json` needs a migration before pushing.

See `.backlog/reports/complete/RPT-067-small-copy-and-accessibility-defects.md`.

## Acceptance Criteria

- [ ] Service name reads Rampa accesible in data, tests and the migrated database
- [ ] Contact links are at least 24px tall
- [ ] Gallery alt text describes each scene or a clear alternative is recorded
- [ ] Leaflet controls expose Spanish labels
- [ ] Hero breadcrumb contrast is measured and fixed if below 4.5:1
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-11-04] Created