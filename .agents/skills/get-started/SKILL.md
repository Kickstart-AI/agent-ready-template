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
### Dependency bootstrap

Ask the developer to perform the setup below for the selected stack in a separate terminal before agent validation. This is the supported procedure; network and command restrictions do not guarantee that agents cannot install packages. Explain the setup before attempting checks. Use the versions in the project's current manifests and hook configuration; update the examples when those versions change.

#### Python

After moving the Python template files to the project root, ask the developer to run this from that root in a separate terminal. Review the hook configuration first: the bootstrap downloads tools and runs the configured checks, including formatters. A separate terminal does not inherit the agent settings, so the exports select the same caches explicitly. `uv sync` installs project dependencies; the `uvx` commands prepare isolated tools, and pre-commit prepares its own hook environments.

```sh
(
  set -e
  export UV_CACHE_DIR="$PWD/.cache/uv"
  export UV_TOOL_DIR="$PWD/.cache/uv-tools"
  export PRE_COMMIT_HOME="$PWD/.cache/pre-commit"
  export UV_EXCLUDE_NEWER="30 days"

  uv sync
  for tool in ruff@0.17.1 ty@0.0.89 vulture@2.16 pylint@4.1.3 deptry@0.25.1; do
    uvx "$tool" --version
  done
  uvx --from detect-secrets@1.5.0 detect-secrets-hook --help
  uvx pre-commit@4.7.0 install --install-hooks
  uvx pre-commit@4.7.0 run --all-files
)
```

The explicit tool calls populate caches even when hooks would skip an empty project. Keep their versions aligned with `.pre-commit-config.yaml`. Resolve failures and rerun the checks before returning validation to the agent. Repeat the bootstrap after tool or hook versions change, caches are removed, or the Python interpreter changes. Run agent checks from the same project root. Cached tools do not override command permission rules: Codex still forbids `uvx`, and Claude still asks for it.

#### TypeScript

After moving the TypeScript template files to the project root, ask the developer to install the pnpm version pinned in `packageManager` in `package.json`. If pnpm is already installed, the example below uses `pnpm self-update`; otherwise, install the pinned version first using the [pnpm installation instructions](https://pnpm.io/installation). Use the Node.js version required by `engines.node`.

Run from the project root. For the current template, the pinned pnpm version is `12.5.1`:

```sh
(
  set -e
  pnpm self-update 12.5.1
  pnpm --version
  pnpm install
  pnpm validate
  pnpm format:check
)
```

Confirm the reported pnpm version matches `packageManager`. `pnpm install` installs the check tools into `node_modules` and populates the store and cache configured in `pnpm-workspace.yaml`. These checks do not need separate tool environments or agent-specific cache exports. Resolve installation or check failures before agent validation. Repeat setup when dependencies or the pinned package manager change, or the installed dependencies or caches are removed.

### Validation

- For other stacks, ask the developer to run the equivalent install/setup command before validation.
- Run the configured lint, typecheck, test, and validation commands within the agent's permissions. Report checks that require the developer to run them.
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
Copy the dependency bootstrap for the chosen stack into the project's `README.md`, because the developer must repeat it when versions change. Confirm with the developer that the project is ready. Then ask the developer to remove the `get-started` skill in a separate terminal, because the agent sandbox blocks commands that delete skill files:

```sh
rm -r .agents/skills/get-started
```
