# Beach detail (`/playas/$slug`) — UI review directive

Screenshot: `/tmp/ui-review-playa-detail.png`, `/tmp/ui-review-playa-detail-mobile.png`. Route: `src/routes/playas/$slug.tsx`.

## Design Directive: Beach detail

### Critical (must fix)

_None._

### Important (should fix)

- **“Playas cercanas” thumbnails**: Same gray empty frame issue as listing cards (`nearby-carousel.tsx`). On a detail page, empty strips **hurt credibility** more than on an index.
  **Fix**: Reuse the shared listing fallback art; if a nearby beach has no photo, still show municipality name clearly and consider a **smaller fixed height** with centered icon so the strip height stays even.

- **Secondary column empty states**: Weather “no disponible” and beach status “fuera de temporada” stack as white cards with similar visual weight to `PracticalInfoCard`.
  **Fix**: Differentiate **degraded** states: slightly reduced shadow, `border-dashed border-gray-200`, or a muted icon so primary practical info remains the focal card.

### Refinement (nice to have)

- **Tag pills in hero**: Ensure `text-gray-800` on light pills over `ocean` gradient hero meets **4.5:1** when the hero uses a photo variant; if not, darken pill text to `text-gray-900` or increase pill opacity.

- **Gallery row**: Three-up gallery is clean; add consistent `gap` equal to section spacing scale (e.g. `gap-4` → `gap-5` to match card grids) if side-by-side feels tight.

### What works well

- **Two-column narrative + facts**: Description, certifications, services/activities grids, map, and contact read in a clear scan order.
- **Service/activity icon treatment**: Outline icons in soft tinted tiles match guidelines for functional SVG use.

**Severity summary:** Critical: 0, Important: 2, Refinement: 2
