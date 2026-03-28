# Design Directive: Beach Detail (`/playas/$slug`)

**File**: `src/routes/playas/$slug.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

- **No hero section - inconsistent with every other page**: Beach detail is the only page without a PageHero or gradient hero. It jumps straight from the navbar to a white background with breadcrumb + title. This creates a jarring visual break when navigating from any other page. The beach detail is arguably the most important page on the site.
  **Fix**: Either (a) add a PageHero with the beach name and municipality, placing the gallery below it, or (b) use the first beach photo as a full-width hero image with gradient overlay and beach name on top (similar to homepage hero but shorter). Option (b) is stronger for a tourism site - it creates an emotional connection immediately.

- **Gallery shows single image without grid layout**: The `PhotoGallery` component renders what appears to be a single photo. For a beach detail page on a tourism site, this is a critical missed opportunity. Users need to see multiple angles.
  **Fix**: If the beach has multiple pictures, display a gallery grid: 1 large image (2/3 width) + 2 smaller stacked images (1/3 width) on desktop. Show a horizontal scroll carousel on mobile. If only 1 image exists, show it full-width with a taller aspect ratio (`aspect-[16/9]` instead of implied auto).

## Important (should fix)

- **Tags section placement next to h1 is awkward**: `flex-wrap items-start gap-4` between the title `div` and the `TagsSection` creates an uneven top alignment. On mobile, the tags wrap below the title but with the same gap, looking disconnected.
  **Fix**: Move tags below the subtitle (municipality name), as a row: `mt-3 flex flex-wrap gap-2`. This groups all beach identity info (name + location + type tags) into a single visual block.

- **Content cards lack consistent heading sizes**: "Sobre esta playa" uses `text-xl font-semibold`, "Actividades" uses whatever `ActivitiesGrid` defines, and "Como llegar" uses `text-xl font-semibold`. Need to verify all section headings inside cards use the same size.
  **Fix**: Ensure all section h2 elements inside the white content cards use `text-xl font-semibold text-gray-900` consistently. The components `ServicesGrid` and `ActivitiesGrid` should follow the same heading pattern.

- **Sidebar sticky offset may collide with navbar**: `lg:sticky lg:top-20` (80px) assumes a specific navbar height. The navbar padding is `py-4` with text, likely ~64px. The 80px offset leaves 16px gap which is fine, but if the navbar ever changes this breaks silently.
  **Fix**: This is acceptable but worth documenting. Consider using a CSS custom property `--nav-height: 4rem` and reference it: `top: calc(var(--nav-height) + 1rem)`.

- **Breadcrumb is inside the white bg-white section instead of below hero**: Per guidelines, breadcrumbs should be "below the hero, inside the main content area (light background)". Since this page has no hero, the breadcrumb sits inside `bg-white` at the top. This is inconsistent - all other pages place breadcrumbs in the `sand-50` area.
  **Fix**: When adding a hero (per Critical item above), move the breadcrumb below it into the `sand-50` content area, consistent with other pages.

## Refinement (nice to have)

- **Description section text could be more readable**: `leading-relaxed text-gray-600` at base font size creates long lines on desktop in the 2/3 column. Line length exceeds 80 characters on wide screens.
  **Fix**: Add `max-w-prose` (65ch) to the description paragraph, or use `text-base leading-7` for slightly more generous line height.

- **Map section**: The `LocationMap` component renders a link/placeholder. An embedded map would be more useful, but that's a feature, not a design issue.

- **No visual separation between sidebar widgets**: Sidebar widgets stack with `space-y-6` but all have the same visual treatment. The weather widget (time-sensitive, high-value) looks the same as contact info (static, low-urgency).
  **Fix**: Give the weather widget a subtle accent: `border-l-4 border-ocean-400` or a tinted background `bg-ocean-50/50` to visually elevate it above the static cards.

## What Works Well

- The two-column layout (content + sidebar) is appropriate for this content type. It follows established travel/property detail page patterns.
- White content cards with `rounded-2xl border border-gray-200/60 shadow-sm` feel polished and consistent.
- The `NearbyCarousel` component provides good discovery. Horizontal scroll for related beaches is the right pattern.
- Practical info card with structured data (length, soil, orientation, etc.) is genuinely useful content.

**Severity summary**: Critical: 2, Important: 4, Refinement: 3
