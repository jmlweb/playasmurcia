# Design Directive: Homepage

Route: `src/routes/index.tsx` | URL: `/`

---

## Critical (must fix)

- **Two consecutive white-background sections break visual rhythm**: The "Municipios costeros" section (`bg-white`) and "Region highlights" section (`bg-white`) sit back-to-back with only a thin `border-t border-gray-200` between them. The UI guidelines explicitly call for alternating between white and sand-50 backgrounds to create section separation. Currently the bottom half of the homepage reads as one undifferentiated white block.
  **Fix**: Change the region highlights section background to `bg-sand-50` (remove `bg-white` and `border-t`). The pattern should be: Hero (ocean) → Featured beaches (sand-50) → Municipalities (white) → Region highlights (sand-50) → Footer (ocean-900).

## Important (should fix)

- **Region highlights section has no heading or context**: Three link cards ("Dos mares", "300 dias de sol", "Aguas cristalinas") appear with no section title or introduction. The user has no way to understand what this group represents or why it's there. It reads as orphaned content.
  **Fix**: Add a section header following the same pattern as "Featured beaches" and "Municipios costeros": a `text-sm font-semibold uppercase tracking-wider text-ocean-600` label (e.g., "Descubre la costa") and an `h2 text-3xl font-bold` heading (e.g., "Lo que hace unica a la Costa Calida"). This also improves SEO by giving the section semantic structure.

- **No search functionality on homepage hero**: The UI guidelines specify "Prominent search bar in hero section" but the homepage hero only has two CTA buttons. For a beach discovery site, search is a primary user intent — burying it only in the Explorer page forces an extra click.
  **Fix**: Add a search bar below the subtitle and above the CTA buttons. Use the same `SearchBar` component from the Explorer, styled with the white/translucent treatment already used there (`bg-white/95 backdrop-blur-sm shadow-lg`). On submit, navigate to `/explorar?q={query}`.

- **Municipality cards on homepage are visually weak**: The municipality section uses minimal text-only cards (`rounded-xl bg-sand-50 px-4 py-5 ring-1 ring-gray-200/60`) that feel like a list, not a visual navigation element. Compare to the municipality cards on `/municipios` which at least have service badges. The homepage versions lack any visual hook — no icons, no beach count prominence, no imagery.
  **Fix**: Give the homepage municipality cards more visual weight. Add a subtle icon or the municipality's beach count as a prominent number. Consider: a larger font for the municipality name (`text-lg font-semibold`), the beach count as a badge aligned right, and a subtle `→` indicator. Minimum: increase vertical padding to `py-6` and add a left accent border or icon.

- **Featured beach grid gap is too tight on mobile**: The grid uses `gap-x-4 gap-y-6` on mobile, but at 375px viewport the single-column cards have only 16px horizontal padding. The card shadows and rounded corners need more breathing room from the viewport edges.
  **Fix**: Increase horizontal padding in the featured section from `px-4` to `px-5` on mobile. Increase `gap-y-6` to `gap-y-7` for more vertical breathing room between stacked cards.

## Refinement (nice to have)

- **Hero animation stagger feels mechanical**: The `[animation-delay:100ms]`, `[animation-delay:200ms]`, `[animation-delay:300ms]` creates a rigid 100ms stagger. More natural motion uses an accelerating curve — shorter delays at first, longer at the end.
  **Fix**: Adjust delays to `[animation-delay:80ms]`, `[animation-delay:200ms]`, `[animation-delay:380ms]` for a more organic cascading feel.

- **Hero CTA buttons could have stronger hierarchy**: The primary ("Explorar todas las playas") and secondary ("Ver colecciones") buttons are nearly the same visual weight. The secondary border button with `border-white/20` is barely visible against the dark hero.
  **Fix**: Increase secondary button border opacity to `border-white/30`. Add a very subtle background: `bg-white/5`. This maintains the primary/secondary distinction while making the secondary button more discoverable.

- **"Ver las 194 playas" CTA at bottom of featured section**: This button uses `bg-ocean-600` while the hero CTA uses `bg-ocean-500`. Both are primary actions but use different shades.
  **Fix**: Use `bg-ocean-500` consistently for all primary action buttons, `bg-ocean-600` for secondary solid buttons. Match the hero CTA treatment.

## What Works Well

- **Hero composition** is strong — the hero image with gradient overlay, staggered text animation, and dual CTA creates an inviting first impression.
- **Featured beaches section** has clean card grid with good responsive breakpoints (1→2→3→4 columns).
- **Section header pattern** (uppercase label + bold heading) is elegant and consistent where applied.
- **Municipality hover interaction** (translate-y + shadow + ring color change) provides clear feedback without being over-animated.
