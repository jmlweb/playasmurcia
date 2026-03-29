# Home page design and motion review (`/`)

**Scope:** Home route (`/`). In dev, `pnpm dev` defaults to port **3000** per `package.json`; the actual URL follows whatever port Vite binds to (e.g. `http://localhost:3003/` if 3000 is in use).  
**Method:** Code review of `src/routes/index.tsx`, `src/components/beach-card.tsx`, `src/styles.css`, aligned with `docs/ui-guidelines.md`.  
**Note:** Automated review environments may not reach the developer’s loopback; re-check in a local browser or Cursor’s browser tab on the printed dev URL. Initial findings were based on source and project guidelines; live snapshot on dev confirmed structure and the former “dias” copy before the fix below.

## Strengths

1. **Hero** — Full-bleed image, `ocean-900` gradient, and scaled typography give clear hierarchy. Staggered `animate-fade-up` with animation delays is a solid editorial reveal pattern.

2. **Accessible motion** — `prefers-reduced-motion: reduce` disables entrance animations and panel/dropdown motion; card hovers use `motion-safe:` for translate/scale. Matches accessibility and “polished product” expectations.

3. **Beach cards** — Combined lift, shadow, and slow image zoom (`scale-105`, `duration-500`) support a content-first feel without distraction.

4. **Section rhythm** — Alternating `sand-50` / white, `max-w-7xl`, and consistent vertical padding match documented layout patterns.

## Suggested improvements

### A. Motion quality (without breaking minimalism)

| Area | Suggestion |
|------|------------|
| **Easing** | Replace generic `ease-out` everywhere with a small set of custom `cubic-bezier` curves or slightly different durations per hero layer for a more intentional stagger. |
| **Scroll** | Add viewport-triggered reveals (e.g. Intersection Observer + opacity/translate) for featured beaches, municipalities, and highlights. Honor `prefers-reduced-motion`. |
| **CTAs** | Subtle `translateX` on the arrow icon on hover/focus links action to semantics (common on award-style sites). |
| **View Transitions API** | Optional route transitions (e.g. home → explorar) if compatible with the router setup. |

### B. Hero depth

- Very subtle background parallax on scroll (disabled when reduced motion) or an extremely slow Ken Burns on desktop only — measure LCP and avoid main-thread overload.
- Optional low-opacity noise/SVG texture over the gradient to reduce banding on OLED and add editorial texture.

### C. Typography and copy

- Inter stack is appropriate for UI. A single display face **only** for the hero H1 could add distinction without breaking the system.
- **Copy (addressed):** Highlight title now uses **“300 días de sol”** in `src/routes/index.tsx` (was “300 dias de sol”).

### D. Interaction consistency

- Align hover durations/easing between municipality tiles and beach cards via shared tokens (CSS variables or utilities).
- Stronger `:active` states on primary buttons for mobile tap feedback.

### E. Performance

- New hero motion should prefer `transform`/`opacity`; use `will-change` sparingly and only while animating.
- Consider shorter animation durations on small viewports if needed.

## Executive summary

The home page already has strong fundamentals: clear hierarchy, cohesive coastal palette, hero entrance motion, and well-judged card hovers with reduced-motion support. The step toward “site of the day” polish usually comes from **scroll-triggered motion**, **refined easing and CTA micro-interactions**, and **subtle hero depth**, while staying content-first per project guidelines.
