---
id: TSK-063
title: Navigation Menu Restructure
status: complete
priority: P3
tags: [styling]
created: 2026-03-29
source: manual
depends-on: []
completed: 2026-03-29
---

# Navigation Menu Restructure

## Description

As a visitor, I want a clear, non-redundant navigation menu so that I can quickly find beaches, municipalities, and collections without confusion.

## Acceptance Criteria

### Critical

- [x] Remove "Inicio" from nav links (brand logo already links to `/`)
- [x] Rename top-level "Explorar" to "Playas" to differentiate from "Descubrir" dropdown
- [x] Add "Municipios" as a top-level nav link pointing to `/municipios`

### Important

- [x] Simplify "Descubrir" dropdown: top 5 municipalities + "Ver todos →", top 4 collections + "Ver todas →"
- [x] Active state uses `startsWith` matching for nested routes (e.g. `/municipios/cartagena` highlights "Municipios")
- [x] Footer structure updated to match new nav taxonomy

### Nice to have

- [ ] Mobile bottom tab bar for primary destinations (below `sm` breakpoint) — deferred
- [ ] Search icon/modal in navbar — deferred

## Context

Navigation audit (2026-03-29) found semantic overlap ("Explorar" vs "Descubrir"), a redundant "Inicio" link, and municipalities hidden inside the dropdown.

## Notes

Report: `.backlog/reports/complete/RPT-020-design-directive-navigation-menu-optimization.md`.

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #063)
