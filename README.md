# Agent-ready project template

## Table of contents
- [How to use this repository](#how-to-use-this-repository)
  - [As a reference](#as-a-reference)
  - [As a starting point for your own project](#as-a-starting-point-for-your-own-project)
- [Content](#content)
  - [`AGENTS.md`](#agentsmd)
  - [`CLAUDE.md`](#claudemd)
  - [`.claude/settings.json`](#claudesettingsjson)
  - [`.codex/`](#codex)
  - [Using Claude and Codex together](#using-claude-and-codex-together)
  - [`.agents/skills/`](#agentsskills)
  - [`docs/`](#docs)
  - [`templates/`](#templates)
    - [`py/`](#py)
    - [`ts/`](#ts)

This is a template repository for **any type of project** that you want to build using coding agents.
It contains a minimal set of agent instructions and a project structure that works well with agents like OpenAI Codex, Claude Code, Factory Droid, and others.

The idea is that you clone this repo, start your coding agent, and let it help you set up the rest.

## How to use this repository

### As a reference

Browse the `AGENTS.md`, the skill files and templates to see how agent instructions are structured. Copy whatever is useful into your own projects.

### As a starting point for your own project

1. Install the coding agent of your choice.
   - OpenAI Codex: https://openai.com/codex/
   - Claude Code: https://code.claude.com/docs/en/overview
   - Factory.AI Droid: https://factory.ai/product/ide
   - Opencode: https://opencode.ai/
   - Pi: https://pi.dev/
   - Aider: https://aider.chat/
2. Clone this repository and open it in your terminal.
3. Start your coding agent and prompt it with **"Help me get started!"**

The `get-started` skill will kick in and guide you through setting up your project interactively.

## Content

### `AGENTS.md`

The main instruction file for your coding agent. This is read automatically by most agents at the start of every session. It contains guidelines for coding style, communication, approach, error handling, and documentation. These are opinionated defaults that work well in practice. Review them and adjust to your preferences.

See [this blog post](https://kickstart.ai/news/agentic-engineering-best-practices-coding-agents-avoid-slop-increase-productivity) for more context on why these instructions look the way they do.

### `CLAUDE.md`

A one-liner that points to `AGENTS.md`. Claude Code reads `CLAUDE.md` by default, so this redirect makes sure it picks up the same instructions as every other agent.

### `.claude/settings.json`

Permission rules and sandbox settings that Claude Code enforces. Instructions in `AGENTS.md` can be ignored in long sessions, but these rules cannot be overridden by the agent:

- **Deny**: reading secrets (`.env`, keys, cloud and SSH credentials), destructive commands, git remote actions, infrastructure changes, cloud CLIs, publishing, and network tools.
- **Ask**: installing dependencies, commits, and other commands that change local state.
- **Sandbox**: Bash commands can only write inside the project, and each new network host needs your approval.

Bash deny rules match the command text only, so `bash -c 'curl ...'` or `/usr/bin/curl` is not blocked by the rules. The sandbox is the real boundary. See the [permissions documentation](https://code.claude.com/docs/en/permissions#permission-rule-syntax). Put personal overrides in `.claude/settings.local.json`.

### `.codex/`

Codex uses `.codex/config.toml` and `.codex/rules/default.rules` in trusted projects. Restart Codex after changing rules. The workspace-write sandbox allows repository edits and non-blocked commands, with network access disabled. Commands that need more access can request approval. Command rules block or ask for approval for the matching command prefixes. See the [Codex rules documentation](https://learn.chatgpt.com/docs/agent-configuration/rules).

These settings are not equivalent to the Claude settings. Codex rules match literal argument prefixes, not arbitrary argument positions or wildcards. Shell wrappers and constructs, alternate executable paths, and commands run by other tools can bypass these matches. The rules do not block reads of `.env` files, keys, or credentials. Keep secrets outside the agent's accessible environment or use an enforced sandbox that restricts reads. Project settings are defaults and can be overridden; use managed requirements for enforced restrictions.

### Using Claude and Codex together

You can use one agent to review the work of the other. The two directions work differently:

- **Codex calls Claude**: the Codex rules allow this exact command outside the Codex sandbox:

  ```sh
  claude --safe-mode --print --permission-mode plan --tools Read,Glob,Grep --disallowedTools 'mcp__*' -- "Review the relevant files and report findings."
  ```

  Claude can read and search, but has no shell or editing tools. Safe mode disables hooks, plugins, skills, and automatic `CLAUDE.md` loading; managed policy still applies. Supply review instructions and file paths in the prompt. Keep the final `--` so later arguments cannot change these restrictions. This is a tool restriction, not an OS read-only sandbox. See the [Claude CLI reference](https://code.claude.com/docs/en/cli-reference).

- **Claude calls Codex**: this does not work. Codex must write its own state in `~/.codex`, and the Claude sandbox blocks that. In our tests, the Claude desktop app did not apply a `sandbox.excludedCommands` exception for Codex. Run the Codex review yourself in a separate terminal:

  ```sh
  codex exec -s read-only -- "Review the uncommitted changes and report findings."
  ```

### `.agents/skills/`

Skills are task-specific prompts that are only loaded when needed. They keep your `AGENTS.md` focused on general guidelines while letting you define detailed workflows for recurring tasks.

This template ships with two skills:

- **`get-started`** -- An interactive skill that walks you through setting up a new project. It asks about what you want to build, your skill level, preferred stack, and coding conventions. Then it creates a plan, customizes the `AGENTS.md` to your project, and scaffolds the initial project structure. You can remove this skill once your project is set up.
- **`wrap-up`** -- A session-closing skill that helps the agent review completed work, record meaningful decisions in `docs/decisions/`, and keep plan files and their embedded `## TODOs` sections current.

The `.claude/skills` directory is a symlink to `.agents/skills/`, so Claude Code can find them too.

### `docs/`

A lightweight documentation structure for the agent (and you) to keep track of things across sessions:

- `docs/decisions/` -- Record architectural or design decisions with date-stamped files (`YYYY-MM-DD.md`) so the agent can look up past reasoning.
- `docs/plans/` -- Multi-session plans that describe larger pieces of work, organized under `active/`, `pending/`, and `completed/`.
- `docs/plans/...` plan files also carry their own `## TODOs` sections at the bottom, so open follow-up work stays attached to the plan that produced it.

This structure exists because agents don't have memory across sessions. Without these files, every new session starts from zero context about what was decided and what was done before.

### `templates/`

This folder contains starter config templates used by the `get-started` skill. They are not active until moved to the repo root.

They contain code quality checks with reasonable defaults to catch the common mistakes agents make: bad formatting, weak typing, dead code, large files, unused dependencies, and leaked secrets.

It is inspired by the concept of "Agent Readiness" by Factory.AI: https://factory.ai/news/agent-readiness

#### `py/`

- `.pre-commit-config.yaml`
- `.gitignore`
- `pyproject.toml`

Use this set for Python projects. It uses `uv`, `ruff`, `ty`, pre-commit checks, and secret scanning because they are fast, easy for agents to run locally. The `uv` config waits 30 days before accepting new package releases and sets a minimum `uv` version (`required-version`) that blocks releases with known vulnerabilities. Raise it when `uv` publishes a security release. `certifi`, the CA certificate bundle, has a short permanent delay of 2 days instead, so certificate revocations install quickly. To let another urgent security fix through, add the package to `exclude-newer-package`.

#### `ts/`

- `package.json`
- `.npmrc`
- `pnpm-workspace.yaml`
- `.gitignore`
- `tsconfig.json`
- `eslint.config.mjs`
- `.secretlintrc.json`
- `.prettierignore`
- `.husky/pre-commit`
- `.husky/pre-push`
- `.husky/_/husky.sh`

Use this set for TypeScript projects. It uses Husky and lint-staged, while CI can still run the full validation script. ESLint, TypeScript, Knip, jscpd, and secretlint cover linting, strict typing, dead code, duplicate code, and secrets. All direct dependencies, and pnpm itself, are pinned to exact versions. Both npm (`.npmrc`) and pnpm (`pnpm-workspace.yaml`) wait 30 days before accepting new package releases. To let an urgent security fix through, add the package to `min-release-age-exclude` in `.npmrc` and to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. `package.json` sets a patched minimum version for each supported Node.js line (`engines.node`), and both package managers refuse to install on an older version. Raise these minimums when Node.js publishes a security release. In CI, set `check-latest: true` on `actions/setup-node`, because runner images can lag behind a security release.
