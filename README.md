# Agent-ready project template

## Table of contents

- [Content](#content)
  - [`AGENTS.md`](#agentsmd)
  - [`CLAUDE.md`](#claudemd)
  - [`.agents/skills/`](#agentsskills)
  - [`docs/`](#docs)
- [How to use this repository](#how-to-use-this-repository)
  - [As a reference](#as-a-reference)
  - [As a starting point for your own project](#as-a-starting-point-for-your-own-project)

This is a template repository for **any type of project** that you want to build using coding agents.
It contains a minimal set of agent instructions and a project structure that works well with agents like OpenAI Codex, Claude Code, Factory Droid, and others.

The idea is that you clone this repo, start your coding agent, and let it help you set up the rest.

## Content

### `AGENTS.md`

The main instruction file for your coding agent. This is read automatically by most agents at the start of every session. It contains guidelines for coding style, communication, approach, error handling, and documentation. These are opinionated defaults that work well in practice. Review them and adjust to your preferences.

See the blog post **TODO ADD LINK** for more context on why these instructions look the way they do.

### `CLAUDE.md`

A one-liner that points to `AGENTS.md`. Claude Code reads `CLAUDE.md` by default, so this redirect makes sure it picks up the same instructions as every other agent.

### `.agents/skills/`

Skills are task-specific prompts that are only loaded when needed. They keep your `AGENTS.md` focused on general guidelines while letting you define detailed workflows for recurring tasks.

This template ships with one skill:

- **`get-started`** -- An interactive skill that walks you through setting up a new project. It asks about what you want to build, your skill level, preferred stack, and coding conventions. Then it creates a plan, customizes the `AGENTS.md` to your project, and scaffolds the initial project structure. You can remove this skill once your project is set up.

The `.claude/skills` directory is a symlink to `.agents/skills/`, so Claude Code can find them too.

### `docs/`

A lightweight documentation structure for the agent (and you) to keep track of things across sessions:

- `docs/decisions/` -- Record architectural or design decisions with date-stamped files (`YYYY-MM-DD.md`) so the agent can look up past reasoning.
- `docs/plans/` -- Multi-session plans that describe larger pieces of work. Completed plans get moved to `docs/plans/completed/`.
- `docs/todos/` -- A `TODOS.md` file for tracking open work. When todos are completed, they get archived to `docs/todos/completed/YYYY-MM-DD.md`.

This structure exists because agents don't have memory across sessions. Without these files, every new session starts from zero context about what was decided and what was done before.

## How to use this repository

### As a reference

Browse the `AGENTS.md` and the skill files to see how agent instructions are structured. Copy whatever is useful into your own projects.

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
