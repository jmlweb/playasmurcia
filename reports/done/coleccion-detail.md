# Colección detail design directive (UI review 2026-03-29)

**URL**: `/colecciones/bandera-azul` — `src/routes/colecciones/$slug.tsx`

## Design Directive: Colección detail

### Critical (must fix)

- **Meta title orthography**: `head` fallback and titles use `Coleccion` without accent (`src/routes/colecciones/$slug.tsx` approx. 77, 82). Spanish UI and SEO should use **Colección**.
  **Fix**: Replace all user-visible/meta strings: `Colección no encontrada`, and ensure `title` template uses accented form.

### Important (should fix)

- **Controls row**: “Ordenar por” + pagination line matches other listings; keep spacing aligned with **#052** explorer adjustments.

### Refinement (nice to have)

- **Hero label**: `COLECCIONES DE PLAYAS` in hero — if rendered from shared `PageHero`, use proper accent in uppercase copy (`COLECCIONES` is fine; collection **not-found** meta is the main offender).

### What works well

- Breadcrumb depth and beach grid parity with municipio detail.

**Severity summary**: Critical: 1, Important: 1, Refinement: 1
