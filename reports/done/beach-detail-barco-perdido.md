# Design Directive: Beach Detail — Playa del Barco Perdido (Playa Entremares)

**Page**: `/playas/playa-del-barco-perdido-(playa-entremares)`
**Route file**: `src/routes/playas/$slug.tsx`
**Date**: 2026-03-29
**Status**: Implemented

---

## Critical (must fix) — ALL DONE

### C1. Service and Activity icons render as raw string IDs instead of SVG icons

The `serviceIconMap` in `src/components/icons.tsx` was keyed by emoji characters, but the database now stores string IDs (`footwash`, `umbrellas`, `sunbeds`, `wheelchair-ramp`, `swimming`, `snorkeling`, `kayak`, `fishing`). The fallback rendered raw strings where icons should be.

**Fix applied**: Added string-ID keys to both `serviceIconMap` and `activityIconMap` matching exact DB `id` values. Kept emoji keys for backward compatibility.

### C2. Missing diacritics in PracticalInfoCard

`src/components/practical-info-card.tsx` — Fixed: `Información práctica`, `niños`, `Sí`.

### C3. "Como llegar" missing accent

`src/routes/playas/$slug.tsx` — Fixed: `Cómo llegar`.

### C4. Gallery text missing accents

`src/routes/playas/$slug.tsx` — Fixed: `fotos más en la galería`.

---

## Important (should fix) — ALL DONE

### I1. Tags in hero need dark variant

Added `variant` prop (`'light' | 'dark'`) to `TagsSection`. Dark variant uses frosted-glass: `bg-white/15 text-white backdrop-blur-sm border border-white/20`. Applied `variant="dark"` in both hero paths (with and without image).

### I2. Hero image duplicated in gallery

Gallery now receives `pictures.slice(1)` when heroImage is present, avoiding the duplicated first image.

### I3. Sidebar reordered on mobile

Restructured grid with CSS order utilities so sidebar (Weather, BeachStatus, PracticalInfo, Contact) appears after description on mobile, before Services/Activities/Map.

### I4. Certification "Q" icon sizing

Q icon now uses `flex items-center justify-center` for consistent 20x20 box sizing.

### I5. BeachStatusWidget layout shift

`notfound`/`error` states now render a collapsed invisible div instead of null, eliminating CLS.

### I6. Visual separator before NearbyCarousel

Added `pt-8 border-t border-gray-100` wrapper around NearbyCarousel.

### I7. Description text contrast

Changed description paragraph from `text-gray-600` to `text-gray-700`.

---

## Refinement — ALL DONE

### R1. Removed hover states from non-interactive items

`services-grid.tsx` and `activities-grid.tsx` — removed false-affordance hover styles from display-only `<li>` elements.

### R4. Standardized contact link styles

All links in `contact-info.tsx` now use `text-ocean-600 hover:text-ocean-700 hover:underline` consistently.

### R5. Gallery aspect ratios

Added `aspect-[16/9]` to main gallery image, `aspect-[4/3]` to side images.

### R6. Breadcrumb aria-label accent

`navegacion` → `navegación`.

### R7. "Region de Murcia" accent

Both occurrences → `Región de Murcia`.

---

## Severity Summary

**Critical: 4 | Important: 7 | Refinement: 5** — All implemented.
