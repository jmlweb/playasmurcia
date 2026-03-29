# Beach detail design directive (UI review 2026-03-29)

**URL**: `/playas/cala-aguilar` (representative beach with hero image) — `src/routes/playas/$slug.tsx`

## Design Directive: Beach detail

### Critical (must fix)

- **Raw orientation value in UI**: `PracticalInfoCard` shows `Orientación` with value `east` (screenshot: Cala Aguilar). Data stores English enum-like strings; users expect Spanish (`Este`).
  **Fix**: Map `beach.orientation` through a small label map (es copy) in the card or route; do not render API/raw schema strings.

### Important (should fix)

- **Body copy tone**: Long description remains very dark grey on white — acceptable; task **#051** already asks for `text-gray-700` on “Sobre esta playa” for optimal reading. Keep aligned with that task.

- **Sidebar vs main column on small viewports**: **#051** covers mobile ordering (weather/practical info not stranded below map). No additional directive beyond executing that task.

### Refinement (nice to have)

- **Hero h1**: Slightly tighter line-length on ultra-wide viewports by constraining max-width of the title block in the hero overlay.

### What works well

- Photo hero + gradient, breadcrumb placement, and two-column desktop layout match guidelines.
- Activities row with SVG icons reads as modern and consistent.

**Severity summary**: Critical: 1, Important: 2, Refinement: 1

**Note**: Gallery de-duplication (`slice(1)` when hero uses `pictures[0]`) is already implemented in code (`$slug.tsx` approx. 179–184). Remaining beach-detail work is tracked in backlog **#051**.
