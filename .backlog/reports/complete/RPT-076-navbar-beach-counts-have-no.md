---
id: RPT-076
title: Navbar beach counts have no unit for screen readers
type: improvement
severity: low
status: triaged
created: 2026-11-06
triaged: 2026-11-06
task-id: TSK-176
---

## Summary

Collection counts in the navbar are read without a unit, for example "Mar Menor 43".

## Current Behavior

Links render the label and a bare number at `src/components/layout/navbar.tsx:69` (popover) and `:137` (phone menu). The 2026-11-06 critique reported this on the municipality rows too; those rows left the navbar in 41c5d16.

## Proposed Change

Add a visually hidden unit after each count, as `coast-today-strip.tsx` already does for weather:

`{c.count}<span className="sr-only"> playas</span>`

Use "1 playa" for a count of one. Update tests that match link names.

## Expected Benefit

Screen-reader users hear "Mar Menor 43 playas", which matches what sighted users infer from the context. Agents reading the accessibility tree get the same meaning.
