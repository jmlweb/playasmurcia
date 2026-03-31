# UI review — system states & nav consistency (2026-03-30, follow-up)

Auditor role: UI designer per `.claude/agents/ui-designer.md`. Method: `curl` verification of `http://localhost:3000`, full-page Playwright screenshot of a non-existent path (`/this-route-does-not-exist-xyz` → `scripts/screenshot.ts`), plus source review of `src/routes/__root.tsx` and `src/components/site-footer.tsx`.

These items are **additive** to `reports/done/ui-review-2026-03-30-*.md` and are not duplicates of the cross-cutting scroll-reveal, devtools overlap, or placeholder imagery findings.

## Design Directive: Mobile “Descubrir” vs desktop popover labels

### Important (should fix)

- **Same link set, two different section titles.** Desktop `NavDropdown` labels the characteristics/collections column **“Colecciones”** (`__root.tsx` ~248–250). `MobileDropdown` labels the same links **“Características”** (~338–339). Users switching between breakpoints get conflicting IA vocabulary for identical destinations.
  **Fix**: Pick one label (recommend **“Colecciones”** to match the `/colecciones` route and footer column) and use it in both popover and mobile sheet. If “characteristics” is intentional in Spanish UX, rename the desktop column to match instead — consistency matters more than which word wins.

**Severity summary:** Critical: 0, Important: 1, Refinement: 0

---

## Design Directive: 404 recovery & CTAs

### Important (should fix)

- **404 offers only one path out.** `notFoundComponent` (`__root.tsx` ~119–134) provides a single primary **“Volver al inicio”** control. `RootErrorComponent` (~86–112) pairs **Reintentar** with a secondary outline **Volver al inicio**. Stranded users on 404 (typos, dead bookmarks) have no inline path to **Explorar** or **Colecciones** without scrolling to the header/footer.
  **Fix**: Add a secondary text or outline control row: e.g. **“Ver todas las playas”** → `/explorar`, **“Colecciones”** → `/colecciones`, using the same button hierarchy as the error component (primary + secondary). Keep visual weight: one primary, max two secondaries in one row on desktop; stack on narrow viewports.

**Severity summary:** Critical: 0, Important: 1, Refinement: 0

---

## Design Directive: Landmark structure on global error & 404

### Important (should fix)

- **No `<main>` on root-level error and not-found UIs.** Successful routes wrap content in `<main>` (e.g. `index.tsx`, `explorar/index.tsx`). `notFoundComponent` and `RootErrorComponent` render a bare `<div>` inside `#main-content` (`__root.tsx` ~475–485). The skip link target is a `div`, not a landmark region — screen reader “skip to main” patterns expect a `main` role.
  **Fix**: Wrap each of `notFoundComponent` and `RootErrorComponent` outer containers in `<main className="…" id="main-content">` **or** change the root wrapper from `<div id="main-content">` to `<main id="main-content">` and remove redundant inner `<main>` from route files (larger change). Minimum viable: add `<main>` inside the two system components with the same min-height/centering classes and keep one visible `h1` per view.

**Severity summary:** Critical: 0, Important: 1, Refinement: 0

---

### What works well

- **404** keeps global chrome (nav + footer); the page does not feel like a dead end visually.
- **Numeric code** (`404` in `text-ocean-700`) reads clearly on `sand-50` and matches the coastal palette.

---

## Session totals (this file only)

**Issues found:** Critical: 0, Important: 3, Refinement: 0

When these are task-backed, move this file to `reports/done/` and link from new backlog tasks per `AGENTS.md`.
