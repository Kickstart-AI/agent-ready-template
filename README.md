# Agent-ready project template

## Table of contents
- [How to use this repository](#how-to-use-this-repository)
  - [As a reference](#as-a-reference)
  - [As a starting point for your own project](#as-a-starting-point-for-your-own-project)
- [Security and permissions](#security-and-permissions)
  - [Claude Code](#claude-security)
  - [Codex](#codex-security)
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

The [`get-started` skill](#agentsskills) guides the project setup.

## Security and permissions

Instructions in `AGENTS.md` are only requests. Agents can ignore them, especially in long sessions. This template therefore also uses settings that the agent tools enforce. Each agent has its own settings file, and the rules do not transfer between agents.

<a id="claude-security"></a>

### Claude Code

`.claude/settings.json` denies access to secrets, destructive commands, git remote actions, infrastructure changes, cloud CLIs, publishing, and network tools. It requires approval for dependency installation, commits, and other commands that change local state.

Claude Code checks permission rules in this order, and the first match wins:

1. **`deny`**: Claude Code blocks the command. It does not ask you, in any permission mode, including auto mode. A matching `allow` rule or an earlier "Yes, and don't ask again" does not override it.
2. **`ask`**: Claude Code always asks you, also in auto mode. The auto mode classifier cannot approve these commands.
3. **`allow`**: Claude Code runs the command without asking.

Other commands follow the permission mode. In manual mode Claude Code asks you. In auto mode a classifier decides.

Put personal overrides in `.claude/settings.local.json`. These cannot override a `deny` rule, because Claude Code merges the rules from all files. To run a denied command, run it yourself in a separate terminal, or remove the rule from `.claude/settings.json`.

**Rules match the command text only.** `Bash(git push *)` blocks `git push origin main`, but not `git -C . push` or `bash -c 'git push'`. The rules stop the usual form of a command. They are not a security boundary.

**The sandbox is the security boundary.** With `sandbox.enabled`, the operating system limits every Bash command, whatever its text:

- Commands can write only inside the project.
- Commands cannot read the paths in the `Read` deny rules.
- Each new network host needs your approval.
- `allowUnsandboxedCommands: false` prevents Claude from running a failed command again outside the sandbox.

The sandbox applies to Bash commands only. Claude's own file tools (`Read`, `Edit`) use the `Read` and `Edit` rules instead. For more information, see the [permissions](https://code.claude.com/docs/en/permissions) and [sandboxing](https://code.claude.com/docs/en/sandboxing) documentation.

<a id="codex-security"></a>

### Codex

The project uses `workspace-write` so Codex can edit repository files and run commands within the sandbox. Network access is disabled by default. The rules in `.codex/rules/default.rules` block selected command prefixes, including dependency installation and updates, commits, rebases, file removal, Docker, and Terraform. See the rule file for the full list.

**A `prompt` rule requires approval, but does not require a human to approve.** With **Approve for me** enabled (`approvals_reviewer = "auto_review"`), Codex sends these requests to its automatic reviewer. The reviewer can approve the command without asking you. With `approvals_reviewer = "user"`, eligible requests go to you instead. Codex has no documented per-command setting that forces human approval while Approve for me remains enabled.

For this reason, this template uses `forbidden` for these commands instead of `prompt`. A matching command is blocked in both manual and automatic approval modes. Auto-review cannot approve it, and a matching `allow` rule does not override it. Run a needed blocked operation yourself in a separate terminal. The [Claude review command](#using-claude-and-codex-together) remains an explicit `allow` exception.

These rules do not make all other commands safe. They match literal command prefixes, so shell wrappers, alternate executable paths, and commands run by other tools can bypass them. They do not replace the sandbox, and they do not prevent reads of `.env` files, keys, or credentials. Keep secrets outside the agent's accessible environment. Project settings are defaults that users can override; use managed requirements for enforced restrictions. The project must be trusted for its rules to load; restart Codex after changes. See the [Codex rules](https://learn.chatgpt.com/docs/agent-configuration/rules) and [Auto-review documentation](https://learn.chatgpt.com/docs/sandboxing/auto-review).

## Content

### `AGENTS.md`

The main instruction file for your coding agent. This is read automatically by most agents at the start of every session. It contains guidelines for coding style, communication, approach, error handling, and documentation. These are opinionated defaults that work well in practice. Review them and adjust to your preferences.

See [this blog post](https://kickstart.ai/news/agentic-engineering-best-practices-coding-agents-avoid-slop-increase-productivity) for more context on why these instructions look the way they do.

### `CLAUDE.md`

A one-liner that points to `AGENTS.md`. Claude Code reads `CLAUDE.md` by default, so this redirect makes sure it picks up the same instructions as every other agent.

### `.claude/settings.json`

Claude Code permission rules and sandbox settings. See [Security and permissions: Claude Code](#claude-security) for the blocked operations, approval behavior, and personal overrides.

### `.codex/`

Codex settings in `.codex/config.toml` and command rules in `.codex/rules/default.rules`. See [Codex](#codex-security) for how the rules work.

### Using Claude and Codex together

You can use one agent to review the work of the other. The two directions work differently:

- **Codex calls Claude**: the Codex rules allow this exact command outside the Codex sandbox:

  ```sh
  claude --safe-mode --print --permission-mode plan --tools Read,Glob,Grep --disallowedTools 'mcp__*' --model claude-opus-5-5 -- "Review the relevant files and report findings."
  ```

  The rule allows `--model claude-opus-5-5` in this position, or no `--model` option to use the default model. Other model values or flag arrangements need separate approval.

  Claude can read and search, but has no shell or editing tools. Safe mode disables hooks, plugins, skills, and automatic `CLAUDE.md` loading; managed policy still applies. Supply review instructions and file paths in the prompt. Keep the final `--` so later arguments cannot change these restrictions. This is a tool restriction, not an OS read-only sandbox. See the [Claude CLI reference](https://code.claude.com/docs/en/cli-reference).

- **Claude calls Codex**: Codex must write its own state in `~/.codex` and reach the OpenAI API, so it must run outside the Claude sandbox. Codex then uses its own read-only sandbox. Add this to your user settings in `~/.claude/settings.json` and restart Claude:

  ```json
  "permissions": {
    "deny": [
      "Bash(codex exec *danger*)",
      "Bash(codex exec *workspace-write*)",
      "Bash(codex exec *--full-auto*)",
      "Bash(codex exec * -c *)",
      "Bash(codex exec *--config*)",
      "Bash(codex exec * -p *)",
      "Bash(codex exec *--profile*)"
    ]
  },
  "sandbox": { "excludedCommands": ["codex exec -m * -s read-only -- *"] }
  ```

  The exception is personal, so it belongs in your user settings, not in the project. The deny rules block the flags that change the Codex sandbox, because the `*` for the model can match any text. Claude can then run:

  ```sh
  codex exec -m gpt-6-astra -s read-only -- "Follow the review instructions in prompt.md."
  ```

  Use exactly this form. A redirect (such as `< /dev/null` or `> review.txt`) or a command substitution (`$(...)`) keeps the command in the sandbox, and Codex fails. Use `-o review.txt` to save the output. A prompt that contains ` -c `, ` -p `, or "danger" is denied, so put long prompts in a file.

### `.agents/skills/`

Skills are task-specific prompts that are only loaded when needed. They keep your `AGENTS.md` focused on general guidelines while letting you define detailed workflows for recurring tasks.

This template ships with two skills:

- **`get-started`** -- An interactive skill that walks you through setting up a new project. It asks about what you want to build, your skill level, preferred stack, and coding conventions. Then it creates a plan, customizes the `AGENTS.md` to your project, and scaffolds the initial project structure. You can remove this skill once your project is set up.
- **`wrap-up`** -- A session-closing skill that helps the agent review completed work, record meaningful decisions in `docs/decisions/`, and keep plan files and their embedded `## TODOs` sections current.

The `.claude/skills` directory is a symlink to `.agents/skills/`, so Claude Code can find them too.

### `docs/`

A lightweight documentation structure for the agent (and you) to keep track of things across sessions:

- `docs/decisions/` -- Record architectural or design decisions with date-stamped files (`YYYY-MM-DD.md`) so the agent can look up past reasoning.
- `docs/plans/` -- Multi-session plans organized under `active/`, `pending/`, and `completed/`. Each plan keeps its follow-up work in a `## TODOs` section at the bottom.

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
