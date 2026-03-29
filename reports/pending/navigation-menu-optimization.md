# Design Directive: Navigation menu optimization

**Scope**: `src/routes/__root.tsx`, `src/components/site-footer.tsx`
**Date**: 2026-03-29

---

## Current structure

```
Navbar (sticky)
├── Brand "Playas de Murcia" → /
├── Inicio → /
├── Explorar → /explorar
├── Colecciones → /colecciones
└── Descubrir (hover dropdown / mobile accordion)
    ├── Left column: all municipalities → /municipios/{slug} (with beach count)
    └── Right column: 5 characteristic collections → /colecciones/{slug}
        └── "Ver todas las playas" → /explorar
```

---

## Critical (must fix)

### C1. Remove redundant "Inicio" link

The brand wordmark already links to `/`. A separate "Inicio" item wastes prime navbar real estate and adds visual noise. This is a well-established web convention — users expect the logo/brand to be the home link.

**Fix**: Remove the "Inicio" entry from `simpleNavLinks`. Ensure the brand `<Link to="/">` remains.

### C2. Resolve "Explorar" vs "Descubrir" semantic overlap

Both words mean roughly the same thing in Spanish. Additionally, the "Ver todas las playas" link inside the Descubrir dropdown points to `/explorar`, creating a circular reference. Users cannot reliably predict which entry leads where.

**Fix**: Rename the top-level "Explorar" link to **"Playas"** (direct, describes the content). This clearly differentiates it from the "Descubrir" dropdown and better matches user intent — they are looking for beaches, not an abstract action.

### C3. Promote "Municipios" to top-level navigation

Municipalities are a primary navigation dimension (geographic), yet the only way to reach `/municipios` is by opening the dropdown and picking a specific town. The `/municipios` index page exists but has zero direct entry points in the menu.

**Fix**: Add **"Municipios"** as a top-level nav link pointing to `/municipios`. This gives geographic browsing equal weight with thematic browsing (Colecciones).

---

## Important (should fix)

### I1. Simplify the "Descubrir" dropdown content

The current mega-menu lists every municipality and 5 collections, mixing two unrelated taxonomies (geography + theme) in one panel. This creates cognitive overload — the user must scan two dense columns to find what they want.

**Fix**: Reduce the dropdown to a curated quick-access panel:
- **Left column**: Top 4-5 municipalities by beach count + "Ver todos los municipios →" link to `/municipios`.
- **Right column**: Top 3-4 most popular collections + "Ver todas las colecciones →" link to `/colecciones`.

This turns the dropdown from an exhaustive directory into a shortcut launcher. Users who want the full list go to the dedicated index pages (now directly accessible via top-level links).

### I2. "Colecciones" absorbs "Características"

The 5 "Características" in the dropdown are `/colecciones/*` routes. Having them in a separate section labeled differently from the "Colecciones" top-level link creates a false dichotomy — users don't know whether to click "Colecciones" or open "Descubrir" to find thematic groupings.

**Fix**: Once I1 is implemented, the dropdown's right column naturally becomes a preview of collections. The "Colecciones" top-level link becomes the canonical entry point for all thematic browsing, removing ambiguity.

### I3. Active state for nested routes

Currently, only exact path matches trigger active styling on nav links. Visiting `/municipios/cartagena` does not highlight "Municipios" in the navbar — the user loses their position in the site hierarchy.

**Fix**: Use a `startsWith` or fuzzy match for active states:
- `/municipios/*` highlights "Municipios"
- `/colecciones/*` highlights "Colecciones"
- `/explorar*` highlights "Playas"
- `/playas/*` could highlight "Playas" (since beach detail is a child of the exploration flow)

TanStack Router supports `activeOptions={{ exact: false }}` or custom `isActive` logic to achieve this.

### I4. Mobile: consider bottom tab bar

The hamburger menu hides all navigation behind a tap, reducing discoverability. With only 3-4 top-level items after the restructure (Playas, Municipios, Colecciones, and optionally a search icon), a fixed bottom tab bar is viable and offers:
- Persistent visibility of all primary destinations.
- One-tap navigation (vs. two taps with hamburger: open menu + select item).
- Thumb-friendly positioning on modern large-screen phones.

**Fix**: Below `sm` breakpoint, render a fixed bottom bar with icon + label for each top-level destination. Hide the hamburger and top nav links on mobile. Keep the sticky top bar for brand + optional search icon only.

---

## Nice to have

### N1. Search affordance in the navbar

For a catalog of ~100 beaches, direct name search is often faster than navigating through filters. A search icon in the navbar (opening a modal/command palette) would give power users an instant path to any beach.

**Fix**: Add a magnifying glass icon button to the right side of the navbar. On click/tap, open a modal with an autofocus text input that searches beaches by name, municipality, or collection. Could reuse the existing `/explorar` search param `q` under the hood.

### N2. Align footer structure with new navbar

The footer currently mirrors the old navbar structure (all municipalities + 5 characteristics). After the navbar restructure, the footer should match.

**Fix**: Update `site-footer.tsx` to reflect the simplified taxonomy:
- Column 1: Brand + tagline (keep as-is).
- Column 2: Top municipalities + "Ver todos →" (instead of exhaustive list).
- Column 3: Top collections + "Ver todas →", plus quick links.

---

## Proposed final structure

```
Navbar (sticky)
├── [Brand] → /
├── Playas → /explorar                 (renamed from "Explorar")
├── Municipios → /municipios           (promoted from dropdown)
├── Colecciones → /colecciones         (unchanged)
└── Descubrir (dropdown)               (simplified)
│   ├── Top municipalities + "Ver todos →"
│   └── Popular collections + "Ver todas →"
└── [Search icon] (optional)

Mobile (< sm)
├── [Brand] → /
└── Bottom tab bar: Playas | Municipios | Colecciones | [Search]
```
