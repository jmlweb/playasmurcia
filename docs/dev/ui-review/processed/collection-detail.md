# Design Directive: Collection Detail

Route: `src/routes/colecciones/$slug.tsx` | URL: `/colecciones/playas-familiares`

---

## Important (should fix)

- **Hero "Coleccion" label is generic and adds no value**: Above the collection title, the label reads "Coleccion" — the user already knows they're on a collection page from the breadcrumb and URL. This label should either be removed or replaced with something informative (e.g., the collection category like "Familias" or "Certificaciones").
  **Fix**: Replace the static "Coleccion" label with a more descriptive category tag, or remove it and let the title + description speak for themselves. If the collection data has a category field, use that. Otherwise, just drop the label.

- **Beach count in hero has low visual weight**: The count ("X playas") appears as `text-sm text-ocean-300` below the description, easily missed against the dark gradient background. On a collection with 40+ beaches, this is an important piece of orientation information.
  **Fix**: Give the count more prominence. Use `text-base font-medium text-ocean-200` or display it as a badge: `inline-flex items-center rounded-full bg-ocean-700/50 px-3 py-1 text-sm font-medium text-ocean-200`. Place it directly after the description or in the same line.

- **No sorting or filtering available**: Unlike the Explorer page, collection detail pages show all matching beaches with no way to sort or narrow results. Some collections could have 40+ beaches (e.g., "Mar Mediterraneo" with most of the 194 beaches), creating the same scroll fatigue as the municipality detail page.
  **Fix**: Add the `SortSelect` component above the grid, matching the Explorer page's toolbar pattern. For large collections (>15 beaches), this is important for usability.

## Refinement (nice to have)

- **Back link "Volver a colecciones" is the same weak text link as municipality detail**: Small text link at the bottom of potentially dozens of cards.
  **Fix**: Use a pill button style: `rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-ocean-600 shadow-sm`. Or add a sticky back-to-top button on long pages.

- **Empty state is a plain paragraph**: When a collection has no beaches, it shows `<p className="text-center text-gray-500">No se encontraron playas...</p>`. Other pages (municipality detail, explorer) have a richer empty state with an icon, heading, and description.
  **Fix**: Use the same empty state pattern as the Explorer/Municipality detail: centered icon + heading + description inside a dashed border container.

## What Works Well

- **Hero** follows the established gradient pattern perfectly — consistent brand feel.
- **Breadcrumb** is complete with three levels (Inicio → Colecciones → Collection name).
- **Beach cards** are the same component used everywhere — good reuse.
- **Description** in the hero provides useful context about the collection.
