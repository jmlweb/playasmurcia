# Task #080: Navigation Menu Improvements

## Metadata

- **Status**: completed
- **Completed**: 2026-03-30
- **Priority**: P3 - Nice
- **Slice**: UI
- **Created**: 2026-03-30
- **Blocked by**: -

## User Story

As a visitor, I want a clear, intuitive navigation so that I can find beaches, municipalities, and collections without confusion.

## Context

Navigation menu optimization report identified redundancy (Inicio link), confusing labels (Explorar vs Descubrir), and missing features (search, active states, mobile bottom tab bar).

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

## Source Reports

- `reports/done/ui-audit-2026-03-29.md` — NAV1, NAV2
- `reports/done/navigation-menu-optimization.md` — NAV1–NAV8
