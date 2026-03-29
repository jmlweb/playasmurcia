# Task #058: Accessibility Fixes (Focus Trap, ARIA, Keyboard Nav)

## Metadata
- **Status**: pending
- **Priority**: P3
- **Slice**: Styling
- **Created**: 2026-03-29
- **Started**: -
- **Blocked by**: -

## User Story

As a keyboard or assistive-technology user, I want modals and interactive controls to be properly accessible so that I can use the site without a mouse.

## Context

Code quality audit (2026-03-29) found 3 accessibility issues:

1. **Filter panel modal** (`src/components/filter-panel.tsx:272-321`) — No focus trap or scroll lock. Tab key escapes the modal; body scrolls behind the backdrop.
2. **Sort dropdown ARIA** (`src/components/sort-select.tsx:80-103`) — Uses `role="listbox"` + `role="option"` which promise arrow-key navigation, but only Escape is implemented. Should either add keyboard nav or downgrade to `role="menu"`.
3. **Photo gallery focus** (`src/components/photo-gallery.tsx:43`) — `tabIndex={0}` without `focus-visible` ring. Keyboard users can't see when the gallery container is focused.

## Acceptance Criteria

- [ ] Filter panel modal traps focus and locks body scroll when open (consider `<dialog>` element)
- [ ] Sort dropdown either implements arrow-key navigation or uses `role="menu"` + `role="menuitem"`
- [ ] Photo gallery container has visible focus indicator (`focus-visible:ring-*` or equivalent)
- [ ] All changes tested with keyboard-only navigation

## Notes

Report: `reports/done/code-quality-audit.md` (items 9–10, 19).
