# UI review — cross-cutting findings (2026-03-30)

Auditor role: UI designer per `.claude/agents/ui-designer.md`. Method: Playwright full-page screenshots (desktop 1280×800, mobile 375×812) against `http://localhost:3000`, plus source review.

## Design Directive: Cross-cutting

### Critical (must fix)

- **Below-the-fold content is invisible until scroll (homepage and any `.reveal` usage).** Sections use `.reveal` with initial `opacity: 0` and `transform: translateY(1.5rem)` in `src/styles.css` (lines 159–165). `useScrollReveal` in `src/hooks/use-scroll-reveal.ts` adds `.revealed` only after `IntersectionObserver` fires. On a tall viewport or in automation (full-page screenshot, E2E), blocks that never intersect the viewport stay transparent—users see a long empty band between hero and footer. Users without JS or with delayed hydration see the same failure mode.
  **Fix**: Do not gate **semantic body content** on opacity 0. Prefer: (a) default visible (`opacity: 1`) and animate only with `@media (prefers-reduced-motion: no-preference)` plus a class that is **pre-applied** for first N sections or for `content below the fold` use `rootMargin: '200px'` or similar to reveal before enter; or (b) SSR/hydration-safe pattern: add `revealed` in markup for critical sections; or (c) replace scroll-reveal on listing sections with a non-hiding entrance (e.g. only subtle transform on motion-safe). Verify with full-page screenshot and `pnpm test` / visual regression.

### Important (should fix)

- **Dev-only TanStack devtools overlap page content.** `src/routes/__root.tsx` (~490–501) renders `TanStackDevtools` with `position: 'bottom-right'` when `import.meta.env.DEV`. Screenshots show the floating control overlapping municipality cards (e.g. Municipios index).
  **Fix**: Move devtools to a corner that does not cover cards (e.g. bottom-left), reduce footprint, or scope z-index so it sits above an empty margin only—not over interactive cards.

- **Placeholder imagery density on listing grids.** Multiple beach cards show neutral gradient placeholders (Explorer, collection detail, municipality detail). Hurts perceived quality and scanability.
  **Fix**: Coordinate with existing content/image tasks (`backlog/pending/017`, `082`, `078`): prioritized thumbnails, consistent placeholder component with label (“Sin foto”), or slimmer card ratio until assets exist.

### Refinement (nice to have)

- **Motion system documentation.** `docs/ui-guidelines.md` does not yet forbid “invisible until revealed” for primary content. After implementation, add a short rule: scroll effects must not hide primary content on first paint; `prefers-reduced-motion` already neutralizes `.reveal` in CSS (lines 201–212)—align JS behavior with that guarantee for all users.

### What works well

- **Nav + footer system** is consistent (ocean palette, typography pairing serif headings + sans UI).
- **Beach cards** share a coherent module (weather, occupancy pill, tag row) across Explorer, municipios, and colecciones.

**Severity summary:** Critical: 1, Important: 2, Refinement: 1
