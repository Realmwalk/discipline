# Project Name

<!-- Root README entrypoint. Keep this concise and point to docs/ for full context. -->
<!-- If copied into docs/README.md instead, include the detailed folder structure and commands below. -->
<!-- Do not put task lists, status updates, or volatile notes here. -->

## Quick Start

```bash
# install dependencies

# run locally

# run tests
```

## Folder Structure

```text
project-root/
├── docs/
├── src/
└── ...
```

## Important Docs

- `docs/README.md` - detailed project orientation, setup, and folder structure
- `docs/HANDOFF.md` - reading order, update rules, workflow (read first)
- `docs/TODO.md` - current active work and test checklist
- `docs/AGENTS.md` - AI agent playbook (host model, named subagent roles, autonomy tags, human-collab gate)
- `docs/AUTONOMOUS_QUEUE.md` - pre-approved tasks for unsupervised AI runs (optional)
- `docs/PROJECT_CONTEXT.md` - product and domain context
- `docs/ARCHITECTURE.md` - runtime structure and key flows
- `docs/DATA_MODEL.md` - persistence and schemas
- `docs/API_REFERENCE.md` - endpoints and integrations
- `docs/ASSETS.md` - media asset paths
- `docs/DEPLOYMENT.md` - hosting and launch checklist
- `docs/CHANGELOG.md` - completed changes
- `docs/ROADMAP.md` - long-term planning
- `docs/DECISIONS.md` - durable decision records
- `docs/CREDITS.md` - third-party libraries, vendored code, assets, fonts, attributions
- `LICENSE` (repo root) - project license
- `NOTICE` (repo root) - third-party attribution summary (if applicable)

## AI Workflow

The full agent playbook lives at `docs/AGENTS.md`: host model and escalation rules, cross-ecosystem tier framework (Frontier / Workhorse / Recon), coordinator-heavy host posture, named subagent roles with input/output contracts (recon, doc-audit, backend-impact, frontend-impact, test-strategist, cross-repo-sync, planner, architect, security-reviewer, debugger), autonomy tags, and the human-collaboration gate. Read it before spawning subagents or picking up tagged work.

Subagents do not own commits, merges, or doc-completion-gate sign-off — the host reconciles results.

## Current Status

Summarize development state, launch state, or known limitations.

## Tests

```bash
# unit test command
```
