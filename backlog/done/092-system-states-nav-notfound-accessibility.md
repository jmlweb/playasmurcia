# Task #092: System States, 404 Recovery, and Nav Label Consistency

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: UI
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor—including on mobile, after a typo URL, or using assistive tech—I want consistent navigation labels, useful recovery paths on 404, and proper main landmarks so the shell feels coherent and accessible.

## Context

Follow-up UI review on global error/not-found flows and nav vocabulary. Complements task #080 (navigation menu) where overlapping work exists for the Descubrir / mobile sheet labels.

## Acceptance Criteria

- [x] **Nav labels**: Use the same section title for the characteristics/collections link group in desktop `NavDropdown` and `MobileDropdown` (recommend **”Colecciones”** to align with `/colecciones` and footer; or rename both to the same alternative if product prefers another term).
- [x] **404 CTAs**: On `notFoundComponent`, add secondary recovery actions comparable to `RootErrorComponent`—e.g. outline/text links to **Ver todas las playas** (`/explorar`) and **Colecciones** (`/colecciones`), with one primary **Volver al inicio**, responsive stacking on narrow viewports.
- [x] **Landmarks**: Ensure root-level `notFoundComponent` and `RootErrorComponent` expose a proper `<main>` (or equivalent landmark strategy) consistent with skip-link / “main content” expectations documented in the source report.

## Source Reports

- `reports/done/ui-review-2026-03-30-system-states-nav.md`
