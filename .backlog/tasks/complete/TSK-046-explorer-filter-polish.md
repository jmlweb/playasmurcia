---
id: TSK-046
title: Explorer Page Filter Panel and UX Polish
status: complete
priority: P3
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-29
---

# Explorer Page Filter Panel and UX Polish

## Description

As a visitor using the explorer on mobile, I want the filter controls to be easy to find and use.

## Acceptance Criteria

- [ ] Move mobile filter toggle button into the toolbar row (alongside count and sort)
- [ ] Add `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1` to filter chips
- [ ] Add `focus-visible:` styles to "Limpiar todo" text button
- [ ] Style "Limpiar todo" with `underline underline-offset-2` for clearer affordance
- [ ] Add search icon (magnifying glass) inside the SearchBar input on the left
- [ ] Add clear "x" button inside SearchBar when text is present
- [ ] Add left-aligned result count to municipality detail sort row to balance the layout

## Context

UI review (2026-03-28) found the mobile filter button is disconnected from the toolbar, chips lack focus states, and the clear-all button is hard to spot. See `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md`.

## Notes

- See `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md` and `.backlog/reports/complete/RPT-018-municipality-detail-municipiosslug-ui-review.md` for details

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #046)
