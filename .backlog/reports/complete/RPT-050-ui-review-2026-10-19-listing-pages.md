---
id: RPT-050
title: UI review (2026-10-19): Listing pages (municipios, colecciones, explorar, 404)
type: finding
severity: medium
status: triaged
created: 2026-10-18
triaged: 2026-10-18
task-id: TSK-122
---

## Summary

Design directives for the listing routes on production: `/municipios`, `/municipios/cartagena`, `/colecciones`, `/colecciones/bandera-azul`, `/explorar`, plus the 404 page. These pages share the hero and card issues in RPT-047. Page-specific items follow.

## Where found

`src/routes/municipios/index.tsx`, `municipios/$slug.tsx`, `colecciones/index.tsx`, `colecciones/$slug.tsx`, `explorar/index.tsx`, root not-found component.

## Evidence

## Design Directive: /municipios

### Important (should fix)

- **Eight text-only cards for eight towns**: no image, no map and no character. "Elige un municipio y descubre sus playas" gets no help choosing.
  **Fix**: Use 4:3 photo cards (one signature beach per town) with the name over the scrim and "36 playas · 10 banderas azules" below. Optionally add a small coastline map with the 8 towns as pins above the grid.
- Sort order is alphabetical. Order by coast instead (north → south: San Pedro, San Javier, Los Alcázares, Cartagena, La Unión, Mazarrón, Águilas, Lorca) so the grid mirrors geography.

## Design Directive: /municipios/$slug

### Important (should fix)

- **No filtering on a 70-beach list**: Cartagena has 5 pages with only sort. `/explorar` already has filters.
  **Fix**: Reuse the explorar filter bar (horizontal chip filters on top, not the sidebar), pre-scoped to the municipality.
- **Photo-less card placeholder is weak**: "Playa Los Nietos" shows a light-grey gradient with a tiny ocean-200/60 wave icon (`beach-card.tsx:81-84`). It reads as a loading failure.
  **Fix**: Use an ocean-700 → ocean-900 gradient with the beach name initial or a larger white/30 wave icon, so it reads as an intentional fallback.
- "Ir al inicio" outline pill under the pagination is a dead-end CTA. Replace it with "Ver otros municipios" or remove it.

## Design Directive: /colecciones

### Important (should fix)

- **Three card styles on one page**: image strip cards ("Playas por mar"), image-top cards with floating icon (first 4 thematic), icon-only cards with a colored top border (remaining 8). It looks like three design iterations shipped together.
  **Fix**: Use one collection card: 4:3 photo, title, one-line description, count. Feature the top 2 at double width if hierarchy is wanted.
- **Poor cover images**: "Mar Mediterráneo" uses a signboard photo, and "Mar Menor" shows apartment blocks. These are flagship collections. Pick covers by `pictureQualityScore` = 3 or hand-pick them.
- "Playas nudistas" uses a sun icon that duplicates the "Mejores atardeceres" metaphor. Use a distinct icon, or drop icons once all cards have photos.

## Design Directive: /colecciones/$slug

### Refinement (nice to have)

- "35 playas" appears twice (hero pill and the results line). Keep it in the results line only.
- "Página 1 de 3" sits on its own row with 24px+ gaps. Merge it into the results line: "35 playas · página 1 de 3".

## Design Directive: /explorar

### Important (should fix)

- **Filter sidebar scrolls internally and is cut off**: the panel shows a faded "Mazarrón" at the bottom edge on 1280×800. The municipality filter is half-hidden and Sea, Sand and other groups are below the fold of an inner scroller. Eleven "Necesidades" checkboxes mix different dimensions (dogs, access level ×3, summer occupancy ×3).
  **Fix**: Group the filters into Acceso (segmented control: Fácil / Moderado / Difícil), Ocupación (segmented control), Necesidades (perros, socorrista, niños, sombra, nudista), Municipio (select or chips). Let the sidebar scroll with the page (sticky top 80px, no inner scrollbar).
- **Toolbar spacing on desktop**: "Cerca de mí", the Lista/Mapa toggle and Ordenar crowd into one row with uneven spacing, and "Página 1 de 13" sits on a separate row.
  **Fix**: Results count on the left. On the right: sort, then a 1px divider, then the Lista/Mapa segmented control. Put "Cerca de mí" as a chip in the filter area.

## Design Directive: 404

### Refinement (nice to have)

- Three CTAs with three different styles (filled, outline, plain text) for equal-weight destinations. Keep "Volver al inicio" as primary and "Explorar playas" as secondary. Add the search input, since the most likely cause is a mistyped beach slug.
- The page has 300px of empty space above the content on desktop. Add a beach photo or reduce the min-height.

### What Works Well

- Pagination is clear and has good tap targets.
- Mobile `/explorar` collapses filters into a "Filtros" button with a visible results count. This is the right pattern.
- The 404 returns a real HTTP 404 status.

Critical: 0, Important: 9, Refinement: 5

## Impact

Listing pages are the main navigation layer between home and beach detail. Inconsistent cards and weak filtering slow down beach discovery.

## Related tasks

TSK-122 (listing pages), TSK-118 (photo-less card fallback).
