---
name: wrap-up
description: Close out a work session by logging decisions and keeping plan files (including TODOs) current.
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

## 3. Update TODOs in plans
Update TODO sections directly in the relevant files under `docs/plans/`.
- Use markdown checkboxes.
- Mark completed work as done.
- Add only real follow-up tasks that remain open.
- Keep TODOs at the bottom of each plan file (for example, in a `## TODOs` section).
- Do not remove completed TODOs; keep them in the plan for historical context.
- Do not use a separate todo file.

## 4. Update plans
Review the relevant plan files using the plan state folders under `docs/plans/`.
- Update progress and next steps.
- Keep plans aligned with reality.
- Keep currently worked plans in `docs/plans/active/`.
- Keep approved but not currently worked plans in `docs/plans/pending/`.
- When a plan is fully complete, move it to `docs/plans/completed/`.
- Move the whole file between these folders when its state changes.
- Do not create a new plan unless the session actually introduced one.

## 5. Report status clearly
Summarize the wrap-up outcome for the developer.
- What was logged in decisions.
- What changed in plans and their todos.
- Any unresolved items that need attention next.

## Guardrails
- Do not invent decisions, todos, or plans.
- Do not update `README.md` or other general documentation as part of wrap-up unless the developer explicitly asks.
- Prefer targeted updates over broad rewrites.
- Match the repo's existing conventions and filenames.
- Do not commit anything unless the developer explicitly asks.
