---
id: TSK-119
title: Surface system: reduce cards, unify card titles and footer colors
status: complete
priority: P3
tags: [styling, frontend]
created: 2026-10-18
source: RPT-047
depends-on: []
started: 2026-10-19
completed: 2026-10-19
---

# Surface system: reduce cards, unify card titles and footer colors

## Description

### Description

Nearly every block is a white rounded card with shadow, so nothing stands out. Card title typography differs between pages, and the footer styles plain text in the link color.

See .backlog/reports/complete/RPT-047-ui-review-2026-10-19-cross-cutting-findings.md (Important: over-carding, footer; Refinement: typography, footer list) for the full directive.

## Acceptance Criteria

- [x] Static content sections on beach detail (description, services, activities, cómo llegar, contacto) render unboxed with 1px gray-200 dividers and 48px vertical rhythm; card surface reserved for clickable items — evidence: manual: beach-detail screenshot desktop+mobile, unboxed sections with hairlines (2026-10-20) (2026-10-19)
- [x] Card titles use sans 600 everywhere (municipality cards on /municipios no longer serif); serif reserved for page/section headings — evidence: manual: /municipios card titles font-sans font-semibold; colecciones titles semibold (2026-10-20) (2026-10-19)
- [x] Footer brand paragraph uses ocean-200 (not link color); footer count pills reach >= 4.5:1 or are replaced by inline counts — evidence: manual: footer screenshot, paragraph and pills ocean-200 (2026-10-20) (2026-10-19)
- [x] Footer collections list matches the collections index or is labelled as featured — evidence: manual: footer label "Colecciones destacadas" (2026-10-20) (2026-10-19)
- [x] Visual check on /, /municipios, /playas/playa-de-la-concha, desktop + mobile — evidence: manual: screenshots of /, /municipios, /playas/playa-de-la-concha desktop+mobile (2026-10-20) (2026-10-19)
- [x] pnpm build, pnpm test and pnpm check pass — evidence: pnpm build, test, check → exit 0 (2026-10-20) (2026-10-19)

## Notes

## Learnings

## Progress Log

- [2026-10-18] Created
- [2026-10-19] Started
- [2026-10-19] Implemented surface system changes; docs/ui-guidelines.md already documents the rules
- [2026-10-19] Completed