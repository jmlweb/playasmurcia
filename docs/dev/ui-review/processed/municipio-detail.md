# Design Directive: Municipality Detail (`/municipios/$slug`)

**File**: `src/routes/municipios/$slug.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

- **Hero heading size is inconsistent with other pages**: Municipality detail uses `text-3xl sm:text-4xl` for h1, while colecciones detail and explorer use `text-3xl sm:text-4xl`, but colecciones index and municipios index use `text-4xl sm:text-5xl`. The inconsistency is between pages that should feel equivalent (detail vs. index).
  **Fix**: Standardize inner page hero h1 to `text-4xl font-extrabold tracking-tight text-white sm:text-5xl` for index pages, and `text-3xl sm:text-4xl` for detail pages that show content below. Current usage is actually correct by tier, but the colecciones detail uses `text-4xl sm:text-5xl` which is too large for a detail page. Fix colecciones detail to match `text-3xl sm:text-4xl`.

## Important (should fix)

- **No introductory content about the municipality**: The page jumps from hero stats directly to the sort control and beach grid. There's no description of the municipality, its coastline, or what makes it special. This is a missed SEO and UX opportunity.
  **Fix**: Add a brief intro section between breadcrumb and sort control. A single paragraph in a white card (`rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm`) with municipality description. If no description exists in the data, this is a data gap to flag.

- **Page indicator text spacing is tight**: "Pagina 1 de 5 (69 playas)" sits directly above the grid with only `mb-4`. After the sort control's `mb-6`, the visual sequence is: sort (gap) page-info (small gap) grid. The page info feels squeezed.
  **Fix**: Increase to `mb-6` on the page indicator, or combine it into the same row as the sort control (left-aligned count, right-aligned sort).

- **"Ver todos los municipios" back link is visually orphaned**: Placed at the very bottom with `mt-12`, it's far from any content. Users who scroll to the bottom and past the footer may miss it entirely.
  **Fix**: Move this link to sit just above the pagination, or add a secondary placement in the breadcrumb area. The breadcrumb already shows "Municipios" as a clickable link, so this bottom link is partially redundant.

## Refinement (nice to have)

- **Sort control alignment**: The `flex justify-end` pushes the sort dropdown to the far right with nothing on the left. This looks unbalanced.
  **Fix**: Add a left-aligned result count ("69 playas" or "Mostrando 15 de 69") to balance the row, matching the Explorer page pattern which does this correctly.

- **Beach card grid gap inconsistency**: Uses `gap-6 sm:gap-5 xl:gap-6`. The gap shrinks at sm then grows again at xl. This creates a visual shift at the sm breakpoint.
  **Fix**: Simplify to `gap-5 xl:gap-6` for a monotonic increase.

## What Works Well

- Hero stats (beach count + blue flag count) are clean and useful. The `text-ocean-200` secondary text with white bold numbers creates good hierarchy.
- BeachCard component usage is consistent with all other grid pages.
- Pagination component is well-implemented with proper ARIA labels and keyboard navigation.
- The SortSelect dropdown is clean with good focus states.

**Severity summary**: Critical: 1, Important: 3, Refinement: 2
