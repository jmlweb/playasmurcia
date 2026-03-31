# UI review — municipality detail (`/municipios/$slug`)

Sample: `http://localhost:3000/municipios/cartagena`. Source: `src/routes/municipios/$slug.tsx`.

## Design Directive: Municipio detail

### Critical (must fix)

- None.

### Important (should fix)

- **Placeholder thumbnails** in beach grid when images missing—hurts listing quality for large municipalities.
  **Fix**: Image pipeline + BeachCard (`078`, `082`, `017`).

- **Sort + count row:** “69 playas” and pagination line are clear; align typography weight with Explorer for cross-page consistency (`073`).

### Refinement (nice to have)

- **“Volver a municipios”** centered button: consistent with collection detail back link—good; match hover/focus to primary ghost button tokens site-wide.

### What works well

- **Hero** with stats (playas, banderas azules) is informative and confident.

**Severity summary:** Critical: 0, Important: 2, Refinement: 1
