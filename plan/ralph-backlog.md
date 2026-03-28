# Ralph Loop: Execute Backlog Tasks

You are working through the PlayasMurcia backlog. Each iteration you pick ONE task, implement it fully, and mark it complete.

## Per-Iteration Workflow

### 1. Assess current state

- Read `docs/dev/INDEX.md` to see which tasks are pending
- Only work on tasks **026, 027, 028, 029** (the automatable ones)
- Skip tasks 017 and 021 (require manual research)
- Respect dependencies: do not start a task whose `Blocked by` is still pending
- Pick the highest-priority unblocked task

### 2. If no automatable tasks remain

Output <promise>BACKLOG_COMPLETE</promise> and stop.

### 3. Implement the task

- Read the task file in `docs/dev/backlog/` for full acceptance criteria
- Read `CLAUDE.md` and relevant docs before coding
- Follow the project conventions: TanStack Start, Cloudflare Workers, Turso, functional TypeScript
- Run `pnpm build` to verify no build errors
- Run `pnpm test` if tests exist for the affected area
- Check every acceptance criterion from the task file

### 4. Update docs if needed

Per CLAUDE.md checklist:
- New/modified data fields → `docs/data-schema.md`
- New business logic → `docs/business-rules.md`
- New dependencies/structure → `docs/architecture.md`
- New commands/workflow → `docs/development.md`

### 5. Complete the task

- Move the task file from `docs/dev/backlog/` to `docs/dev/done/`
- Update `docs/dev/INDEX.md`: move task from Backlog to Recently Completed with today's date, update stats
- Create a git commit following Conventional Commits: `feat|fix|refactor(scope): description`

### 6. Exit this iteration

After completing exactly ONE task, stop. The loop will feed this prompt again for the next task.

## Rules

- ONE task per iteration — do not batch multiple tasks
- Do not modify tasks you are not currently working on
- If a task is blocked and you cannot unblock it, skip it and move to the next
- If you get stuck on a task after a genuine attempt, document what's blocking in the task file, mark it as blocked, and move on
- Always verify your work compiles and doesn't break existing functionality
- Do not push to remote — only local commits
