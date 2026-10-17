---
id: TSK-037
title: Explorer UX Improvements
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-28
---

# Explorer UX Improvements

## Description

As a visitor using the beach explorer, I want clear feedback about active filters and polished interaction patterns.

## Acceptance Criteria

- [ ] Add active filter chips above the beach grid showing each applied filter as a removable pill
- [ ] Replace native `<select>` sort dropdown with a custom styled dropdown matching the site's design language
- [ ] Consolidate filter panel to a single React instance (currently duplicated for mobile/desktop)
- [ ] Default first 2 filter groups (Municipality, Sea) to open on desktop
- [ ] Add sort controls to municipality detail and collection detail pages (reuse `SortSelect` component)

## Context

UI review (2026-03-28) found the explorer lacks active filter indication, uses a native browser dropdown for sort, and has other UX gaps. See `.backlog/reports/complete/RPT-012-design-directive-explorer.md` for full directive.

## Notes

- Filter chips pattern: `rounded-full bg-ocean-50 px-3 py-1 text-sm text-ocean-700` with X remove button
- Custom dropdown could use Base UI Popover (already in the project for nav)
- See `.backlog/reports/complete/RPT-012-design-directive-explorer.md` for detailed directives

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #037)
