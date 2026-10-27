# Changelog

All notable changes to this project are recorded in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [0.2.0] - Unreleased

Pull request: [#8](https://github.com/Kickstart-AI/agent-ready-template/pull/8)

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

[0.2.0]: https://github.com/Kickstart-AI/agent-ready-template/pull/8
[0.1.0]: https://github.com/Kickstart-AI/agent-ready-template/commits/main
