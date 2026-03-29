# Explorar design directive (UI review 2026-03-29)

**URL**: `/explorar` — `src/routes/explorar/index.tsx`

## Design Directive: Explorar

### Critical (must fix)

- None.

### Important (should fix)

- **Filter + results layout at mid breakpoints**: **#052** asks to stack filters above results earlier if `md`–`lg` feels cramped. Desktop screenshot (1280px) shows a healthy split; validate at 1024px and 900px during implementation.

- **PageInfo spacing**: Align vertical rhythm under `PageInfo` with municipio/collection listing pages when **#052** touches explorer.

### Refinement (nice to have)

- **Search bar**: White input on ocean hero is clear; optional very subtle inner shadow for depth (`shadow-inner` at 5% opacity) — only if it does not hurt contrast.

### What works well

- Hero search, filter accordion structure, and results header (“194 playas encontradas” + sort) communicate a professional directory.

**Severity summary**: Critical: 0, Important: 2, Refinement: 1
