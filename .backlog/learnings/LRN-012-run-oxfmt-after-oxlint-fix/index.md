---
id: LRN-012
title: Run oxfmt after oxlint --fix
status: active
tags: [tooling, lint, format]
task: TSK-117
created: 2026-10-19
---

## Context
`pnpm check` runs oxlint (perfectionist/sort-jsx-props) then `oxfmt --check`.
## Insight
`oxlint --fix` reorders JSX props, and the reordered code can then fail the format check.
## Application
Run `pnpm exec oxlint --fix src/`, then `pnpm exec oxfmt "src/**/*.{ts,tsx,css}"`, then `pnpm check`.
