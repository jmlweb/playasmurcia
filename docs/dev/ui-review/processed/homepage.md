# Design Directive: Homepage (`/`)

**File**: `src/routes/index.tsx`
**Reviewed**: 2026-03-28

---

## Critical (must fix)

- **Municipality cards too cramped on mobile**: 2-column grid at mobile viewport (375px) with `grid-cols-2` makes each card ~165px wide. The number badge (40px) + text + padding = no breathing room. Text like "San Pedro del Pinatar" wraps badly.
  **Fix**: Switch to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5` so mobile is single-column. Each card becomes a compact horizontal row at mobile width.

- **Hero subtitle contrast is borderline**: `text-ocean-100` (#d0eaf4) over the hero image + gradient overlay varies. With the current gradient (`from-ocean-900/70 via-ocean-900/60 to-ocean-900/90`), the middle area at 60% opacity risks dipping below 4.5:1 on lighter image areas.
  **Fix**: Increase the via stop to `via-ocean-900/75` for a more consistent minimum contrast floor.

## Important (should fix)

- **Region highlights third card tablet span**: `sm:col-span-2 lg:col-span-1` makes the "Aguas cristalinas" card stretch full width on tablet (768px). This breaks the visual rhythm of three equal-weight items.
  **Fix**: Remove `sm:col-span-2` and let all three cards stack naturally at `sm:grid-cols-2` (2+1 layout is fine) or switch to `sm:grid-cols-1 md:grid-cols-3` to keep them equal at all breakpoints.

- **Featured beaches section heading has no link to explore**: The "Playas que no te puedes perder" section has a CTA at the bottom but no "Ver todas" link aligned to the right of the heading, unlike the established pattern described in guidelines.
  **Fix**: Add a "Ver todas las playas" link right-aligned next to the section heading, using `text-ocean-600 hover:text-ocean-700 text-sm font-medium`.

- **No description text on beach cards**: Cards show only name + municipality. Compared to benchmark tourism sites, there's no teaser text, length, or key feature to differentiate cards without hovering.
  **Fix**: Add one line of secondary info below municipality: e.g., beach length or soil type. Use `text-xs text-gray-400` to keep it subtle. Keep it to a single line, truncated with `truncate`.

- **Hero buttons use different focus patterns**: Primary button uses `focus:ring-ocean-400 focus:ring-offset-ocean-900` (using `focus:` not `focus-visible:`). Secondary button uses `focus:ring-2 focus:ring-white/40`. Both should use `focus-visible:` per guidelines.
  **Fix**: Replace `focus:` with `focus-visible:` on both hero buttons. Primary: `focus-visible:ring-2 focus-visible:ring-ocean-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-900`. Secondary: `focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none`.

## Refinement (nice to have)

- **Municipality cards lack hover ring transition**: Cards have `ring-1 ring-gray-200/60` but the hover state adds `hover:ring-ocean-200` without a smooth ring-color transition.
  **Fix**: Add `transition-all` (already present) ensures ring-color animates, but also add `ring-ocean-200/0 hover:ring-ocean-200` to start transparent and transition in, avoiding the snap from gray to ocean.

- **Section divider inconsistency**: Municipalities section has `border-t border-gray-200` divider, Region highlights also has it. Featured beaches has no top border. The visual separation relies on background color alternation but the borders create redundancy.
  **Fix**: Remove `border-t border-gray-200` from the municipalities section since the bg switch from `sand-50` to `white` already provides separation. Keep it on region highlights which goes back to `sand-50`.

- **Hero animation stagger**: All fade-up animations use 100ms increments which works, but the CTA buttons at `[animation-delay:300ms]` means the user waits 900ms (300ms delay + 600ms duration) to see them. Feels slow.
  **Fix**: Reduce animation duration from 600ms to 400ms, or reduce delays to 0/75/150/225ms.

## What Works Well

- Hero composition is strong: full-bleed image with gradient overlay, clear hierarchical text, and two well-differentiated CTAs (solid primary + outlined secondary). This reads as confident and professional.
- Beach card design is polished: 4/3 aspect ratio image, weather badge, occupancy tag, and hover lift effect all work together without cluttering.
- The municipality section using number badges instead of images is a smart density play. Clean and scannable.
- Footer is comprehensive and well-organized with the 3-column grid and data badges.

**Severity summary**: Critical: 2, Important: 4, Refinement: 3
