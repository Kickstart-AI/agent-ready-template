# Coding Agent Instructions

## Coding Style
- Simple functions, proper abstraction. Keep functions short. Code should be self-explanatory. Repository folder structure should be self-explanatory.
- Every line of code should have intent, and the intent should come from the user instructions.
- Maintain clear mapping between source filenames and corresponding `test_*` filenames.
- Each module, function and class should have a concise docstring.
- No need for backward compatibility or forward compatibility.

## Communication
- Always present and explain your plan to the user before implementing anything. Explain trade-offs and why you recommend certain solutions.

## Approach
- Check `docs/` for todos and plans that are relevant to the current session.
- Implement the basic happy path of any functionality or feature first. Only after confirmation from the user, implement the edge cases.
- Only implement features and functionality that the user asked for.
- Use red/green TDD.
- If stuck after 2 failed implementation attempts, stop and present a blocker summary with concrete next options.
- Before handoff, run the smallest relevant tests/lint for touched code and report pass/fail explicitly.
- Self-improvement: If the user corrects a mistake or gives feedback, suggest a change to the `AGENTS.md` to prevent the same mistake from happening again.

## Error Handling & Debugging
- No need for excessive try-except blocks and edge case handling. Don't wrap imports in try-except blocks.
- Use `logging` or equivalent instead of `print`. Make use of `debug`, `warning` and `error` levels in addition to `info`.
- Prefer explicit failures over silent bugs. Avoid generic except Exception blocks.
- If you for some reason implement one, add `logging.error(..., exc_info=True)` or equivalent to surface the stack trace.

## Documentation & Memory
- Avoid overdocumenting (e.g. README.md in every folder, excessive comments in the code).
- Use `docs/decisions/YYYY-MM-DD.md` to record decisions you made and find past decisions and reasoning behind them.
- Use `docs/TODOS.md` to keep track of todos. When the todos are completed, copy the whole file to `docs/completed/YYYY-MM-DD.md` and empty the `TODOS` file.
- Use `docs/plans/{plan_filename}.md` to keep track of plans that could span multiple sessions. Give plans descriptive filenames.
- When searching through plans and decisions and past todos, use targeted keyword search rather than loading all the files into context.