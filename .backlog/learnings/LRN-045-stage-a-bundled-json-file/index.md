---
id: LRN-045
title: Stage a bundled JSON file with the module that imports it, and verify on a clean tree before pushing
status: active
tags: [tooling, git, ci, data]
task: TSK-147
created: 2026-11-09
---

## Context

On 2026-11-08 a push to `main` went red twice. `git add -A src scripts` staged `src/lib/beach-dimensions.ts` (work in progress) without `data/beach-dimensions.json`, which it imports, and the local `pnpm check` had passed because the JSON existed on disk. CI could not resolve the module and the deploy was blocked until the data file landed in a later commit.

## Insight

Static JSON bundled from `src/lib` (the LRN-027 pattern) is part of the module graph: the `.ts` import and the `data/*.json` file must travel in the same commit. A local check proves nothing about what is staged.

## Application

- Stage by task, naming the data file next to its lib: `git add data/x.json src/lib/x.ts ...`; never `git add -A src` while another task is in progress in the tree
- Before `git push`, run `git stash --include-untracked && pnpm check && git stash pop`, or inspect `git status --short` for untracked `data/*.json` that a staged import needs
- Do not chain `pnpm test | grep ... && git push`: the pipe returns grep's status, so a failing test still pushes. Run the gate on its own line and check its exit code
