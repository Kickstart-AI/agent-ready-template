# Coding Agent Instructions

## Coding Style
- Simple functions, proper abstraction. Keep functions short. Code should be self-explanatory. Repository folder structure should be self-explanatory.
- Every line of code should have intent, and the intent should come from the user instructions.
- Maintain clear mapping between source filenames and corresponding `test_*` filenames.
- Each module, function, and class should have a concise docstring.
- No need for backward compatibility or forward compatibility.

## Security
- For high-risk operations, make sure to always stop and confirm with the user before execution. Examples:
  - Irreversible removals like `rm -rf`
  - Changing infrastructure like `terraform apply`
  - Database migrations or schema changes
  - Modifying access control, permissions, or authentication logic
  - Running scripts that affect multiple systems or environments
  - Publishing packages or deploying to production
  - Using custom ad-hoc scripts to bypass any tool or environment restrictions
- When installing or updating dependencies, verify before installation that the selected version has no known
  supply-chain compromise reports or critical CVEs.
- Always pin dependencies to exact versions in manifests or lockfiles instead of using floating version ranges.
- Do not install anything known or suspected to be a security risk.
- Never hardcode secrets, API keys, passwords, or tokens in code. Use environment variables or secure vault services.
- Do not log or expose sensitive information like credentials, PII, or authentication tokens.
- Do not commit secrets or credentials to version control. If accidentally committed, treat as compromised and rotate
  immediately.

## Communication
- Be professional and concise but do communicate in full sentences. Avoid acknowledgements ("Got it!", "You are right!"), banter, and small talk.
- Always present and explain your plan to the user before implementing anything. Explain trade-offs and why you recommend certain solutions.
- Ask clarifying questions when the context is unclear or ambiguous.

## Approach
- Check `docs/` for plans and their embedded TODO sections that are relevant to the current session.
- Do not rely on your internal knowledge about APIs, libraries, and tools. Assume that it might be outdated. Use web search and web fetch to retrieve relevant documentation.
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
- Keep session-spanning plans in state-specific folders:
  - `docs/plans/active/YYYY-MM-DD-{plan-name}.md` for plans currently being worked
  - `docs/plans/pending/YYYY-MM-DD-{plan-name}.md` for approved plans that are not currently active
  - `docs/plans/completed/YYYY-MM-DD-{plan-name}.md` for finished plans
- Move the whole plan file between these folders when its state changes.
- Use `docs/decisions/YYYY-MM-DD.md` to record decisions you made and find past decisions and reasoning behind them.
- Keep TODOs at the bottom of each plan file (for example, in a `## TODOs` section). Do not use a separate TODO file.
- Use Markdown checkboxes to show the status:
  - [ ] pending todo
  - [x] todo completed
- Do not remove completed TODOs from plan files; keep them for historical context.
- When searching through plans and decisions and past todos, use targeted keyword search rather than loading all the files into context.