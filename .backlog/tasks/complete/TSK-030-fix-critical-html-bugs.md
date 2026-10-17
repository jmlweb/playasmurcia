---
id: TSK-030
title: Fix Critical HTML and Rendering Bugs
status: complete
priority: P1
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
started: 2026-03-28
completed: 2026-03-28
---

# Fix Critical HTML and Rendering Bugs

## Description

As a visitor, I want the site to render correctly without broken text, invalid HTML, or conflicting styles.

## Acceptance Criteria

- [x] Fix nested `<main>` elements: root layout and page components both render `<main>`. Remove `<main>` from `__root.tsx` or from each page component so there is exactly one `<main>` per page
- [x] Fix service icons rendering as text IDs ("sunbeds", "parking", etc.) on municipality cards — ensure `service.icon` contains actual emoji/visual icons, not string identifiers
- [x] Fix active nav link class collision: `className` and `activeProps.className` apply conflicting Tailwind color utilities simultaneously. Ensure only one set of classes applies per state
- [x] Verify fixes across all affected pages: homepage, municipios index, all nav links

## Context

UI review (2026-03-28) found three critical rendering issues affecting multiple pages. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` and `.backlog/reports/complete/RPT-019-municipios-index-municipios-ui-review.md` for full directives.

## Notes

- The nested `<main>` issue is an accessibility violation (WCAG landmark model)
- The icon text ID issue may be a data problem (services table) or a missing mapping in the component
- The nav class collision may need TanStack Router's `inactiveProps` pattern instead of overlapping className

## Learnings

## Progress Log

- [2026-03-28] Started task
- [2026-03-28] All three bugs fixed and verified (nested main, icon emoji, nav classes)
- [2026-03-28] Task completed — all 140 tests passing
- [2026-10-17] Migrated from legacy backlog/ (originally task #030)
