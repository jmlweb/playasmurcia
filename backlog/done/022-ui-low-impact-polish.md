# Task #022: UI Low-Impact Polish

## Metadata
- **Status**: pending
- **Priority**: P3 - Later
- **Slice**: UI
- **Created**: 2026-03-27
- **Started**: -
- **Blocked by**: -

## User Story

As a visitor, I want a polished, consistent UI so that the site feels professional and easy to use.

## Context

After completing the High + Medium Impact UI fixes (iterations 1-9), these Low Impact items remain. Some were already partially addressed during cross-cutting fixes. Items marked *(DONE)* were resolved during iterations 1-9 and are kept for traceability.

## Remaining Low Impact Items

### Home (`src/routes/index.tsx`, components)
- [ ] Hero subtitle text-lg doesn't scale — add `lg:text-xl` *(iteration-1 #11)*
- [ ] Empty state icon could use `text-ocean-300` for brand consistency *(iteration-1 #12)*
- [ ] BeachCard tags lack `group-hover` effect *(iteration-1 #13)*
- [x] ~~Missing `role="search"` on search bar~~ *(iteration-1 #14 — DONE iter 4)*
- [ ] FilterPanel rendered twice (mobile/desktop) with separate state *(iteration-1 #15)*

### Navbar / Layout (`src/routes/__root.tsx`)
- [ ] Logo text bump to `sm:text-lg` for brand presence *(iteration-2 #8)*
- [x] ~~Navbar links lack focus-visible~~ *(iteration-2 #9 — DONE iter 5)*
- [x] ~~Nav uses `<a>` instead of `<Link>`~~ *(iteration-2 #10 — DONE iter 5)*
- [ ] Wrap `<Outlet>` in `<main>` fallback landmark *(iteration-2 #11)*

### Beach Detail (`src/routes/playas/$slug.tsx`, components)
- [ ] "Sobre esta playa" heading bump to `text-2xl` *(iteration-3 #11)*
- [ ] Gallery thumbnail strip gradient fade-out on overflow *(iteration-3 #12)*
- [ ] Location map `onError` fallback for broken static image *(iteration-3 #13)*
- [ ] Contact info icons use gray-500, consider `text-ocean-400` *(iteration-3 #14)*
- [x] ~~Sidebar sticky positioning~~ *(iteration-3 #15 — DONE iter 6)*

### Municipality Listing (`src/routes/municipios/index.tsx`)
- [ ] Hero subtitle lacks `max-w-xl` constraint *(iteration-4 #8)*
- [x] ~~Breadcrumb focus-visible~~ *(iteration-4 #9 — DONE iter 2)*
- [ ] Remove redundant `title` on service tag spans *(iteration-4 #10)*

### Municipality Detail (`src/routes/municipios/$slug.tsx`)
- [ ] Beach grid responsive gap (`gap-6 sm:gap-5 xl:gap-6`) *(iteration-5 #7)*
- [ ] Add "Ver todos los municipios" link at bottom *(iteration-5 #8)*
- [ ] Simplify header/grid padding overlap *(iteration-5 #9)*

### Collections Index (`src/routes/colecciones/index.tsx`)
- [ ] Hero subtitle `max-w-xl` constraint *(iteration-6 #7)*
- [x] ~~Breadcrumb focus-visible~~ *(iteration-6 #8 — DONE iter 2)*
- [ ] Remove verbose inline type on `items.map` *(iteration-6 #9)*

### Collection Detail (`src/routes/colecciones/$slug.tsx`)
- [x] ~~Breadcrumb focus-visible~~ *(iteration-7 #7 — DONE iter 2)*
- [ ] Remove verbose inline type on `items.map` *(iteration-7 #8)*
- [ ] Add "Volver a colecciones" link at bottom *(iteration-7 #9)*

### Seas Comparison (`src/routes/mares/index.tsx`)
- [x] ~~Breadcrumb gray-400~~ *(iteration-8 #8 — DONE iter 1)*
- [ ] Hero subtitle `max-w-xl` constraint *(iteration-8 #9)*
- [ ] Display `totalLength` on sea cards *(iteration-8 #10)*
- [ ] Grid `gap-8` scale on desktop *(iteration-8 #11)*

### Beach Comparator (`src/routes/comparar/index.tsx`)
- [x] ~~Breadcrumb gray-400~~ *(iteration-9 #10 — DONE iter 1)*
- [ ] Table headers with beach thumbnail images *(iteration-9 #11)*
- [ ] Alternating row colors (`even:bg-gray-50/50`) *(iteration-9 #12)*
- [x] ~~Breadcrumb focus-visible~~ *(iteration-9 #13 — DONE iter 2)*

## Acceptance Criteria

- All unchecked items above are implemented
- Build passes without errors
- No visual regressions on existing High/Medium fixes
