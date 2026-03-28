---
argument-hint:
description: Work through the entire backlog autonomously via Ralph Loop
model: sonnet
---

# Complete Backlog

Launch a Ralph Loop that picks tasks from the backlog one by one, implements each, and stops when no tasks remain.

## Workflow

### 1. Read current backlog

Read `docs/dev/INDEX.md` and list all pending (non-blocked) tasks. If there are no pending tasks, tell the user and stop — do not start a loop.

### 2. Identify automatable tasks

Read each task file in `docs/dev/backlog/` to understand scope. Classify each as:

| Classification | Criteria | Action |
|----------------|----------|--------|
| Automatable | Clear acceptance criteria, no external research needed, code-only changes | Include in loop |
| Needs review | Requires manual testing, visual judgment, or external data | Flag to user |
| Blocked | Has unresolved `Blocked by` dependency | Skip |

Present the classification to the user:

```
## Backlog Analysis

Automatable (will run):
- #034: Beach Detail Layout Fixes
- #032: Add Reduced Motion Support

Needs review (skipping):
- #017: Source Missing Beach Pictures (requires manual image sourcing)

Blocked (skipping):
- #035: Municipality Cards (blocked by #017)

Proceed with N automatable tasks? (yes/no)
```

Wait for user confirmation before proceeding.

### 3. Write the Ralph Loop prompt file

Write `plan/ralph-backlog.md` with the following content, replacing `[TASK LIST]` with the automatable task numbers and titles from step 2:

```markdown
# Ralph Loop: Execute Backlog Tasks

You are working through the PlayasMurcia backlog. Each iteration you pick ONE task, implement it fully, and mark it complete.

## Automatable tasks (work on these only)

[TASK LIST — e.g. "- #034: Beach Detail Layout Fixes", one per line]

## Per-Iteration Workflow

### 1. Assess current state

- Read `docs/dev/INDEX.md` to see which tasks are still pending
- Only work on the automatable tasks listed above
- Respect dependencies: do not start a task whose `Blocked by` is still pending
- Pick the highest-priority unblocked task

### 2. If no automatable tasks remain

Delete `plan/ralph-backlog.md` (cleanup), then output <promise>BACKLOG_COMPLETE</promise> and stop.

### 3. Implement the task

- Read the task file in `docs/dev/backlog/` for full acceptance criteria
- Read `AGENTS.md` and relevant docs before coding
- Follow project conventions: TanStack Start, Cloudflare Workers, Turso, functional TypeScript
- Run `pnpm build` to verify no build errors
- Run `pnpm test` if tests exist for the affected area
- Check every acceptance criterion from the task file

### 4. Update docs if needed

Per `AGENTS.md` checklist:
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
```

### 4. Start Ralph Loop

Use the Skill tool to invoke ralph-loop. The prompt passed to ralph-loop is a short instruction to read the plan file — the detailed instructions live in the file itself so they can be long without bloating the state file.

```
Skill("ralph-loop:ralph-loop", args: "Read plan/ralph-backlog.md and execute the workflow described there --completion-promise BACKLOG_COMPLETE")
```

This creates `.claude/ralph-loop.local.md` with the short prompt in the body and `completion_promise: "BACKLOG_COMPLETE"` in the frontmatter. The stop hook will:
1. Intercept session exit after each task completion
2. Re-inject the same prompt ("Read plan/ralph-backlog.md...")
3. Claude reads the file again, picks the next task, implements it
4. Repeat until `<promise>BACKLOG_COMPLETE</promise>` is output

### 5. Confirm to user

After the Skill tool returns (ralph-loop is now active), tell the user:

```
Ralph Loop started with [N] automatable tasks.

Monitor progress:
  grep '^iteration:' .claude/ralph-loop.local.md   # Current iteration
  cat docs/dev/INDEX.md                              # Task progress
  git log --oneline -10                              # Recent commits

Cancel anytime: /ralph-loop:cancel-ralph
```

Then immediately begin working on the first task as instructed by the ralph-loop prompt.
