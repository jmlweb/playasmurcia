---
argument-hint:
description: Work through the entire backlog autonomously via Ralph Loop
model: sonnet
---

# Complete Backlog

Work through pending backlog tasks via Ralph Loop.

## Steps

1. Read `backlog/INDEX.md`. If no pending tasks, tell user and stop.

2. Read each task file in `backlog/pending/`. Classify as **Automatable** (clear criteria, code-only), **Needs review** (manual testing, visual judgment, external data), or **Blocked** (unresolved dependency). Present classification and wait for user confirmation.

3. Read `.claude/templates/ralph-backlog.md`. Copy its content to `plan/ralph-backlog.md`, replacing `{{TASK_LIST}}` with the automatable task list (one `- #NNN: Title` per line).

4. Start the loop: `Skill("ralph-loop:ralph-loop", args: "Read plan/ralph-backlog.md and execute the workflow described there --completion-promise BACKLOG_COMPLETE")`

5. Tell the user the loop started, show monitor commands (`grep '^iteration:' .claude/ralph-loop.local.md`, `cat backlog/INDEX.md`, `git log --oneline -10`), and mention `/ralph-loop:cancel-ralph` to cancel. Then begin working on the first task.
