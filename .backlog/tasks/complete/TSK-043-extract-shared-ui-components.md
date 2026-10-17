---
id: TSK-043
title: Extract Shared UI Components and Standardize Patterns
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-29
---

# Extract Shared UI Components and Standardize Patterns

## Description

As a developer, I want shared UI patterns extracted into reusable components so the site stays consistent as it grows.

## Acceptance Criteria

- [ ] Create `EmptyState` component: consistent icon color (`text-gray-300`), border (`border border-dashed border-gray-200`), padding (`rounded-2xl py-20`), with slots for title, description, optional action
- [ ] Replace empty states on municipality detail, collection detail, and explorer with the shared component
- [ ] Extract `PageInfo` component for "Pagina X de Y (N playas)" text used on 3 pages
- [ ] Standardize back/navigation links at page bottom: use consistent verb ("Volver a {section}")
- [ ] Standardize beach card grid gaps: `gap-5 xl:gap-6` on all grid pages (homepage can keep `gap-6 xl:gap-8`)

## Context

UI review (2026-03-28) found several duplicated patterns with inconsistent implementations across pages. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` (CC-3, CC-5, CC-6, CC-7).

## Notes

- Low risk, high consistency gain
- See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` for all details

## Learnings

- LRN-003: Component modularization — hybrid, not screen-only
## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #043)
