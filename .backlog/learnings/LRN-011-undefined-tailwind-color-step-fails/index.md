---
id: LRN-011
title: Undefined Tailwind color step fails silently
status: active
tags: [tailwind, theme, ui]
task: TSK-117
created: 2026-10-19
---

## Context
Hero eyebrows moved from `text-coral-400` to `text-coral-300` per a review directive; they rendered in inherited dark text.
## Insight
`styles.css` `@theme` defines only coral-400 and coral-500. An undefined color utility emits no CSS, and no build or lint step flags it.
## Application
Check `@theme` before using any palette step from a design directive, and screenshot the result. `--color-coral-300: #f6a395` was added.
