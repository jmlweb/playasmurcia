---
id: LRN-016
title: Fresh agent worktrees lack gitignored runtime files
status: active
tags: [worktree, build, dev, screenshots]
task: TSK-121
created: 2026-10-19
---

## Context
Running pnpm build, test or check, or screenshots, in a new agent worktree. Seen in TSK-118 and TSK-121.
## Insight
Gitignored files are missing in a worktree: node_modules, .env, .dev.vars, local.db, public/pictures and src/routeTree.gen.ts. Without them pnpm test fails with "vitest: command not found", pnpm check with route type errors, and pnpm build with "no such table: beaches" (the sitemap step reads local.db). If port 3000 is taken, pnpm dev silently moves to 3001, and scripts/screenshot.ts defaults to 3000, so it can screenshot the wrong server.
## Application
In a new worktree run pnpm install --frozen-lockfile, copy those files from the main checkout, then pnpm build. Pass an explicit http://localhost:<port> URL to scripts/screenshot.ts. Never pkill -f "vite dev"; kill the specific PID.
