---
argument-hint: [task number]
description: Verify task status matches reality, fix if needed
model: sonnet
---

# Check Task

Verify that a task's status accurately reflects implementation reality.

## Usage

- `/check-task 003` - Check specific task
- `/check-task` - Check current active task or all pending tasks

## Workflow

### 1. Load Task

Read the task file from `docs/dev/backlog/` or `docs/dev/done/`:
- Parse acceptance criteria
- Note current status
- Identify files to check

### 2. Verify Implementation

For each acceptance criterion:
1. Read referenced files from "Files to Modify"
2. Search for implementations matching criteria
3. Run relevant checks (imports, function existence, types)

### 3. Compare Status vs Reality

| File Status | Reality | Action |
|-------------|---------|--------|
| pending | Not implemented | Correct |
| pending | Fully implemented | Should complete |
| pending | Partially done | Update checkboxes |
| in_progress | Partially done | Correct |
| in_progress | Fully done | Should complete |
| completed | Still works | Correct |
| completed | Broken/missing | Reopen task |

### 4. Report Findings

```
## Task #XXX Status Check

Current status: pending

### Acceptance Criteria Analysis

| Criterion | File Status | Reality | Match |
|-----------|-------------|---------|-------|
| Database query works | [ ] | Implemented in db-data.ts:45 | Mismatch |
| Route renders data | [ ] | Not found | OK |

### Recommended Actions
1. Update task file to check completed criteria
2. Continue implementation for remaining items
```

### 5. Offer Fixes

Based on findings, suggest:
- `/complete-task XXX` if fully implemented
- Move back to backlog if marked complete but broken
- Update checkboxes if partially complete

## Batch Check Mode

When called without argument, check all tasks:

```
## Backlog Health Check

| Task | Status | Reality | Action Needed |
|------|--------|---------|---------------|
| #001 | pending | pending | None |
| #002 | pending | done | Complete it |
| #003 | blocked | resolved | Unblock it |

Summary: N tasks need attention
```
