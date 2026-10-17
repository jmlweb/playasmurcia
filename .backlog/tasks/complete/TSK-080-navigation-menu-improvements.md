---
id: TSK-080
title: Navigation Menu Improvements
status: complete
priority: P3
tags: [ui]
created: 2026-03-30
source: manual
depends-on: []
completed: 2026-03-30
---

# Navigation Menu Improvements

## Description

As a visitor, I want a clear, intuitive navigation so that I can find beaches, municipalities, and collections without confusion.

## Acceptance Criteria

- [x] Remove redundant "Inicio" top-level link (brand wordmark already links to `/`)
- [x] Rename "Explorar" to "Playas" to differentiate from "Descubrir" dropdown
- [x] Promote "Municipios" to a top-level nav link pointing to `/municipios`
- [x] Simplify "Descubrir" dropdown: left = top municipalities + "Ver todos →"; right = top collections + "Ver todas →"
- [x] Fix active state for nested routes: `/municipios/*` highlights "Municipios", etc.
- [x] Add logo mark/wave icon to nav (currently text-only "Playas de Murcia")
- [x] Consider bottom tab bar for mobile (Playas, Municipios, Colecciones, Search)
- [x] Add search icon in navbar opening modal/command palette
- [x] Update footer to reflect simplified nav taxonomy

## Context

Navigation menu optimization report identified redundancy (Inicio link), confusing labels (Explorar vs Descubrir), and missing features (search, active states, mobile bottom tab bar).

## Source Reports

- `.backlog/reports/complete/RPT-022-ui-audit-report-playas-de.md` — NAV1, NAV2
- `.backlog/reports/complete/RPT-020-design-directive-navigation-menu-optimization.md` — NAV1–NAV8

## Notes

## Learnings

## Progress Log

- [2026-10-17] Migrated from legacy backlog/ (originally task #080)
