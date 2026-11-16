---
name: get-started
description: Help the developer to get started with their project by asking targeted questions, creating a plan and setting up the scaffolding for the project.
---

# Get Started

The developer starts from a blank project and needs help to get started. IMPORTANT: The developer may or may not be a technical person, so you have to adapt your language and style accordingly.
The goal is not to build a complete project, but to set up the basic structure of the repo, setup documentation, guidelines, coding standards, verification steps, etc.

## 1. Investigation
Ask targeted questions interview-style, one question at a time, to find out what the developer wants to build.
- What do they want to build?
- Did they already create a new repo for the project, or is this repo still pointing to the remote of the template repo?
- What is the skill-level of the developer?
- What programming language do they want to use?
- Do they have already an idea about the architecture / stack of the project?
- Are there any coding conventions they want to follow?
- Where do the tickets or issues live (for example Jira or GitHub Issues)?
- What autonomy level do they want the agent to follow? Do they want the agent to be fully independent and autonomous, or do they want the agent to check in frequently with the developer?
- ... (any other question that helps you create an implementation plan and learn about the developer and the project)

## 2. Plan
Make a plan for the execution of the initial project. Be sure to keep the developer involved in writing the plan.
Present the plan to the developer. Finally, save the plan in `docs/plans/active/YYYY-MM-DD-get-started.md`.
Keep open follow-up items in a `## TODOs` section at the bottom of that plan file using markdown checkboxes.

## 3. Customize Agent Rules
Review `AGENTS.md` with the developer and customize it to their preferences before scaffolding implementation details.
Language, coding and architecture guidelines should be in line with the plan.
Communication and approach should be in line with the developer / team preference.
Change the wording of rules that depend on the project type (for example, the UI and data/ML rules in `## Testing`), and remove the rules that do not apply.
Write where the tickets or issues live into `AGENTS.md`.
Offer to create focused docs (for example `docs/ARCHITECTURE.md` or `docs/CONVENTIONS.md`). If the developer agrees, link them from `AGENTS.md` and add a rule to update them when the architecture or conventions change.
Keep it minimal and specific to this repo.

## 4. Execution
Only start this step after explicit developer approval of Step 2 (Plan) and Step 3 (Customize Agent Rules).
If necessary, configure the remote URL of this repo to point to away from the template repo.
Create the minimum docs structure needed by this repo if it does not exist yet:
- `docs/plans/active/`
- `docs/plans/pending/`
- `docs/plans/completed/`
- `docs/decisions/`
Handle template scaffolding based on the chosen project language:
- If the project is **Python**:
  - Move `templates/py/.pre-commit-config.yaml`, `templates/py/.gitignore`, `templates/py/pyproject.toml`, and `templates/py/uv.lock` to the repo root.
  - Delete `templates/ts/` and any TS-only template files.
- If the project is **TypeScript**:
  - Move `templates/ts/package.json`, `templates/ts/pnpm-lock.yaml`, `templates/ts/.npmrc`, `templates/ts/pnpm-workspace.yaml`, `templates/ts/.gitignore`, `templates/ts/tsconfig.json`, `templates/ts/eslint.config.mjs`, `templates/ts/.secretlintrc.json`, `templates/ts/.prettierignore`, and `templates/ts/.husky/` to the repo root.
  - Delete `templates/py/` and any Python-only template files.
- If the project is **neither Python nor TypeScript**:
  - Create equivalent starter files for the selected stack in the repo root.
  - Remove both `templates/py/` and `templates/ts/` so only relevant files remain.
- In `pyproject.toml` or `package.json`, set the project `name` and reset `version` to `0.1.0`. Then ask the developer to update the lockfile (`uv lock` or `pnpm install`), because the lockfile records the name and version. Replace `CHANGELOG.md` with an empty one for the new project.
- In `.github/workflows/validate.yml`, keep only the job for the chosen stack and adapt it to the project: run it from the repo root, remove the template-only steps and settings (the placeholder source file and the `SKIP: deptry` setting), and keep the lockfile checks (`uv lock --check`, `pnpm install --frozen-lockfile`). For other stacks, replace the jobs with ones that run the stack's checks.
- In `.github/dependabot.yml`, keep only the entry for the chosen stack and set its `directory` to `/`. For other stacks, replace the entries with one for the stack's package ecosystem.
Execute the plan. Make sure to keep the developer in the loop and explain what you are doing.
Before handoff, validate that the configured repo works:
- Ask the developer to run the install/setup command (for example `uv sync` or `pnpm install`) in a separate terminal. The agent sandbox blocks the hosts that serve package files, so the agent cannot install dependencies. Tell the developer this at the start of this step, not after a failed install. For TypeScript, the developer must also install the pnpm version from `packageManager` in `package.json` (for example `pnpm self-update <version>`). With any other version, every `pnpm` command fails in the sandbox.
- Run the configured lint, typecheck, test, and validation commands.
- If a validation command fails because the project has no source files yet, either add the minimal expected placeholder source/test structure or adjust the command so a fresh scaffold passes.
- Report each validation command and whether it passed.

## 5. Evaluation & Reflection
Look at your work and reflect on what you did. If there were interventions from the developer, make sure to document them in `AGENTS.md` or `README.md`, to avoid making the same mistakes again.
Definition of done checklist:
- `AGENTS.md` instructions are customized to the user.
- Initial project files/scaffolding are created.
- Architecture/stack choice is documented.
- Only the minimum necessary files and documents are present. Avoid overengineering / scope creep.
- Test/lint command is defined and recorded.
- Open TODOs are tracked in the relevant plan file under `docs/plans/` in a `## TODOs` section.
- Decisions should be logged in `docs/decisions/YYYY-MM-DD.md`.
- Open decisions or deferred items are listed explicitly.

## 6. Wrap-up
Confirm with the developer that the project is ready; then you can remove the `get-started` skill from the project.
