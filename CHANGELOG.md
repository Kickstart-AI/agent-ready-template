# Changelog

All notable changes to this project are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.4.0] - 2026-11-16

Pull request: [#9 - Add agent tool permission settings](https://github.com/Kickstart-AI/agent-ready-template/pull/9)

### Security
- Disable ordinary Codex sandbox escalation approvals while retaining explicit allow rules and the other approval categories.
- Add Claude Code deny and ask rules, with the Bash sandbox enabled. Allow sandboxed commands to reach `api.github.com`, `registry.npmjs.org`, and `pypi.org`, the same hosts as the Codex proxy. Cover more install commands in the Claude ask rules and the Codex forbidden rules: `npm ci`, `npm add`, `pnpm i`, `yarn`, `bun add`, `bun install`, `pip3 install`, `python -m pip install`, and `uv pip install`.
- Add Codex workspace-write defaults, a network proxy restricted to `api.github.com`, `registry.npmjs.org`, and `pypi.org`, and forbidden command rules. Commands that require human approval in Claude are blocked in Codex because Approve for me can approve `prompt` rules automatically.
- Allow restricted Claude review invocations from Codex, with either the default model or explicit `claude-opus-5-5`.
- Limit the Claude sandbox exception to the fixed `codex exec -m gpt-6-astra -s read-only --` review command. Keep additional deny rules for unsafe Codex flags and output files.
- Run plain `git fetch` and `git pull`, without arguments, outside the Claude sandbox, so they can use SSH. Block sandboxed writes to `.git/config`, `.git/config.worktree`, and `.git/hooks`, because git runs commands from these files.

### Changed
- Clarify that allowed domains can serve source code and package archives, and that command rules do not guarantee packages cannot be downloaded or installed.
- Explain why Claude has argument-free Git fetch and pull sandbox exceptions while the Codex template does not.
- Consolidate README security and permission guidance. Explain the agents' differences, command matching limits, automatic review, and cross-agent review commands.

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
