# Design Directive: Explorer

Route: `src/routes/explorar/index.tsx` | URL: `/explorar`

---

## Important (should fix)

- **Filter panel renders two separate React instances**: The `FilterPanel` component is instantiated twice — once inside the desktop `<aside>` (hidden on mobile) and once inside the mobile toolbar area (hidden on desktop). Both instances maintain their own state. While they share the URL-driven `filters` prop, having two full component trees in the DOM is wasteful and could cause subtle sync bugs if one instance's local state drifts.
  **Fix**: Render `FilterPanel` once and use CSS to control its presentation at different breakpoints, OR render the mobile drawer version always and transform it into a sidebar at `lg:` breakpoint. The current approach works but is fragile — when adding filter features, developers must remember both instances exist.

- **Explorer has no breadcrumb**: Unlike Municipios and Collections pages which have breadcrumbs, the Explorer page has none. Since it's a top-level page, a breadcrumb is optional — but for consistency, it should either have "Inicio / Explorar" or none of the pages should have breadcrumbs (which contradicts the current implementation on other pages).
  **Fix**: Add a breadcrumb below the hero: "Inicio / Explorar playas". Use the same pattern as other pages.

- **No active filter indication above the grid**: When the user activates filters, the only feedback is the result count changing ("X playas encontradas"). There are no filter chips/tags above the grid showing what's active. The user has to open the filter panel to see what's applied. On mobile, this is especially problematic since the filters are in a modal.
  **Fix**: Add a horizontal row of removable filter chips between the toolbar and the grid. Each active filter appears as a pill: `rounded-full bg-ocean-50 px-3 py-1 text-sm text-ocean-700` with an X button to remove it. Include a "Limpiar todo" link at the end if more than 2 filters are active.

- **Sort select uses native browser dropdown**: The `<select>` element renders a native OS dropdown which is impossible to style consistently. On iOS it triggers a full-screen picker; on desktop it looks like a default form element. This breaks the polished visual language of the rest of the site.
  **Fix**: Replace the native `<select>` with a custom dropdown using the same Popover/Listbox pattern from Base UI (already used for the nav dropdown). Use `rounded-full border border-gray-200 bg-white` styling with a custom chevron icon to match the filter button aesthetic.

- **Hero section is simpler than other pages**: The explorer hero uses `bg-ocean-900` as a flat background while other inner pages use a gradient (`bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700`) with optional decorative elements. The explorer hero feels flat and basic by comparison.
  **Fix**: Apply the same gradient treatment: `bg-linear-to-br from-ocean-900 via-ocean-800 to-ocean-700` to match the visual language of other inner page heroes.

## Refinement (nice to have)

- **Mobile filter button could show active count more prominently**: The filter button shows a badge with the active count, which is good. But the button itself ("Filtros") is generic and doesn't tell the user what's filtered.
  **Fix**: When filters are active, change the button text to "Filtros (3)" and use a slightly different color treatment: `border-ocean-300 text-ocean-700 bg-ocean-50` to indicate active state.

- **Sidebar filter panel has no scroll indicator**: The desktop sidebar uses `overflow-y-auto max-h-[calc(100vh-6rem)]` but has no visual cue that it's scrollable when content overflows. Users with many filter groups may not realize they can scroll.
  **Fix**: Add a subtle gradient shadow at the bottom of the sidebar when content is scrollable: a `pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent` element.

- **Filter group accordion defaults to collapsed**: All filter groups start collapsed, requiring the user to click each one open. For the most common filters (Municipality, Sea), starting open would reduce friction.
  **Fix**: Default the first 2 filter groups (Municipality and Sea) to open on desktop. Keep all collapsed on mobile where space is constrained.

## What Works Well

- **Search bar** is well-placed in the hero, has good debounce behavior, clear button, and accessible labeling.
- **Filter sidebar with sticky positioning** is the right pattern for a faceted search interface.
- **Mobile filter modal** with backdrop blur, slide-in animation, and "Ver resultados" button is well-implemented.
- **Result count** updates live as filters change — good responsive feedback.
- **Empty state** with icon, message, and "Limpiar filtros" button is comprehensive.
- **Beach cards** are consistent with all other pages.
