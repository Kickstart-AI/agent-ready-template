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

Other commands follow the permission mode. Built-in read-only commands such as `ls` and `cat` run without asking. Other Bash commands run inside the sandbox. Because `autoAllowBashIfSandboxed` is `false`, they follow the mode like file edits and commands outside the sandbox: in manual mode Claude Code asks you, and in auto mode a classifier decides. The `allow` rules let the TypeScript template checks (`pnpm validate`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`) run without asking. These scripts come from `package.json`, so check changes to it in the diff. Codex has no matching rules, because Codex `allow` rules run commands outside its sandbox.

Put personal overrides in `.claude/settings.local.json`. "Yes, and don't ask again" also saves an `allow` rule there. Do not choose it for generic tools such as `sed`, `python3`, or `bash`: a rule like `Bash(sed *)` lets every later `sed` command run without asking. These cannot override a `deny` rule, because Claude Code merges the rules from all files. To run a denied command, run it yourself in a separate terminal, or remove the rule from `.claude/settings.json`.

**Rules match the command text only.** `Bash(git push *)` blocks `git push origin main`, but not `git -C . push` or `bash -c 'git push'`. The rules stop the usual form of a command. They are not a security boundary.

**The sandbox is the security boundary.** With `sandbox.enabled`, the operating system limits every Bash command, whatever its text:

- Commands can write only inside the project and temporary directories.
- Commands cannot read the paths in the `Read` deny rules.
- Commands can reach `api.github.com`, `registry.npmjs.org`, and `pypi.org` without approval, the same hosts as the Codex proxy. Each other host needs approval: from you in manual mode, or from the classifier in auto mode. To block other hosts instead, set `sandbox.network.strictAllowlist: true` in `~/.claude/settings.json`. Claude Code reads this key only from user or managed settings. With it, Claude Code ignores `allowedDomains` from the project, so also put the allowed hosts in `~/.claude/settings.json`.
- Package files come from hosts that are not allowed, for example `files.pythonhosted.org`. So agents cannot install dependencies. Run `uv sync` or `pnpm install` yourself in a separate terminal. The templates and the agent settings keep all package caches in the project's `.cache/` folder (uv, `uvx` tools, pre-commit, and the pnpm store), so sandboxed commands can still read and write them. The checks exclude `.cache/`.
- Downloads and installs are still possible from the allowed hosts. The rules cover the usual install commands, but not every alias (npm alone has several, such as `npm in`) or a script that downloads packages itself. The rules cannot prevent installs in general. The sandbox limits what an installed package can do.
- `allowUnsandboxedCommands: false` prevents Claude from running a failed command again outside the sandbox.
- Sandboxed commands can still change files that run later outside the sandbox, such as `.husky/` hooks, `.pre-commit-config.yaml` and `package.json` scripts. Check these files in the diff before you commit.
- Only plain `git fetch` and `git pull`, without arguments, run outside the sandbox. SSH does not work through the sandbox network proxy, so git cannot reach the remote from inside the sandbox. Arguments are not allowed, because options such as `--upload-pack` run a program.
- Sandboxed commands cannot write `.git/config`, `.git/config.worktree`, or `.git/hooks`. Git runs commands from these files, for example `core.sshCommand`, and `git fetch` and `git pull` run outside the sandbox. Settings that already point to files in the project, such as `core.hooksPath` or `include.path`, are not protected, so check `.git/config` in existing clones.

The sandbox applies to Bash commands only. Claude's own file tools (`Read`, `Edit`) use the `Read` and `Edit` rules instead. For more information, see the [permissions](https://code.claude.com/docs/en/permissions) and [sandboxing](https://code.claude.com/docs/en/sandboxing) documentation.

<a id="codex-security"></a>

### Codex

The project uses `workspace-write` so Codex can edit repository files and run commands within the sandbox. Command network access uses the domain-restricted proxy described below. The rules in `.codex/rules/default.rules` block selected command prefixes, including dependency installation and updates, commits, rebases, file removal, Docker, and Terraform. See the rule file for the full list.

The config enables both `sandbox_workspace_write.network_access` and `features.network_proxy.enabled`. The proxy allows only these destinations:

| Domain | Intended use | Also accessible |
| --- | --- | --- |
| `api.github.com` | GitHub CLI queries | Repository file contents and write operations permitted by the credentials |
| `registry.npmjs.org` | npm metadata queries | Package archives served from the same host |
| `pypi.org` | Python metadata queries | Other endpoints on this host; the policy does not restrict URL paths or HTTP methods |

Other destinations are blocked by the proxy. Keep the proxy enabled whenever command networking is enabled; network access without the proxy permits unrestricted outbound connections. Filesystem restrictions remain active. This domain policy applies to sandboxed commands and their subprocesses, not to connectors, hosted tools, or explicitly allowed commands outside the sandbox.

**The allowed domains are not metadata-only or read-only services.** Any sandboxed process can contact them. In particular, allowing `registry.npmjs.org` permits package archive downloads as well as metadata queries. GitHub API access can return source code and permit writes when the credentials allow them. Use read-only credentials when that boundary is required.

**These settings do not guarantee that packages cannot be downloaded or installed.** This limitation applies to both agents. Codex forbids the listed installation command forms; Claude requires approval for its listed forms. Command matching does not cover every interpreter, wrapper, or program that can download, unpack, install, or execute code. Local or cached packages can be installed without network access, and writable project directories can hold packages, environments, and executable files.

The Codex proxy excludes `files.pythonhosted.org`, which normally serves PyPI package files, and `github.com`, which ordinary GitHub-based pip installs need. This blocks those normal download routes when the proxy is active, but does not prevent all code acquisition through allowed hosts or local files. The intended protection is restricted network destinations and checks on common installation commands, not a complete ban on package installation.

Metadata commands can use temporary caches, for example `npm view typescript version --cache /tmp/npm-cache` or `python -m pip --cache-dir /tmp/pip-cache list --outdated`. See [Codex network isolation](https://learn.chatgpt.com/docs/agent-approvals-security#network-isolation).

The granular approval policy sets `sandbox_approval = false`. Ordinary requests to run outside the sandbox are rejected instead of sent to you or Auto-review. Explicit `allow` rules still permit their matching commands outside the sandbox without approval. The other approval categories remain enabled: command-rule prompts (`rules`), MCP requests (`mcp_elicitations`), additional permission requests (`request_permissions`), and skill approvals (`skill_approval`). This blocks sandbox escalation requests; it is not a blanket ban on every way to grant access. See the [approval policy reference](https://learn.chatgpt.com/docs/config-file/config-reference).

**Codex cannot fetch or pull.** The proxy does not allow Git remote hosts such as `github.com`, and ordinary sandbox escalation is rejected. This template adds no `allow` rules for `git fetch` or `git pull`, because Codex rules match prefixes: `["git", "fetch"]` would also allow any arguments, including options such as `--upload-pack` that run a program outside the sandbox. Run these commands yourself in a separate terminal.

**A `prompt` rule requires approval, but does not require a human to approve.** With **Approve for me** enabled (`approvals_reviewer = "auto_review"`), Codex sends these requests to its automatic reviewer. The reviewer can approve the command without asking you. With `approvals_reviewer = "user"`, eligible requests go to you instead. Codex has no documented per-command setting that forces human approval while Approve for me remains enabled.

For this reason, this template uses `forbidden` for these commands instead of `prompt`. A matching command is blocked in both manual and automatic approval modes. Auto-review cannot approve it, and a matching `allow` rule does not override it. Run a needed blocked operation yourself in a separate terminal.

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
- `uv.lock`

Use this set for Python projects. It uses `uv`, `ruff`, `ty`, pre-commit checks, and secret scanning because they are fast, easy for agents to run locally. The pre-commit hooks run each tool through `uvx` with an exact version. Dependabot does not update these versions, so update them by hand, and keep the 30-day release delay. The `uv` config waits 30 days before accepting new package releases and sets a minimum `uv` version (`required-version`) that blocks releases with known vulnerabilities. Raise it when `uv` publishes a security release. `certifi`, the CA certificate bundle, has a short permanent delay of 2 days instead, so certificate revocations install quickly. To let another urgent security fix through, add the package to `exclude-newer-package`.

#### `ts/`

- `package.json`
- `pnpm-lock.yaml`
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

Use this set for TypeScript projects. It uses Husky and lint-staged, while CI can still run the full validation script. ESLint, TypeScript, Knip, jscpd, and secretlint cover linting, strict typing, dead code, duplicate code, and secrets. All direct dependencies, and pnpm itself, are pinned to exact versions. Install the pnpm version from `packageManager` (for example `pnpm self-update 12.5.1`). With any other version, pnpm tries to download the pinned one, and every `pnpm` command fails in the agent sandbox. Both npm (`.npmrc`) and pnpm (`pnpm-workspace.yaml`) wait 30 days before accepting new package releases. To let an urgent security fix through, add the package to `min-release-age-exclude` in `.npmrc` and to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml`. `package.json` sets a patched minimum version for each supported Node.js line (`engines.node`), and both package managers refuse to install on an older version. Raise these minimums when Node.js publishes a security release. In CI, set `check-latest: true` on `actions/setup-node`, because runner images can lag behind a security release.
