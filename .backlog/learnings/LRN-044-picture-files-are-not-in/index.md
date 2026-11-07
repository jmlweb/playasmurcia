---
id: LRN-044
title: Picture files are not in git
status: active
tags: [pictures, worktree, r2]
task: TSK-142
created: 2026-11-07
---

## Context
public/pictures is untracked, synced to R2, and absent in worktrees.
## Insight
An agent in a worktree must link to the main checkout's public/pictures to approve pictures or score quality, which writes files into the main checkout.
## Application
Link it for the run, never commit the symlink, and run scripts/sync-pictures-to-r2.sh before deploying.
