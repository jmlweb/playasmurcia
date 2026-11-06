---
id: RPT-078
title: Impeccable audit of the explorer: 13/20, clear-all kept boolean filters
type: finding
severity: high
status: pending
created: 2026-11-06
---

## Summary

Technical audit of `/explorar` on 2026-11-07 scored 13/20 (Acceptable): accessibility 2, performance 3, theming 3, responsive 3, implementation integrity 2. It found 1 P0, 1 P1, 10 P2 and 4 P3 issues. The P0 also affects production.

Correction to the audit: the P1 claimed map clusters had no accessible name. Their text content did name them ("19"), so it was a weak name, not a missing one. It should have been P2. The fix still applies.

## Details

P0, "Limpiar todo" did not clear boolean filters. `updateFilters` merged `{ ...prev, ...next }` and forced only array keys and `q`, so boolean keys omitted by `next` kept their previous value. On `redesign` the empty state's reset left users at 0 results.

Other issues, fixed in the uncommitted `redesign` working tree unless noted:

- Map clusters used a weak accessible name and traffic-light default colours.
- `touch-action: none` on the map blocked one-finger page scroll.
- Focus stayed on the off-screen page button after paginating, and scroll ignored reduced motion.
- Pagination used `replace: true` and buttons without `href`. Now links on `/explorar` only; collections and municipalities keep buttons.
- Sort control lacked its label in the name and misused `role=menu`.
- Mobile dialog background was not inert.
- Option counts were invisible on touch.
- No `h2` for results; the search field showed two clear buttons in Chromium.
- P3 items: touch sizes, default focus rings, a joined accessible name, duplicated mobile count, placeholder contrast.

Also fixed: `label-content-name-mismatch` on the "Filtros" button. The "Para hoy" background was removed at the owner's request.

Not resolved:

- Filter latency: long tasks 244-273 ms before, 233-274 ms after (dev build, CPU 4x). Removing the hidden sidebar copy did not help noticeably.
- Text at 200%: horizontal scroll remains, now caused by the site footer.
- Pre-existing: a shared `flagGreen` URL loses the filter if the user interacts before flags settle.

## Where found

`src/routes/explorar/index.tsx`, `src/features/listing/`, `src/features/explorer/`.

## Evidence

- `?dogFriendly=true&nudist=true&blueFlag=true`: "Limpiar todo" kept all three filters and 0 results before the fix; afterwards the URL is `?sort=recomendados` with 193 beaches.
- Tested in Chrome emulation at 320, 375, 768 and 1280 px.
- Lighthouse mobile after fixes: 100 in all four categories, 58/58 audits.
- Not tested: real map gesture on a device, Safari, VoiceOver or NVDA, performance in a production build.

## Impact

Users could not reset filters, and "Limpiar todo (3)" reported an action it did not perform. Touch users, the primary audience, lost the live counts. The P0 was fixed on `main` in `32d3a34`, deployed by CI run 42313759227 and confirmed on www.playasmurcia.com. All other fixes are still uncommitted on `redesign`, including the same fix, which will overlap with `32d3a34` when `redesign` picks up `main`.
