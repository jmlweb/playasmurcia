---
id: TSK-172
title: Fix: Search flushSync exception unverified on real phones
status: pending
priority: P4
tags: [bug, navbar, needs-device]
created: 2026-11-06
source: report/RPT-071
depends-on: []
---

# Fix: Search flushSync exception unverified on real phones

## Description

### Summary

Commit 41c5d16 added an `eslint-disable` for `@eslint-react/dom-no-flush-sync` in the navbar search link. The stated reason, that deferring focus past the tap may stop the phone keyboard opening, has not been tested on a real device.

### Details

`src/components/layout/navbar.tsx:273-274` calls `flushSync(closeMenu)` so the explorer stops being `inert` before the search input takes focus. Without it, focus runs while `#main-content` is still inert and fails when the phone menu is open.

The alternative is deferring focus with `requestAnimationFrame` after closing the menu. It needs no lint exception, but it runs outside the tap, and iOS may then refuse to open the keyboard.

Only the menu-open path needs `flushSync`. When the menu is closed the call changes nothing.

Playwright at 375x667 on `/explorar` with the menu open confirmed focus lands on `buscar`, but Chromium emulation does not show whether a soft keyboard opens. This task needs real iOS and Android devices.

Source report: `.backlog/reports/complete/RPT-071-search-flushsync-exception-unverified-on.md`

## Acceptance Criteria

- [ ] Both variants (flushSync and requestAnimationFrame) tested on iOS Safari and Android Chrome: phone menu open on /explorar, tap search, keyboard opens
- [ ] If deferred focus opens the keyboard on both, flushSync and its eslint-disable are removed
- [ ] If it does not, the comment at the call site says the behaviour was confirmed on devices

## Notes

## Learnings

## Progress Log

- [2026-11-06] Created
- [2026-11-07] Tagged in 2026-11-07 grooming. Navbar tasks run in order 175, 176, 174, 177, 171 because they edit the same file.