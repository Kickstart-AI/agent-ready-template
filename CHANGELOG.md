# Changelog

All notable changes to this project are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.4.0] - 2026-11-16

Pull request: [#9 - Add agent tool permission settings](https://github.com/Kickstart-AI/agent-ready-template/pull/9)

The Claude Code settings were tested with Claude Code 2.1.325.

### Security
- Add Claude Code permission rules in `.claude/settings.json`:
  - Deny reading secrets (`.env` files, keys, cloud and SSH credentials), destructive commands, git remote actions, infrastructure changes, cloud CLIs, publishing, and network tools.
  - Ask before dependency installs, commits, and other commands that change local state.
  - Allow the TypeScript template checks (`pnpm validate`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`) without a prompt.
- Enable the Claude Code Bash sandbox. Sandboxed commands still follow the permission mode, cannot run again outside the sandbox, and can reach only `api.github.com`, `registry.npmjs.org`, and `pypi.org` without approval. Sandboxed commands cannot write `.git/config`, `.git/config.worktree`, or `.git/hooks`. Only plain `git fetch` and `git pull`, without arguments, run outside the sandbox, so they can use SSH.
- Add Codex settings in `.codex/config.toml`: a permission profile extending `:workspace`, network access only through a proxy restricted to the same three hosts, and rejection of sandbox escalation requests.
- Make `.claude/` and `.codex/` read-only in both agent sandboxes, with Edit deny rules for Claude file tools. Claude Edit deny rules also protect the agent configs in the home folder. Agents can still edit skills in `.agents/`. Exclude the agent folders from the pre-commit hook that always opens files for writing.
- Add Codex command rules in `.codex/rules/default.rules`. They forbid the same commands that Claude Code denies or asks about, because Codex automatic review can approve `prompt` rules.

### Added
- Add a "Security and permissions" section to the README. It explains how each agent enforces its rules, the limits of command matching, and that the allowed hosts can serve source code and packages.
- Keep all package caches in the project's `.cache/` folder, so sandboxed agents can use them: the uv cache and the pnpm store and cache through the template configs, and the `uvx` tools and pre-commit through the agent settings (`UV_CACHE_DIR`, `UV_TOOL_DIR`, `PRE_COMMIT_HOME`), because these tools ignore the project configuration. ESLint, pylint, and vulture exclude `.cache/`. `AGENTS.md` tells agents to run commands from the repository root, so they find these caches.
- Put the Python and pnpm bootstrap procedures in the `get-started` skill, with short links from the README. Developer-run setup populates project-local caches and runs the checks before agent validation. Explain that network and command restrictions do not guarantee installation is impossible.
- Explain that blocking `env` and `printenv` does not protect inherited secrets from shell expansion or other programs.
- Tell agents in `AGENTS.md` not to work around the sandbox and deny rules.
- Instruct the `get-started` skill to copy the dependency bootstrap into the project README and to ask the developer to remove the skill, because the sandbox blocks the agent from deleting it.
- Add lockfiles to both templates (`uv.lock`, `pnpm-lock.yaml`). CI checks that they match the manifests. Dependabot updates them; its Python entry uses the `uv` ecosystem instead of `pip`.
- Pin the Python check tools that pre-commit runs through `uvx` to exact versions: `ruff` 0.17.1, `ty` 0.0.89, `vulture` 2.16, `pylint` 4.1.3, `deptry` 0.25.1, `detect-secrets` 1.5.0, and `pre-commit` 4.7.0.

## [0.3.0] - 2026-11-16

Pull request: [#10](https://github.com/Kickstart-AI/agent-ready-template/pull/10)

### Added
- Add testing rules to `AGENTS.md`: behavior tests, real data instead of mocks, regression tests for bugs, manual UI tests, and end-to-end tests for data and ML projects.
- Instruct the `get-started` skill to adapt project-type-specific rules in `AGENTS.md`.
- Add way-of-working rules to `AGENTS.md`: stay in the ticket scope, comment only why, keep completed plans unchanged, keep decision entries short, and link plans and decisions to tickets.
- Instruct the `get-started` skill to record where tickets live and to offer focused architecture and convention docs.

## [0.2.0] - 2026-10-27

Pull request: [#8](https://github.com/Kickstart-AI/agent-ready-template/pull/8)

This release protects the templates against recent vulnerabilities and supply-chain attacks. It blocks tool versions with known vulnerabilities, delays new package releases, and pins all dependencies.

### Security
- Require patched Node.js versions. See the [Node.js October 2026 security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases).
- Require a `uv` version that does not trust the compromised eMudhra/emSign CA certificates. See the [Python announcement on the eMudhra/emSign CA certificate incident](https://discuss.python.org/t/information-for-python-users-regarding-emudhra-emsign-ca-certificate-security-incident/109576).
- Exempt the patched `zod` 4.6.6 ([GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)) and `fast-uri` 3.1.9 ([GHSA-w74x-v6f9-j3xg](https://github.com/advisories/GHSA-w74x-v6f9-j3xg)) from the 30-day release delay in the TypeScript template.
- Remove the `braces` vulnerability ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) from the TypeScript template tools.

### Added
- A GitHub workflow (`.github/workflows/validate.yml`) that runs the Python and TypeScript template checks.
- A version in `templates/py/pyproject.toml` and `templates/ts/package.json`, and this changelog.
- A 30-day release delay for npm (`.npmrc`) and pnpm (`pnpm-workspace.yaml`). This matches the `uv` delay.
- Minimum versions for Node.js (`engines.node`) and `uv` (`required-version`) that block releases with known vulnerabilities.
- An exemption from the `uv` release delay for `certifi`, so that certificate revocations install quickly.
- `get-started` steps that adapt the workflow, the Dependabot configuration, and the version to the new project.

### Changed
- The TypeScript template pins all direct dependencies and pnpm to exact versions.
- The TypeScript template uses the newest major versions of its tools that are at least 30 days old.
- The ESLint configuration uses `defineConfig` and does not use type-aware rules on `.mjs` files.
- `tsconfig.json` includes root `*.config.ts` files, so typed linting works for them.
- The Python template uses `pre-commit-hooks` v6.0.0.

### Fixed
- secretlint did not find its configuration. It now uses `.secretlintrc.json`.
- Knip, ESLint, and Prettier failed on a new TypeScript project.
- Missing final newlines and trailing whitespace in the agent instruction files.

### Removed
- The redundant `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` packages. `typescript-eslint` supplies them.

## [0.1.0] - 2026-05-22

### Added
- Agent instructions (`AGENTS.md`, `CLAUDE.md`) with coding, security, communication, and documentation rules.
- The `get-started` and `wrap-up` agent skills.
- A documentation structure for plans, decisions, and TODOs.
- Python and TypeScript starter templates with linting, type checks, dead-code and duplicate-code detection, and secret scanning.
- A Dependabot configuration for the template dependencies, with a 30-day cooldown and grouped updates.

### Changed
- Dependency updates from Dependabot ([#6](https://github.com/Kickstart-AI/agent-ready-template/pull/6)).

[0.4.0]: https://github.com/Kickstart-AI/agent-ready-template/pull/9
[0.3.0]: https://github.com/Kickstart-AI/agent-ready-template/pull/10
[0.2.0]: https://github.com/Kickstart-AI/agent-ready-template/pull/8
[0.1.0]: https://github.com/Kickstart-AI/agent-ready-template/commits/ff6b7cb
