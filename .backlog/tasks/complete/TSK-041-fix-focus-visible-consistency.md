---
id: TSK-041
title: Fix focus-visible Consistency Across All Pages
status: complete
priority: P2
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
completed: 2026-03-28
---

# Fix focus-visible Consistency Across All Pages

## Description

As a keyboard user, I want focus rings to appear only when I'm using the keyboard, not when I click with a mouse.

## Acceptance Criteria

- [ ] Replace all `focus:ring` with `focus-visible:ring` across all components
- [ ] Replace all `focus:outline-none` with `focus-visible:outline-none` where paired with ring styles
- [ ] Verify homepage hero buttons (primary + secondary) use `focus-visible:`
- [ ] Verify navbar mobile menu button uses `focus-visible:`
- [ ] Verify explorer filter chips have visible focus states (`focus-visible:ring-2 focus-visible:ring-ocean-500`)
- [ ] Verify "Limpiar todo" button in explorer chips row has focus-visible styles
- [ ] Run through all interactive elements with keyboard navigation to confirm

## Context

UI review (2026-03-28) found multiple elements using `focus:` instead of `focus-visible:` for ring styles, contrary to the project guidelines. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` (CC-2).

## Notes

- This is largely a search-and-replace task but needs manual verification
- See `.backlog/reports/complete/RPT-016-homepage-ui-review-directive.md` and `.backlog/reports/complete/RPT-011-explorer-explorar-ui-review-directive.md` for specific instances

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #041)
