---
id: LRN-014
title: Worktree agents must call /usr/bin/git
status: active
tags: [tooling, rtk, worktree]
task: TSK-123
created: 2026-10-19
---

## Context
The RTK hook rewrites `git` to `rtk git`, which the worktree sandbox refuses.
## Insight
Plain `git` and `git -C` are blocked in worktree agents. The hook also blocks `rm` and commands with the word "complete" in a path glob.
## Application
Use `/usr/bin/git` and split compound commands. Put this in subagent prompts.
