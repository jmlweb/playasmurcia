# Design Directive: Beach Detail

Route: `src/routes/playas/$slug.tsx` | URL: `/playas/playa-ensenada-del-esparto`

---

## Critical (must fix)

- **"Como llegar" heading is `text-xl` while "Sobre esta playa" is `text-2xl`**: Both are `<h2>` sections at the same hierarchy level within the main content column, but they use different font sizes. "Sobre esta playa" at `text-2xl` and "Como llegar" at `text-xl` breaks the type scale for same-level headings. The Services and Activities sections use `text-xl` too, while the sidebar sections also use `text-xl`. The inconsistency suggests no deliberate size system.
  **Fix**: All `<h2>` headings in the main content column should use `text-xl font-semibold`. The "Sobre esta playa" heading should be reduced from `text-2xl` to `text-xl` to match. If "Sobre esta playa" deserves more prominence as the primary section, give it the same size but differentiate with an icon, a top accent border, or different spacing — not a random size bump.

## Important (should fix)

- **Services and Activities grids lack card containers**: Every other content section (Description, How to get there, Map) is wrapped in a `rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm` card. But the Services and Activities sections render their grids directly against the sand-50 background with no containing card. This breaks the visual rhythm — the eye expects a card and finds a naked grid.
  **Fix**: Wrap each grid section in the same card container used by other sections: `<section className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-sm">`. Place the `<h2>` and `<ul>` grid inside the card.

- **Gallery thumbnail fade edges are invisible**: The photo gallery thumbnails have gradient overlays (`from-white to-transparent`) on both sides to hint at horizontal scrolling. But the gallery sits on a white (`bg-white`) background, making these fade indicators completely invisible. They serve no visual purpose.
  **Fix**: Either change the fade gradient to use `from-gray-100` (matching the scroll area background), or remove them entirely. If removed, add scroll snap indicators (e.g., small dots or a subtle scrollbar) so users know the thumbnails are scrollable.

- **Sidebar sticky `top-20` may conflict with navbar**: The sidebar uses `lg:sticky lg:top-20` but the navbar height varies — `py-4` with content means roughly 56-64px depending on font rendering. `top-20` (80px) leaves a gap between the navbar and sidebar content that looks unintentional on some viewports.
  **Fix**: Calculate the actual sticky offset based on navbar height. Use `lg:top-[4.5rem]` (72px) to create a consistent 8px gap below the navbar. Or use a CSS custom property: `--navbar-h: 4rem` defined on the nav, then `top: calc(var(--navbar-h) + 0.75rem)` on the sidebar.

- **Certifications section placement breaks reading flow**: Certifications badges appear between the header (title + municipality) and the photo gallery. On a beach with Blue Flag certification, the user sees: title → municipality → certification badge → photos. The certification interrupts the natural hero flow of title → photos. It's metadata, not a headline element.
  **Fix**: Move certifications below the photo gallery, either as the first section in the main content column or as a horizontal badge row between the gallery and the description card. Alternatively, integrate it into the sidebar alongside the practical info card.

- **Breadcrumb is incomplete**: The breadcrumb shows "Inicio / Playa Name" but skips the municipality level. A user navigating from Cartagena to one of its beaches loses the municipality context. Good breadcrumbs mirror the site hierarchy: Inicio → Municipio → Playa.
  **Fix**: Add the municipality as a middle breadcrumb level: `Inicio / {municipality.name} / {beach.name}`, linking the municipality name to `/municipios/{municipalitySlug}`.

## Refinement (nice to have)

- **Body text color inconsistency**: The description section uses `text-gray-600` for the paragraph, while the "Como llegar" section also uses `text-gray-600`. But the beach card municipality name uses `text-gray-500`, and the sidebar info rows use `text-gray-500` for labels. This creates two slightly different grays for secondary text that are hard to distinguish but feel muddy together.
  **Fix**: Standardize: `text-gray-600` for body paragraphs (content the user reads), `text-gray-500` for labels and metadata (supporting text). Apply consistently.

- **Map static image has no defined dimensions**: The `<img>` for the OpenStreetMap static map has no `width`/`height` attributes, only CSS classes `h-48 w-full sm:h-64`. This can cause CLS (Cumulative Layout Shift) during loading since the browser can't reserve space until the CSS loads.
  **Fix**: Add explicit `width={600}` and `height={300}` to the map `<img>` element (matching the API request dimensions). CSS will still control the rendered size, but the browser can calculate the aspect ratio for space reservation.

- **Nearby carousel snap points are inconsistent**: The carousel uses `snap-x snap-mandatory` with `snap-start` on each card, but the container has `scroll-pl-4` padding that doesn't match the page-level `px-4`. On mobile, the first card aligns with the left edge of the content area, but subsequent snapped cards can stop at misaligned positions.
  **Fix**: Remove `scroll-pl-4` and use standard container padding. Or adjust to match the parent container's padding exactly.

## What Works Well

- **Two-column layout** (main content + sticky sidebar) is the right pattern for a detail page. Content flows naturally, and the sidebar gives quick-reference info.
- **Photo gallery** with prev/next buttons, thumbnail strip, and keyboard navigation is well-implemented and accessible.
- **Weather widget** with skeleton loading state provides good perceived performance.
- **Practical info card** with `<dl>` structure and consistent label/value rows is clean and scannable.
- **Beach status widget** with flag circle visualization is a smart real-time data integration.
- **Structured data (JSON-LD)** for Beach schema is excellent for SEO.
