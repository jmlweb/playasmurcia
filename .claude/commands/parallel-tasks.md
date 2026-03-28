---
argument-hint: [task numbers separated by comma]
description: Execute multiple independent tasks in parallel using subagents
model: sonnet
---

# Parallel Tasks

Launch multiple independent backlog tasks in parallel using subagents.

## Usage

- `/parallel-tasks` - Show independent tasks and ask which to run
- `/parallel-tasks 003,004,005` - Execute specific tasks in parallel

## Workflow

### 1. Identify Independent Tasks

Read all tasks from `docs/dev/backlog/`. For each, check:
- `Blocked by: -` (no dependencies)
- `Status: pending` (not already in progress)
- No file conflicts with other selected tasks

### 2. Detect File Conflicts

Parse "Files to Modify" from each task. Tasks modifying the same files CANNOT run in parallel.

### 3. Present Selection

```
## Independent Tasks

| # | Task | Slice | Files | Parallelizable |
|---|------|-------|-------|----------------|
| 003 | Turso setup | Infra | .env, app.config.ts | Yes |
| 004 | Beach filters | Frontend | src/routes/, src/components/ | Yes |
| 005 | SEO meta tags | SEO | src/routes/__root.tsx | Conflicts with #004 |

Recommended groups:
- Group A: #003 + #004 (no conflicts)

Which tasks? (comma-separated)
```

### 4. Update Task Status

For each selected task:
1. Set status to `in_progress`, started date
2. Add Progress Log: `[timestamp] Started (parallel execution)`

### 5. Update INDEX.md

```markdown
## Current Focus
> **Parallel Execution Active**
> - Task #003: Turso setup (backend-developer)
> - Task #004: Beach filters (frontend-developer)
```

### 6. Launch Subagents

Use the Agent tool to launch subagents in parallel. Select agent type by slice:

| Slice | Agent |
|-------|-------|
| Frontend, Styling | frontend-developer |
| Database, Data, Infra | backend-developer |
| SEO | frontend-developer |

**CRITICAL**: Launch ALL subagents in a SINGLE message for true parallel execution.

Subagent prompt template:
```
Complete Task #XXX: [title]

## Acceptance Criteria
[from task file]

## Files to Modify
[from task file]

## Instructions
1. Read existing files first
2. Implement each criterion
3. Update the task file with progress
4. Mark checkboxes as you complete them
```

### 7. Collect Results

```
## Parallel Execution Complete

| Task | Result | Duration |
|------|--------|----------|
| #003 | Success | 2m 15s |
| #004 | Success | 4m 30s |

Run `pnpm check` to verify all changes.
Use /complete-task for each successful task.
```

## Error Handling

- Agent fails: Mark task as blocked, continue others
- File conflict mid-execution: Stop conflicting agent
- All fail: Summarize errors, suggest manual intervention
