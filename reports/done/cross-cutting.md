# Cross-cutting design directive (UI review 2026-03-29)

Scope: patterns that appear on multiple routes or in the global shell (`__root.tsx`, shared components).

## Design Directive: Global shell & shared components

### Critical (must fix)

- **404 numeric headline contrast**: `notFoundComponent` in `src/routes/__root.tsx` (approx. lines 88–95) uses `text-ocean-200` for the large “404” glyph on `bg-sand-50`. Light cyan on warm off-white is far below WCAG AA for text of any practical size. The error state reads as “washed out” and fails the same contrast bar as body copy.
  **Fix**: Use at least `text-ocean-700` or `text-gray-900` for the “404” display value; keep supporting copy at `text-gray-500` / `text-gray-900` per empty-state patterns in `docs/ui-guidelines.md`. Ensure the primary heading (`Página no encontrada`) stays the dominant semantic and visual focus.

- **Service chips show raw machine tokens**: On `src/routes/municipios/index.tsx` (approx. 122–131), `ServiceIcon` is called with `emoji={service.icon}`. The SVG map in `src/components/icons.tsx` (`serviceIconMap`, approx. 188–203) is keyed by **logical ids** (e.g. `chiringuito`, `wheelchair-ramp`), while `data/services.json` stores **emoji** in `icon`. Turso rows may store ids or mixed values in `icon`, producing visible strings such as `wheelchair` next to “Rampa Accesible” (full-page screenshot, municipios index cards).
  **Fix**: Resolve icons by **`service.id`** (maps to `service_id` in DB) first; use `icon` only as a deprecated fallback for migration. Align all seed/migration data so `icon` is either emoji or empty, and document the single source of truth in `docs/data-schema.md` if needed.

### Important (should fix)

- **“Descubrir” popover trigger focus**: `Popover.Trigger` in `src/routes/__root.tsx` (`NavDropdown`, approx. 156–159) uses `focus-visible:underline` only. `docs/ui-guidelines.md` requires `focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2` (with offset tuned for dark nav) for interactive controls.
  **Fix**: Add a ring + `outline-none` on the trigger; match offset to `bg-nav` so the ring remains visible.

- **Dropdown panel links**: Inner `Link` items use `focus-visible:outline-none` with background change only (approx. 218–221, 245–248). Consider a 2px ring or clear inset outline so keyboard focus is visible on `bg-ocean-800` panels.

### Refinement (nice to have)

- **TanStack devtools**: Only rendered when `import.meta.env.DEV` (`__root.tsx` approx. 492–504). Screenshot overlap during review is expected in dev; no production change.

- **Footer copyright year**: `SiteFooter` uses `new Date().getFullYear()` (`site-footer.tsx` approx. 109–110) — correct; ignore static year noise in cached screenshots.

### What works well

- Skip link, sticky nav, and coastal palette remain coherent across pages.
- Breadcrumbs consistently sit below hero on light background, matching guidelines.

**Severity summary**: Critical: 2, Important: 2, Refinement: 2
