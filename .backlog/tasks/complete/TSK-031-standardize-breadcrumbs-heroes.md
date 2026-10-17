---
id: TSK-031
title: Standardize Breadcrumbs and Hero Sections
status: complete
priority: P2
tags: [styling]
created: 2026-03-28
source: manual
depends-on: []
started: 2026-03-28
completed: 2026-03-28
---

# Standardize Breadcrumbs and Hero Sections

## Description

As a visitor, I want consistent navigation cues and page headers so the site feels cohesive as I navigate between pages.

## Acceptance Criteria

- [x] Add breadcrumbs to Explorer page ("Inicio / Explorar playas")
- [x] Move municipality detail breadcrumb from inside the dark hero to below the hero in the content area (matching other pages)
- [x] Use consistent breadcrumb styling everywhere: `text-sm text-gray-500`, links with `hover:text-ocean-600`, `mb-8` spacing
- [x] Standardize inner page hero heights: use a consistent padding tier (e.g., `py-14 sm:py-18 lg:py-20`) for all inner pages. Municipality detail currently uses `py-12 sm:py-16` while others use `py-20 sm:py-24 lg:py-28`
- [x] Apply gradient background (`bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700`) to Explorer hero (currently uses flat `bg-ocean-900`)
- [x] Beach detail breadcrumb should include municipality level: "Inicio / {municipality} / {beach name}"

## Context

UI review (2026-03-28) found breadcrumbs and hero heights vary arbitrarily across pages. See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md`, `.backlog/reports/complete/RPT-017-design-directive-municipality-detail.md`, and `.backlog/reports/complete/RPT-012-design-directive-explorer.md` for full directives.

## Notes

- Homepage hero keeps its own taller height — it's the immersive entry point
- Consider extracting a shared `PageHero` component to enforce consistency
- See `.backlog/reports/complete/RPT-010-cross-cutting-design-directives-playasmurcia-ui.md` for the recommended two-tier hero system

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #031)
