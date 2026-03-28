# Cross-Cutting Design Directive

Issues that appear across multiple pages and should be addressed as a system, not page-by-page.

---

## Critical (must fix)

- **Nested `<main>` elements**: The root layout (`__root.tsx:403`) wraps `<Outlet />` inside `<main id="main-content">`, but every page component also renders its own `<main className="min-h-screen ...">`. This produces nested `<main>` tags — invalid HTML that confuses screen readers and breaks the landmark navigation model. There should be exactly one `<main>` per page.
  **Fix**: Remove the `<main>` wrapper from `__root.tsx` and keep the `id="main-content"` on each page's own `<main>`, OR remove `<main>` from all page components and rely solely on the root wrapper. The latter is cleaner — each page component should render a `<div>` or fragment, and the root owns the single `<main>`.

- **Service icons render as text IDs**: On the municipios page, service badges display the raw `icon` field value as text (e.g., "sunbeds", "parking", "showers") instead of the actual emoji character. The `<span aria-hidden="true">{service.icon}</span>` is outputting the icon ID string, not a visual icon. This looks broken and amateurish.
  **Fix**: Ensure the `icon` field in the services data contains the actual emoji character (e.g., "🛏️", "🅿️", "🚿") or map the string IDs to emoji/SVG icons in the component. Every service badge must show a recognizable icon, not a code name.

- **Active nav link class collision**: TanStack Router applies both `className` (base) and `activeProps.className` (active) simultaneously. The active "Inicio" link gets both `text-ocean-200` and `text-white` on the same element. These are conflicting Tailwind utilities — which one wins depends on CSS specificity/source order, not intent. The rendered HTML confirms the duplication.
  **Fix**: The `activeProps.className` must be the complete class string for the active state, OR use `activeProps` alone and conditionally apply the base classes. Do not merge conflicting color utilities.

## Important (should fix)

- **Inconsistent breadcrumb placement and presence**: Homepage and Explorer have no breadcrumb at all. Beach detail places it inside a white-background section. Municipios index and Collections pages place it after the hero in the content area. Municipality detail places it inside the dark hero overlay. Users rely on breadcrumbs for orientation — the inconsistency is disorienting.
  **Fix**: Standardize breadcrumbs across all pages. Every page except the homepage should have a breadcrumb immediately below the hero, inside the main content area (light background). Use the same component, same text style (`text-sm text-gray-500`), and same spacing (`mb-8`) everywhere. Homepage gets no breadcrumb (correct — it's the root).

- **Inconsistent hero section heights**: Municipality detail hero uses `py-12 sm:py-16` while all other inner pages use `py-20 sm:py-24 lg:py-28`. Homepage hero uses `py-16 sm:py-20 lg:py-28`. This creates a jarring visual jump when navigating between pages.
  **Fix**: Define two hero height tiers. **Homepage hero**: `py-16 sm:py-20 lg:py-28` (tall, immersive). **Inner page heroes**: `py-14 sm:py-16 lg:py-20` (compact, functional). Apply consistently.

- **No `prefers-reduced-motion` respect**: Multiple animations (`animate-fade-up` on homepage hero, `animate-slide-in-left` on filter panel, card hover `translate-y` transforms, image `scale` on hover) run regardless of the user's motion preference. This is a WCAG 2.1 AA requirement (2.3.3).
  **Fix**: Wrap all `@keyframes` definitions and transform-based hover effects in `@media (prefers-reduced-motion: no-preference) { ... }`. For the Tailwind utility classes, add a `motion-safe:` prefix to animation and transform classes (e.g., `motion-safe:hover:-translate-y-1`, `motion-safe:animate-fade-up`). In `src/styles.css`, add:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animate-fade-up,
    .animate-slide-in-left,
    .animate-dropdown {
      animation: none !important;
    }
  }
  ```

- **Footer copyright year hydration risk**: `new Date().getFullYear()` in `site-footer.tsx:94` runs at render time. If the HTML is cached at the edge and served across a year boundary, the SSR output could differ from the client hydration, causing a mismatch warning.
  **Fix**: This is low-risk but easily avoided. Either render the year on the server only (suppress hydration for that span) or hardcode the year and update it in a yearly chore.

## Refinement (nice to have)

- **Card padding inconsistency**: Beach cards use `p-5`, municipality cards use `p-6`, collection cards use `p-6`, nearby carousel cards use `p-3`. While some size variation is justified by context, the 5px vs 6px difference between beach cards and municipality/collection cards is arbitrary.
  **Fix**: Standardize card content padding to `p-5` for all standard-size cards. Use `p-3` only for compact/thumbnail cards (nearby carousel). This creates two clear tiers: standard (`p-5`) and compact (`p-3`).

- **Inconsistent use of `<a href>` vs `<Link to>`**: Some links use TanStack Router's `<Link>` component (homepage CTAs, nav links) while others use raw `<a href>` (municipality cards, collection cards, breadcrumbs, footer links). This inconsistency means some navigations get client-side routing while others trigger full page reloads.
  **Fix**: Use `<Link>` for all internal navigation. Reserve `<a>` for external links only.

- **Missing focus-visible on several interactive elements**: Some buttons and links have `focus:ring-2 focus:ring-ocean-500` while others have `focus-visible:underline`. The focus indication style should be consistent — either a ring or an underline, not both approaches mixed.
  **Fix**: Standardize on `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2` for buttons and card-like interactive elements. Use `focus-visible:underline focus-visible:text-ocean-600` for inline text links. Apply consistently.

## What Works Well

- **Coastal color palette** is cohesive and distinctive. The ocean/sand token system creates a clear brand without being garish.
- **Card hover effects** (translate-y + shadow elevation) are well-calibrated — subtle lift that feels responsive without being distracting.
- **Skip-to-content link** is present and correctly implemented in the root layout.
- **Sticky navbar with backdrop blur** on desktop is a solid contemporary pattern that maintains context without stealing viewport.
- **Consistent card shape language** (rounded-2xl, ring-1, shadow-sm) creates a unified surface system across all card types.
