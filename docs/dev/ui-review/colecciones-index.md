# Design Directive: Collections Index

Route: `src/routes/colecciones/index.tsx` | URL: `/colecciones`

---

## Important (should fix)

- **Section headings "Por mar" and "Por tematica" are undersized**: Both use `text-lg font-semibold text-gray-900` — the same size as card titles. Section-level headings should be larger than the content they introduce. These headings get lost against the card titles below them.
  **Fix**: Increase section headings to `text-xl font-bold text-gray-900` or better, use the established section header pattern from the homepage: a `text-sm font-semibold uppercase tracking-wider text-ocean-600` label plus a `text-2xl font-bold text-gray-900` heading. This also adds vertical rhythm and visual breathing room.

- **Thematic collection cards lack any visual differentiation**: All thematic collection cards are identical white cards with title, description, beach count, and "Ver coleccion →". There's no icon, color, or visual cue to distinguish "Playas familiares" from "Playas nudistas" from "Bandera azul". The sea cards at least have a colored top bar and icon — the thematic cards have nothing.
  **Fix**: Add an icon or emoji to each collection card, matching the collection's theme. Display it in a rounded-xl container with a themed background color (e.g., emerald for "Bandera azul", amber for "Mejores atardeceres", blue for "Snorkel"). Place it in the card header, mirroring the sea card layout with icon + title in a horizontal flex row.

- **Sea collection cards and thematic cards have different internal layouts**: Sea cards have a colored `h-2` top bar, a 10x10 icon container, and a horizontal icon+title layout. Thematic cards have no top bar, no icon, and title alone. This layout inconsistency within the same page makes the card system feel cobbled together.
  **Fix**: Unify the card layout. Both sea and thematic cards should use the same internal structure: optional top accent (color bar or border), icon in a rounded container + title in a horizontal row, description below, footer with count and CTA. The only difference should be the color scheme (ocean for sea, varied for thematic).

- **No introductory text explaining what collections are**: The page jumps straight from the hero to the card grid. First-time visitors may not understand what "collections" means in this context — are they user-created lists? Editorial picks? Filtered categories?
  **Fix**: Add a short explanatory paragraph below the hero subtitle, e.g., "Colecciones tematicas para encontrar la playa perfecta. Cada coleccion agrupa playas por sus caracteristicas mas destacadas." Place it in the hero below the current subtitle, or as a lead paragraph in the content area.

## Refinement (nice to have)

- **"Por mar" section gap with "Por tematica" section feels abrupt**: The spacing between the sea cards section and the thematic heading is `mb-10` (40px) — adequate, but the transition from a 2-column grid to a heading to a 3-column grid has no visual pause.
  **Fix**: Add a subtle separator between sections: either a `border-t border-gray-200` with `py-10` above the "Por tematica" heading, or increase the margin to `mb-14`.

- **Card grid gaps could be slightly larger on desktop**: Currently `gap-5` (20px) across all breakpoints. At 3 columns on XL, the cards feel slightly cramped.
  **Fix**: Use `gap-5 xl:gap-6` for a bit more breathing room on larger screens.

## What Works Well

- **Sea collection cards** with the colored top bar and icon container are well designed — they immediately communicate "these are special".
- **Card hover effects** are consistent with the rest of the site.
- **Beach count** in each card's footer provides useful sizing context.
- **Hero** follows the established pattern and feels consistent with other inner pages.
- **Breadcrumb** is correctly placed in the content area.
