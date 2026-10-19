---
id: LRN-017
title: Worktree agents cannot run git through the rtk hook
status: active
tags: [tooling, git, rtk, worktree]
task: TSK-118
created: 2026-10-19
---

## Context
The TSK-118 agent in an isolated worktree could not commit; TSK-121's agent could.
## Insight
The rtk hook rewrites git commands to rtk git, and the sandbox refused them with "runs rtk with a git command among its operands". The block was inconsistent between agents.
## Application
Check each agent's report for uncommitted work after a parallel run. Commit from the worktree by hand if the agent could not.
