# Design Directive: Explorer (`/explorar`)

**File**: `src/routes/explorar/index.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

(None - this is the most polished page on the site)

## Important (should fix)

- **Filter panel mobile button position is disconnected from content**: The `FilterPanel` renders its mobile toggle button as a separate `div` inside the `flex gap-10` layout. On mobile, this means the filter button appears above the main content area but outside the toolbar row. Visually it floats alone before the sort/count toolbar.
  **Fix**: Move the mobile filter toggle into the toolbar row (the `flex flex-wrap items-center justify-between gap-3` div). Place it as the first element, before the count. Pattern: `[Filters button] [count text] ... [Sort dropdown]`.

- **Filter chips lack focus-visible states**: The active filter chip buttons have `focus:outline-none` but no `focus-visible:ring-*` replacement. Keyboard users cannot see which chip is focused.
  **Fix**: Add `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-1` to each chip button. Also add to the "Limpiar todo" button.

- **"Limpiar todo" button in chips row has no visual affordance**: Plain text (`text-sm text-gray-500 hover:text-gray-700`) next to the styled chip buttons makes it easy to miss. It looks like descriptive text, not a clickable action.
  **Fix**: Style as a subtle button: add `underline` or match the chip style but with a different treatment: `text-sm font-medium text-gray-500 hover:text-gray-700 underline underline-offset-2`.

- **Search bar in hero has no visible submit/clear action**: The `SearchBar` component sits in the hero but from the screenshot it appears to be a plain input. Users may not realize it's a live-filter search.
  **Fix**: Add a search icon (magnifying glass) inside the input on the left, and a clear "x" button on the right when there's text. This is standard search UX.

## Refinement (nice to have)

- **Desktop filter sidebar has no visual hierarchy between sections**: All filter groups (Municipio, Mar, Servicios, Actividades, Etiquetas) look identical. For 5 sections with potentially many options, this is a lot of content in a 256px sidebar.
  **Fix**: Add subtle group labels with slightly more visual weight. The current design is functional but could benefit from `text-xs text-gray-400 uppercase tracking-wider` labels above each section (already present as the group label, but they're `text-sm font-medium text-gray-800` which is the same weight as the checkbox labels).

- **Pagination position relative to results**: Pagination appears directly after the last card row. On pages with fewer than 15 results (single page), no pagination shows. But on the last page of results (e.g., page 13 with 3 results), the pagination sits right under 3 cards, leaving a large gap on the right. This is standard behavior but feels unfinished.
  **Fix**: Center the pagination component and add `mt-8` spacing (currently `mt-10` which is fine).

- **Empty state uses gray-300 for icon, other pages use different grays**: Explorer uses `text-gray-300`, coleccion detail uses `text-gray-400`. Minor inconsistency.
  **Fix**: Standardize all empty state search icons to `text-gray-300`.

## What Works Well

- This is the strongest page architecturally. The sidebar + content layout, URL-driven filters, active chips, sort control, and pagination all work together seamlessly.
- The filter panel's mobile/desktop split (slide-in drawer vs. sticky sidebar) is the right pattern. The `animate-slide-in-left` entrance animation is smooth.
- Filter chips with individual remove buttons are excellent UX. Users can see and modify their selections without reopening the panel.
- The search bar placement in the hero is smart - it establishes the page's purpose immediately.
- The toolbar row (count + sort) gives users control and context in a single scannable line.

**Severity summary**: Critical: 0, Important: 4, Refinement: 3
