# Cross-Cutting Design Issues

**Reviewed**: 2026-03-28

Issues that appear on 2+ pages and should be fixed systematically.

---

## Critical

### CC-1: Emoji icons render inconsistently across platforms

**Affected pages**: Municipios index (service icons), Colecciones index (thematic icons), Beach cards (weather icons)

Emoji are used as icons for services, collection themes, and weather indicators. Emoji rendering varies dramatically between macOS, Windows, Android, and Linux. The family emoji is a ZWJ sequence that fails on older devices. Weather emojis look different sizes across platforms.

**Fix**: Replace all functional emoji with SVG icons. Create a small icon component library (`src/components/icons/`) with consistent 20x20 or 24x24 SVGs for: weather conditions (6 icons), beach services (top 15), collection themes (12 icons), and activities. Use `currentColor` for fill/stroke so they respect the parent text color.

**Scope**: ~30-40 SVG icons to create. High effort but eliminates a whole category of cross-platform visual bugs.

---

## Important

### CC-2: Focus states inconsistently use `focus:` vs `focus-visible:`

**Affected pages**: Homepage (hero buttons), Beach detail, Navbar, All pages with interactive elements

Guidelines mandate `focus-visible:` over `focus:` to avoid showing focus rings on mouse clicks. Multiple elements use `focus:` instead:
- Homepage hero primary button: `focus:ring-ocean-400`
- Homepage hero secondary button: `focus:ring-2 focus:ring-white/40`
- Navbar mobile menu button: `focus:ring-ocean-400 focus:ring-2`
- Some `<a>` elements in navbar dropdown

**Fix**: Global search-and-replace `focus:ring` with `focus-visible:ring` and `focus:outline-none` with `focus-visible:outline-none` across all components.

### CC-3: Empty state visual treatment is inconsistent

**Affected pages**: Municipality detail, Collection detail, Explorer

Each page has a "no results" empty state but they differ:
- Municipality detail: `text-ocean-300` icon, `border-dashed border-gray-300`, `py-24`
- Collection detail: `text-gray-400` icon, `border-2 border-dashed border-gray-300`, `py-16`
- Explorer: `text-gray-300` icon, `border border-dashed border-gray-300`, `py-24`

Different icon colors, border widths, padding, and copy style.

**Fix**: Create an `EmptyState` component (`src/components/empty-state.tsx`) with consistent: `text-gray-300` icon, `border border-dashed border-gray-200`, `rounded-2xl py-20`, and slots for title, description, and optional action button.

### CC-4: Hero heading size tiers are not consistently applied

**Affected pages**: All pages with PageHero

The guidelines define two tiers but h1 sizes vary:
- Municipios index: `text-4xl sm:text-5xl` (correct for index)
- Colecciones index: `text-4xl sm:text-5xl` (correct for index)
- Coleccion detail: `text-4xl sm:text-5xl` (too large for detail)
- Municipio detail: `text-3xl sm:text-4xl` (correct for detail)
- Explorer: `text-3xl sm:text-4xl` (correct for detail/tool)

**Fix**: Standardize: index pages = `text-4xl sm:text-5xl`, detail/tool pages = `text-3xl sm:text-4xl`. Fix coleccion detail to use the detail tier.

### CC-5: Back/navigation links at page bottom use inconsistent copy

**Affected pages**: Municipality detail, Collection detail

- Municipality detail: "Ver todos los municipios"
- Collection detail: "Volver a colecciones"

Mixed verbs ("Ver todos" vs. "Volver a") and mixed formatting.

**Fix**: Standardize to "Volver a {collection}" or "Ver todos/as los/las {collection}" consistently.

---

## Refinement

### CC-6: Beach card grid gaps vary between pages

**Affected pages**: Homepage, Municipality detail, Collection detail, Explorer

- Homepage: `gap-x-4 gap-y-6 xl:gap-x-6 xl:gap-y-8`
- Municipality detail: `gap-6 sm:gap-5 xl:gap-6`
- Collection detail: `gap-5`
- Explorer: `gap-6 sm:gap-5 xl:gap-6`

**Fix**: Standardize to `gap-5 xl:gap-6` across all beach card grids. Homepage can keep slightly larger gaps for featured section.

### CC-7: Page indicator text pattern is duplicated

**Affected pages**: Municipality detail, Collection detail, Explorer

All three pages have nearly identical "Pagina X de Y (N playas)" text. This should be a shared component.

**Fix**: Extract to a `PageInfo` component.

---

**Summary**: Critical: 1, Important: 5, Refinement: 2
