# Handoff

First-read workflow for AI coding agents working in this repository.

## Start Here

1. Read the root `README.md` for what Discipline is and the quick start.
2. Read `docs/AGENTS.md` for the agent playbook (note: Discipline applies its own Local Overrides on the framework defaults).
3. Read `docs/DECISIONS.md` for the durable decisions (OSS license, stack, anti-completeness rule).
4. Read `docs/CHANGELOG.md` for completed work.

## Current Landing Zone

Discipline is early-stage and actively used on the maintainer's own projects — that dogfooding is the validation. The templates and the CLI are the stable core; expect the surrounding docs to evolve.

## Documentation Completion Gate

Documentation is part of the work. Before final response or commit, audit the docs touched by the task:

- Agent role or model routing change → `docs/AGENTS.md` (project-local) or `docs/agents/*.md` if added.
- Architectural / product decision → `docs/DECISIONS.md`.
- Meaningful completed work → `docs/CHANGELOG.md`.
- Entry point or reading order change → root `README.md` and this file.

Do not leave completed TODO entries as `[x] DONE`. Once work ships and is recorded in `docs/CHANGELOG.md`, delete it from `docs/TODO.md`.

## Project Workflow

### Branching

- One PR = one feature = one branch off latest main. When a PR merges, or work pivots to a meaningfully different feature, start a fresh branch off the *updated* main: `git fetch && git checkout -b <new-branch> <remote>/<main-branch>`. Never push follow-on commits to a merged or stale branch — those commits become orphans that never reach main. If you've already committed onto a stale branch, cherry-pick onto a fresh branch and open a new PR; do not try to salvage the stale one.

## Safety Rules

- Do not commit secrets or private data.
- Confirm destructive filesystem or git operations with the user.
