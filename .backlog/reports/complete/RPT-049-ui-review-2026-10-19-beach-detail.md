---
id: RPT-049
title: UI review (2026-10-19): Beach detail /playas/$slug
type: finding
severity: medium
status: triaged
created: 2026-10-18
triaged: 2026-10-18
task-id: TSK-121
---

## Summary

Design directive for `/playas/playa-de-la-concha` (production), the most content-heavy route. See RPT-047 for cross-cutting items.

## Where found

`src/routes/playas/$slug.tsx`, `src/features/beaches/photo-gallery.tsx`, `weather-widget.tsx`, `practical-info-card.tsx`, `contact-info.tsx`, `nearby-carousel.tsx`.

## Evidence

## Design Directive: Beach detail

### Critical (must fix)

- **Hero has no photo**: the page opens with a flat teal band holding the name, municipality and tags. The photos appear afterwards as three 390×290 tiles below the breadcrumb. Listing pages use photo heroes, so the most important page is visually the poorest. On mobile the gallery becomes a horizontal strip with the second image cut at the edge.
  **Fix**: Make the first photo a full-bleed hero (min(60vh, 560px)) with the title, municipality and tags bottom-left over a scrim. Below it, show a 1 large + 2 stacked thumbnails mosaic (Airbnb pattern) with a "Ver las 4 fotos" button overlaid bottom-right of the mosaic (white pill, 14px, icon).

### Important (should fix)

- **Description is too short to carry a whole card**: two sentences sit in a white card next to the certifications, and the copy reads oddly (see data report). Fix in combination with RPT-047 over-carding: render the description as an unboxed 18px/1.6 lead paragraph at the top of the main column.
- **Semantic color overload in "Información práctica"**: blue "Excelente", red "Alta" (occupancy), green "Fácil", green "Sí". Red on "Alta" ocupación reads as an error or danger.
  **Fix**: Use neutral value text (gray-900, 15px 600) under small labels. Reserve color for one signal at most. Show occupancy as a 3-step meter (●●○) in ocean tones, not red.
- **"Playas cercanas" carousel is clipped with no affordance**: on desktop it lives in the 2/3 main column and cuts the 4th card mid-name ("Playa Ma…") with no arrows or fade.
  **Fix**: Make it a full-width section under both columns with 4 visible cards on desktop, or add prev/next buttons plus a right-edge fade mask (48px, sand-50 → transparent).
- **"Agua 25°" looks like a link**: in `weather-widget.tsx` it is rendered in link blue with no link behind it.
  **Fix**: Render it in gray-700 with the wave icon in ocean-500.

### Refinement (nice to have)

- The sidebar ends after "Información práctica", leaving ~1,000px of empty right column next to Ubicación and Contacto. Make the sidebar `position: sticky; top: 80px` so the weather stays visible while scrolling.
- Map coordinates "37.73771, -0.84981" add no value as 13px gray text. Move them into "Más detalles".
- The "Q de Calidad" certification badge (yellow box) clashes with the palette. Use a neutral card with the official mark or icon in color.

### What Works Well

- The weather widget is genuinely useful: 6-day grid, rain probability, sea state ("Oleaje 0,4 m Este · Bajo").
- Service and activity chips with line icons are clear and consistent.
- "Cómo llegar" CTA on the map is well placed.

Critical: 1, Important: 4, Refinement: 3

## Impact

Beach detail pages hold most of the site's content and organic traffic. The missing photo hero is the single biggest gap versus reference tourism sites.
