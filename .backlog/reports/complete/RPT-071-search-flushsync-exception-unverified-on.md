---
id: RPT-071
title: Search flushSync exception unverified on real phones
type: finding
severity: low
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-172
---

## Summary

Commit 41c5d16 added an `eslint-disable` for `@eslint-react/dom-no-flush-sync` in the navbar search link. The stated reason, that deferring focus past the tap may stop the phone keyboard opening, has not been tested on a real device.

## Details

`src/components/layout/navbar.tsx:286-287` calls `flushSync(closeMenu)` so the explorer stops being `inert` before the search input takes focus. Without it, focus runs while `#main-content` is still inert and fails when the phone menu is open.

The alternative is deferring focus with `requestAnimationFrame` after closing the menu. It needs no lint exception, but it runs outside the tap, and iOS may then refuse to open the keyboard.

Only the menu-open path needs `flushSync`. When the menu is closed the call changes nothing.

## Where Found

`src/components/layout/navbar.tsx:286-287`, in the search `Link` `onClick`.

## Evidence

- Playwright at 375x667 on `/explorar` with the menu open: `document.activeElement` is `buscar`, input at y=315, menu closed, page scroll lock released.
- Chromium emulation does not show whether a soft keyboard opens. No iOS or Android device was used.
- The keyboard behaviour is an assumption, not a measurement.

## Impact

If deferred focus does open the keyboard on iOS and Android, the lint exception is unnecessary and can be removed. If it does not, the exception is justified and the comment should say it was confirmed.

## Next Step

Test both variants on iOS Safari and Android Chrome: open the phone menu on `/explorar`, tap search, confirm the keyboard opens.
