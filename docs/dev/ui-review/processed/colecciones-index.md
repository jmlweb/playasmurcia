# Design Directive: Colecciones Index (`/colecciones`)

**File**: `src/routes/colecciones/index.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

(None)

## Important (should fix)

- **Section headings feel redundant with labels**: "POR MAR" label + "Segun su mar" heading, and "POR TEMATICA" label + "Segun tus preferencias" heading. The label and heading say essentially the same thing. This wastes vertical space and creates a stuttering reading experience.
  **Fix**: Drop the h2 headings and let the uppercase labels carry the section identity. Or, make the labels more descriptive and drop them: just use `h2` with "Playas por mar" and "Colecciones tematicas". One heading per section, not two.

- **Colored accent bar height feels thin**: The `h-2` (8px) bar at the top of each card is noticeable but at the limit of being decorative vs. invisible on mobile. At 375px width, 8px is fine, but the visual weight is minimal.
  **Fix**: Increase to `h-2.5` (10px) for slightly more presence, or keep `h-2` but ensure the bar color is saturated enough. Current colors (teal-500, amber-500, etc.) are fine.

- **Thematic icons are emoji-based**: Same issue as municipios service pills. `ThematicIcons` uses emoji which render inconsistently across platforms. The family emoji is particularly problematic - it's a ZWJ sequence that breaks on older Android browsers.
  **Fix**: Replace with SVG icons inside the colored circles. Each collection has a clear theme that maps to simple icons (palm tree, family, dog, sun, cocktail, flag, snorkel, surf, sunset, meditation, wheelchair, camera).

- **Sea collection cards lack visual differentiation from thematic cards**: Both use the same card structure (bar + icon + title + description + footer). The seas section is supposed to be "featured" but visually it's just a 2-column version of the 3-column thematic grid.
  **Fix**: Make sea cards taller or wider with more visual presence. Options: (a) add a background gradient or tinted background to the card body, (b) use a larger icon (h-14 w-14 instead of h-10 w-10), or (c) add a subtle wave illustration or pattern to the card header area.

## Refinement (nice to have)

- **Card grid gap difference between sections**: Seas use `gap-5` and thematic uses `gap-5 xl:gap-6`. This is close enough but the xl breakpoint shift should be consistent.
  **Fix**: Use `gap-5 xl:gap-6` for both grids.

- **Section divider border**: `border-t border-gray-200 pt-10` between seas and thematic sections is functional but the padding above the border is `mb-14` (from the seas section) + the border + `pt-10`. Total gap is ~96px + border, which is generous.
  **Fix**: Reduce seas section `mb-14` to `mb-10` for a tighter but still clear separation.

## What Works Well

- The two-tier layout (featured seas + thematic grid) creates a clear information hierarchy. Users immediately see the primary geographic split before diving into themes.
- Card design with colored accent bars is genuinely effective. Each collection has a distinct identity at a glance without needing images. This is a smart solution for a category that doesn't have natural imagery.
- Footer links and beach counts on each card give immediate value assessment.
- The page feels complete and well-organized. It's one of the strongest pages on the site from an information architecture standpoint.

**Severity summary**: Critical: 0, Important: 4, Refinement: 2
