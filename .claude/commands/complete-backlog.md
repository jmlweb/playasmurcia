---
argument-hint:
description: Work through the entire backlog autonomously via Ralph Loop
model: sonnet
---

# Complete Backlog

Work through pending backlog tasks via Ralph Loop, with checkpoint support for resume after interruption.

## Steps

1. **Check for existing checkpoint**. If `plan/ralph-checkpoint.md` exists, a previous run was interrupted.
   - Read the checkpoint file to see which tasks were completed and which remain.
   - Ask user: "Found checkpoint from a previous run. Resume where it left off, or start fresh?"
   - If resume: skip to step 4, using the remaining task list from the checkpoint.
   - If fresh: delete `plan/ralph-checkpoint.md` and continue from step 2.

2. Read `.backlog/tasks/index.md`. If no pending tasks, tell user and stop.

3. Read each task file in `.backlog/tasks/pending/`. Classify as **Automatable** (clear criteria, code-only), **Needs review** (manual testing, visual judgment, external data), or **Blocked** (unresolved dependency). Present classification and wait for user confirmation.

4. Read `.claude/templates/ralph-backlog.md`. Copy its content to `plan/ralph-backlog.md`, replacing `{{TASK_LIST}}` with the automatable task list (one `- TSK-NNN: Title` per line).

5. Create initial checkpoint file at `plan/ralph-checkpoint.md`:

   ```markdown
   # Ralph Loop Checkpoint

   Started: YYYY-MM-DD HH:MM
   Last updated: YYYY-MM-DD HH:MM

   ## Completed

   (none yet)

   ## Remaining

   - TSK-NNN: Title
   - TSK-NNN: Title

   ## Skipped (blocked/failed)

   (none)
   ```

6. Start the loop: `Skill("ralph-loop:ralph-loop", args: "Read plan/ralph-backlog.md and execute the workflow described there --completion-promise BACKLOG_COMPLETE")`

7. Tell the user the loop started, show monitor commands (`grep '^iteration:' .claude/ralph-loop.local.md`, `cat plan/ralph-checkpoint.md`, `cat .backlog/tasks/index.md`, `git log --oneline -10`), and mention `/ralph-loop:cancel-ralph` to cancel. Then begin working on the first task.
