# Design Directive: Municipios Index (`/municipios`)

**File**: `src/routes/municipios/index.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

- **Municipality cards are text-only in a visually-driven tourism site**: Every other card type on the site (beach cards, collection cards) has either an image or a colored accent bar. Municipality cards are plain white with text + service pills. For a page representing entire coastal regions, this feels like an admin panel, not a tourism site.
  **Fix**: Add a subtle visual identity to each card. Options (in order of preference):
  1. A small header image per municipality (even a generic coastal shot) with `aspect-[3/1]` above the text content
  2. A gradient or colored accent bar at the top (like collection cards have), using the ocean palette
  3. At minimum, a larger icon or illustration element

## Important (should fix)

- **Service pills use emoji icons that render inconsistently**: `service.icon` renders as emoji (visible in the screenshots: umbrella, shower, parking icons). Emoji rendering varies across OS, browsers, and screen sizes. Some emojis render as colorful images on iOS but as outlines on Windows.
  **Fix**: Replace emoji service icons with consistent SVG icons. Use a small icon set (e.g., inline SVGs or a sprite) for the top 10-15 services. This also improves performance (no emoji font loading variance).

- **Card grid density on desktop**: 3 columns (`xl:grid-cols-3`) with 9 cards creates a 3x3 grid that fills the page. But on standard desktop (1280px) the cards are quite wide (~380px) for the amount of content inside them, leaving large whitespace gaps.
  **Fix**: Consider `sm:grid-cols-2 lg:grid-cols-3` (already close) but tighten the card padding from `p-6` to `p-5` and reduce `gap-5` to `gap-4` for a more compact feel.

- **"Ver playas" arrow text link is lonely at card bottom**: The `mt-auto` pushes it to the bottom, but there's no other element to balance it. It sits alone in the card footer with a lot of whitespace above it.
  **Fix**: Add a subtle right-aligned beach count badge next to the "Ver playas" link, similar to collection cards which show count + link on the same row.

## Refinement (nice to have)

- **Blue flag badge emoji**: The emoji for blue flag is semantically wrong (beach umbrella, not a flag). Blue flag should use a flag icon or custom SVG.
  **Fix**: Replace with an appropriate blue flag SVG icon or at minimum a flag emoji to match the colecciones page.

- **Hero subtitle reads flat**: "9 municipios con 194 playas en la Region de Murcia" is informative but doesn't inspire. Compare to the homepage hero which uses evocative language.
  **Fix**: Consider: "Desde Aguilas hasta San Javier, 194 playas esperan" or similar. Keep the stats but add geographic flavor.

## What Works Well

- The PageHero component provides consistent visual framing across all inner pages. The gradient + decorative blur circle is subtle and professional.
- Card hover states (translate-y-1 + shadow-lg + ring-ocean-200) match the beach card behavior exactly. Good consistency.
- The page is fast and scannable. For a municipality index, the density of information per card (name, beach count, blue flags, top services) gives enough context to choose without overwhelming.

**Severity summary**: Critical: 1, Important: 3, Refinement: 2
