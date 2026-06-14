# Agents Templates

Project-local role contracts. Each file in this folder is a self-contained work contract for a named role: what it can decide, what it can't, what signals gate its work, and what it produces.

These are starters. Copy the file you need into a spawned project's `docs/agents/` folder, then fill in the `<placeholders>` with project-specific values.

## When to copy `_TEMPLATE.md` vs use a starter

- **Use a starter** (any of the named files below) when your project needs that role and the starter's responsibilities, authority boundaries, and signals roughly fit. Adjust the `<placeholders>` and trim sections you don't need.
- **Copy `_TEMPLATE.md`** when you need a role that isn't one of the starters — a project-specific reviewer, a domain-specific specialist (e.g. a `MUSIC_LICENSING_REVIEWER`, a `TRIVIA_CONTENT_CURATOR`, a `TRADING_RULES_AUDITOR`), or a role with authority boundaries that don't match any starter.

## How role contracts are referenced from `AGENTS.md`

The project's top-level `docs/AGENTS.md` indexes the files in `docs/agents/`. AGENTS.md owns cross-cutting guidance (host model, tier framework, escalation rules, autonomy policy); the per-role files in `docs/agents/` own role-specific authority and signals.

A typical AGENTS.md index section looks like:

```markdown
## Named Subagents

Detailed contracts live in `docs/agents/`:

- `docs/agents/STAKEHOLDER.md` — funding and scope owner.
- `docs/agents/RECON.md` — read-only search.
- `docs/agents/PLANNER.md` — approach planning.
- `docs/agents/ARCHITECT.md` — durable decisions.
- `docs/agents/DEBUGGER.md` — root-cause hunts.
- `docs/agents/DOC_AUDIT.md` — doc consistency.
- `docs/agents/TEST_STRATEGIST.md` — test plans and coverage.
- `docs/agents/SECURITY_REVIEWER.md` — adversarial review.
- `docs/agents/CROSS_REPO_SYNC.md` — multi-repo coordination.
- `docs/agents/BACKEND_IMPACT.md` — backend change analysis.
- `docs/agents/FRONTEND_IMPACT.md` — frontend change analysis.
- `docs/agents/QUEUE_CURATOR.md` — autonomous-queue maintenance.
```

Role contracts must not duplicate AGENTS.md's tier framework. Reference it (`See docs/AGENTS.md for tier framework`) rather than copying the table. When the framework table changes, projects updating in place only need to touch one file.

## Naming convention

- `UPPERCASE.md` for single-word roles: `RECON.md`, `PLANNER.md`, `ARCHITECT.md`.
- `UPPER_SNAKE.md` for multi-word roles: `DOC_AUDIT.md`, `SECURITY_REVIEWER.md`, `CROSS_REPO_SYNC.md`, `BACKEND_IMPACT.md`.
- The role's `Name:` field in the contract matches the filename (without `.md`).
- The leading underscore on `_TEMPLATE.md` keeps the template at the top of an alphabetical listing and makes it obvious that it is not a real role.

## Files in this folder

- `_TEMPLATE.md` — generic scaffold to copy for new roles.
- `STAKEHOLDER.md` — funding / scope / approval-signal owner. Project-level heir of the Founder pattern.
- `RECON.md` — fast read-only search.
- `PLANNER.md` — high-level approach planning.
- `ARCHITECT.md` — design decisions and trade-off analysis.
- `DEBUGGER.md` — root-cause hunts.
- `DOC_AUDIT.md` — doc review for staleness, gaps, inconsistencies.
- `TEST_STRATEGIST.md` — test plan and coverage strategy.
- `SECURITY_REVIEWER.md` — adversarial security audit passes.
- `CROSS_REPO_SYNC.md` — multi-repo coordination and sibling-doc sync.
- `BACKEND_IMPACT.md` — backend change-impact analysis.
- `FRONTEND_IMPACT.md` — frontend change-impact analysis.
- `QUEUE_CURATOR.md` — autonomous-queue maintenance, refill, prioritization.

## Promoting changes back to the framework

If a project edits one of these contracts in a way that other projects would benefit from, promote the change back to this folder via `docs/PLAYBOOK_FEEDBACK.md` (in the project) and a `CROSS_REPO_SYNC` pass with `PROMOTE_TO_FRAMEWORK_APPROVED`. The goal is to keep the starters honest and current rather than letting per-project copies silently diverge.
