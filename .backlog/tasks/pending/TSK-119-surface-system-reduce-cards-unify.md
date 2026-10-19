---
id: TSK-119
title: Surface system: reduce cards, unify card titles and footer colors
status: pending
priority: P3
tags: [styling, frontend]
created: 2026-10-18
source: RPT-047
depends-on: []
---

# Surface system: reduce cards, unify card titles and footer colors

## Description

### Description

Nearly every block is a white rounded card with shadow, so nothing stands out. Card title typography differs between pages, and the footer styles plain text in the link color.

See .backlog/reports/complete/RPT-047-ui-review-2026-10-19-cross-cutting-findings.md (Important: over-carding, footer; Refinement: typography, footer list) for the full directive.

## Acceptance Criteria

- [ ] Static content sections on beach detail (description, services, activities, cómo llegar, contacto) render unboxed with 1px gray-200 dividers and 48px vertical rhythm; card surface reserved for clickable items
- [ ] Card titles use sans 600 everywhere (municipality cards on /municipios no longer serif); serif reserved for page/section headings
- [ ] Footer brand paragraph uses ocean-200 (not link color); footer count pills reach >= 4.5:1 or are replaced by inline counts
- [ ] Footer collections list matches the collections index or is labelled as featured
- [ ] Visual check on /, /municipios, /playas/playa-de-la-concha, desktop + mobile
- [ ] pnpm build, pnpm test and pnpm check pass

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created