---
name: wrap-up
description: Close out a work session by logging decisions and keeping todos and plans current.
---

# Wrap Up

Use this skill near the end of a work session when implementation is done and the repo state needs to be recorded.

## 1. Review session changes
Inspect the work that was completed in this session before writing anything down.
- Check which files changed and why.
- Identify any decisions that were made during implementation.
- Identify unfinished work, follow-ups, and deferred items.

## 2. Log decisions
If the session introduced a meaningful product, architecture, tooling, or workflow decision, record it in `docs/decisions/YYYY-MM-DD.md`.
- Keep the note concise.
- State the decision, the reasoning, and any important consequences.
- If no meaningful decision was made, do not create a decision entry just to fill the folder.

## 3. Update todos
Update `docs/todos/TODOS.md` to reflect the current state of the project.
- Use markdown checkboxes.
- Mark completed work as done.
- Add only real follow-up tasks that remain open.
- If all todos are complete, archive the file to `docs/todos/completed/YYYY-MM-DD.md` and reset `docs/todos/TODOS.md` to empty.

## 4. Update plans
Review any active files in `docs/plans/` that are relevant to the session.
- Update progress and next steps.
- Keep plans aligned with reality.
- When a plan is fully complete, move it to `docs/plans/completed/`.
- Do not create a new plan unless the session actually introduced one.

## 5. Report status clearly
Summarize the wrap-up outcome for the developer.
- What was logged in decisions.
- What changed in todos.
- What changed in plans.
- Any unresolved items that need attention next.

## Guardrails
- Do not invent decisions, todos, or plans.
- Do not update `README.md` or other general documentation as part of wrap-up unless the developer explicitly asks.
- Prefer targeted updates over broad rewrites.
- Match the repo's existing conventions and filenames.
- Do not commit anything unless the developer explicitly asks.
