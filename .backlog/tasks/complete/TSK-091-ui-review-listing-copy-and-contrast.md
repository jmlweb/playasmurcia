---
id: TSK-091
title: Explorer Results Copy and Colecciones Thematic Contrast
status: complete
priority: P3
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Explorer Results Copy and Colecciones Thematic Contrast

## Description

As a user browsing listings and collections, I want concise headers and readable thematic cards so that scanning is fast and text meets accessibility contrast expectations.

## Acceptance Criteria

- [x] **Explorer** (`/explorar`): Remove or merge redundant total count (“playas encontradas” vs pagination line) per `.backlog/reports/complete/RPT-027-ui-review-explorer-explorar.md`.
- [x] **Colecciones index** (`/colecciones`): Audit `text-sm` body copy on white for each thematic card variant; adjust to ≥4.5:1 contrast (e.g. darker gray body or softer borders only) per directive in `.backlog/reports/complete/RPT-025-ui-review-collections-index-colecciones.md`.
- [x] `pnpm build`, `pnpm test`, and `pnpm check` pass.

## Context

UI review (2026-03-30): Explorer repeats total beach count in adjacent lines; collections index thematic cards use many accent colors—body text on white must stay WCAG AA.

## Source Reports

- `.backlog/reports/complete/RPT-027-ui-review-explorer-explorar.md`
- `.backlog/reports/complete/RPT-025-ui-review-collections-index-colecciones.md`

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #091)
