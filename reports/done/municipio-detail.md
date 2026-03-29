# Municipio detail design directive (UI review 2026-03-29)

**URL**: `/municipios/cartagena` — `src/routes/municipios/$slug.tsx`

## Design Directive: Municipio detail

### Critical (must fix)

- None beyond listing/grid patterns shared with explorer and collections.

### Important (should fix)

- **Breadcrumb + sort row at ~375px**: Backlog **#052** already requires verifying no overlap between breadcrumbs and “Ordenar por”. Desktop screenshot shows comfortable spacing; verify in browser at 375px after **#052**.

### Refinement (nice to have)

- **Pagination + back link**: Spacing between pagination and “← Volver a municipios” is adequate; align `mt-*` with collection detail for pixel parity.

### What works well

- Inner hero tier (`text-3xl` / `sm:text-4xl`) matches `docs/ui-guidelines.md` detail sub-tier.
- Beach card grid matches explorer/collection visual language.

**Severity summary**: Critical: 0, Important: 1, Refinement: 1
