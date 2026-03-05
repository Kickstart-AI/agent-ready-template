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
- What is the skill-level of the developer?
- Do they have already an idea about the architecture / stack of the project?
- Are there any coding conventions they want to follow?

## 2. Plan
Make a plan for the execution of the initial project. Be sure to keep the developer involved in writing the plan. 
Present the plan to the developer. Finally, save the plan in `docs/plans/get-started.md`.

## 3. Customize Agent Rules
Review `AGENTS.md` with the developer and customize it to their preferences before scaffolding implementation details. Keep it minimal and specific to this repo.

## 4. Execution
Only start this step after explicit developer approval of Step 2 (Plan) and Step 3 (Customize Agent Rules).
Execute the plan. Make sure to keep the developer in the loop and explain what you are doing.

## 5. Evaluation & Reflection
Look at your work and reflect on what you did. If there were interventions from the developer, make sure to document them in `AGENTS.md` or `README.md`, to avoid making the same mistakes again.
Definition of done checklist:
- `AGENTS.md` instructions are customized to the user.
- Initial project files/scaffolding are created.
- Architecture/stack choice is documented.
- Only the minimum necessary files and documents are present. Avoid overengineering / scope creep.
- Test/lint command is defined and recorded.
- Open TODOs can be logged in `docs/TODO.md`.
- Decisions should be logged in `docs/decisions/YYYY-MM-DD.md`.
- Open decisions or deferred items are listed explicitly.

## 6. Wrap-up
Confirm with the developer that the project is ready; then you can remove the `get-started` skill from the project.
