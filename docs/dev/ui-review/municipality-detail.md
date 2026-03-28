# Design Directive: Municipality Detail

Route: `src/routes/municipios/$slug.tsx` | URL: `/municipios/cartagena`

---

## Critical (must fix)

- **69 beach cards render simultaneously with no pagination or lazy loading**: Cartagena has 69 beaches. All 69 cards render in the initial HTML with their images. This is a performance disaster on mobile — dozens of image requests, massive DOM size, and long initial paint time. Even with `loading="lazy"` on images, the browser still parses and lays out 69 card elements.
  **Fix**: Implement pagination or progressive rendering. Options: (1) Show first 12 cards, then a "Cargar mas" button that appends the next batch. (2) Use intersection observer-based infinite scroll. (3) At minimum, only render the first 15-20 cards server-side, with a client-side "Show all" expansion. For municipalities with fewer than 15 beaches, no pagination needed.

## Important (should fix)

- **Breadcrumb is inside the dark hero, inconsistent with other pages**: The breadcrumb sits inside the ocean-gradient hero section with `text-ocean-300` text. On every other page (municipios index, collections, collection detail), the breadcrumb is below the hero in the light content area with `text-gray-500`. This is the only page that breaks the pattern.
  **Fix**: Move the breadcrumb below the hero section, inside the `<div className="mx-auto max-w-7xl px-4 py-12 ...">` content area. Use the same styling as other pages: `text-sm text-gray-500` with `hover:text-ocean-600` on links.

- **Hero is visually shorter than all other inner page heroes**: Uses `py-12 sm:py-16` while every other inner page hero uses `py-20 sm:py-24 lg:py-28`. The difference is stark — this hero feels cramped while others feel spacious. The municipality name, beach count, and blue flag stats are crammed into a tight space.
  **Fix**: Increase to at least `py-14 sm:py-18 lg:py-20` to match the compact-hero tier. The current height doesn't give the content enough breathing room.

- **No description or context about the municipality**: The hero shows the municipality name, beach count, and blue flag count — but nothing else. There's no description, no characteristic of the municipality, no reason to explore further. Compare to the collections page which at least has a descriptive subtitle.
  **Fix**: Add a short description line in the hero below the stats, e.g., "Desde las calas de Cabo de Palos hasta las playas del Mar Menor" for Cartagena. This could come from a `description` field in the municipality data.

- **Beach grid has inconsistent gap values at breakpoints**: The grid uses `gap-6 sm:gap-5 xl:gap-6` — the gap actually decreases from mobile (24px) to tablet (20px) then increases again at XL (24px). Gap should increase or stay constant as viewport grows, not dip.
  **Fix**: Use `gap-5 sm:gap-5 xl:gap-6` or simply `gap-5 xl:gap-6` for a clean progression.

## Refinement (nice to have)

- **"Ver todos los municipios" back link is visually weak**: A plain text link at the bottom of a page with 69 cards is easy to miss. After scrolling through all those beaches, the user needs a clear exit path.
  **Fix**: Increase visual weight of the back link. Use a pill button style: `rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-ocean-600 shadow-sm transition hover:shadow-md`. Or add a sticky back-to-top + back-to-municipalities bar.

- **No filtering or sorting on municipality detail**: 69 beaches with no way to filter or sort is overwhelming. The Explorer page has full filtering — but this page has none.
  **Fix**: Add at least a sort dropdown (same `SortSelect` component from Explorer) above the grid. Filtering is a bigger lift but even basic sort (alphabetical, by length, by occupancy) helps users find what they want.

## What Works Well

- **Beach cards are identical to the ones on the homepage and Explorer** — consistent component reuse.
- **Weather data per card** is a great contextual feature.
- **Stats in the hero** (beach count + blue flag count) provide quick orientation.
- **Empty state** is well designed with icon, heading, and description.
