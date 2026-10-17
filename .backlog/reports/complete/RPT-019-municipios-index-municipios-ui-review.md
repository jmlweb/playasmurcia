---
id: RPT-019
title: Municipios index (`/municipios`) — UI review directive
type: finding
severity: low
status: triaged
created: 2026-10-17
triaged: 2026-10-17
---

Screenshot: `/tmp/ui-review-municipios.png`, `/tmp/ui-review-municipios-mobile.png`. Route: `src/routes/municipios/index.tsx`.

## Design Directive: Municipios index

### Critical (must fix)

_None._

### Important (should fix)

- **Card height variance**: Municipality cards with fewer stats (e.g. no banderas line) leave **extra whitespace** compared to dense cards, so the grid rhythm feels uneven.
  **Fix**: Use `min-h` on the metadata block, or bottom-align “Ver playas →” with `mt-auto` on a flex column so CTAs share a baseline across the row.

### Refinement (nice to have)

- **Hero glass panel**: Centered scrim on photo matches colecciones; keep blur/opacity consistent with `PageHero` + `hero-text-scrim` usage elsewhere.

- **Blue flag line**: Icon + count is helpful; ensure icon size aligns with footer badge scale (16–20px).

### What works well

- **3×3 grid** of municipalities reads quickly; badge counts are scannable.
- **Breadcrumb** placement follows site pattern.

**Severity summary:** Critical: 0, Important: 1, Refinement: 2