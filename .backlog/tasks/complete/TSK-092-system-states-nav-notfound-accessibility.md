---
id: TSK-092
title: System States, 404 Recovery, and Nav Label Consistency
status: complete
priority: P3
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# System States, 404 Recovery, and Nav Label Consistency

## Description

As a visitor—including on mobile, after a typo URL, or using assistive tech—I want consistent navigation labels, useful recovery paths on 404, and proper main landmarks so the shell feels coherent and accessible.

## Acceptance Criteria

- [x] **Nav labels**: Use the same section title for the characteristics/collections link group in desktop `NavDropdown` and `MobileDropdown` (recommend **”Colecciones”** to align with `/colecciones` and footer; or rename both to the same alternative if product prefers another term).
- [x] **404 CTAs**: On `notFoundComponent`, add secondary recovery actions comparable to `RootErrorComponent`—e.g. outline/text links to **Ver todas las playas** (`/explorar`) and **Colecciones** (`/colecciones`), with one primary **Volver al inicio**, responsive stacking on narrow viewports.
- [x] **Landmarks**: Ensure root-level `notFoundComponent` and `RootErrorComponent` expose a proper `<main>` (or equivalent landmark strategy) consistent with skip-link / “main content” expectations documented in the source report.

## Context

Follow-up UI review on global error/not-found flows and nav vocabulary. Complements task #080 (navigation menu) where overlapping work exists for the Descubrir / mobile sheet labels.

## Source Reports

- `.backlog/reports/complete/RPT-031-ui-review-system-states-nav.md`

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #092)
