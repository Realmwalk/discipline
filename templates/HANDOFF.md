# Handoff

Use this as the first-read handoff document for AI coding agents and future developers. Keep it updated whenever workflow, documentation structure, or project conventions change.

## Project-Specific Landing Zone

*(Add sections relevant to this project here, near the top, so first-read agents see them. The framework template intentionally leaves this empty — it is for project-shaped content that does not generalize. Common uses:*

- *Sibling repos / subproducts list and integration paths.*
- *Recently landed work worth flagging for context.*
- *Operator credentials, demo accounts, sandbox URLs.*
- *Cross-repo registration checklists when adding a new sibling.*
- *Project-specific hazards or "read this before changing X" warnings.*

*Delete this header and replace with project-specific sections, or delete the whole zone if the project doesn't need it.)*

## Related Repos

If this project has sibling repos (subproducts, shared-tooling repos, paired build/runtime repos), list them here so first-read agents can navigate the constellation:

- **`<sibling-repo>`** (`<absolute_path_to_sibling>`) — one-line purpose; how this repo depends on or is depended on by it; integration path if any (e.g. `/tools/<slug>/`).
- **`<another-sibling>`** (`<absolute_path_to_sibling>`) — …

**Cross-link invariant (cleanup-gate item):** When this section is updated — sibling added, removed, renamed, relocated, or its dependency direction shifted — sync the matching "Related Repos" section in each sibling's `HANDOFF.md` so the reference graph stays consistent. A missing back-link means the next agent reading the sibling will not know this repo exists. Treat the sync as part of the same task, not as follow-up work.

For projects with a clear hub repo (one repo holds the canonical subproduct list), siblings may link back to the hub instead of duplicating the full list — but the back-link itself must exist.

## Remotes & Backup

If this project mirrors to multiple hosts (canonical forge + redundant forge + private/LAN backup), document the fan-out here so push discipline and recovery procedures stay first-read.

| Remote | URL | Role |
|---|---|---|
| `<canonical>` | `<git@host:org/repo.git>` | Canonical hosting; PRs, CI, issues |
| `<redundant>` | `<git@other-host:org/repo.git>` | Redundant hosting |
| `<backup>` | `<ssh://user@host/~/repo.git>` | Private LAN / NAS backup |

The recommended pattern is a single `origin` configured with **multiple `pushurl` entries** so a single `git push` fans out to every destination. `git pull` / `git fetch` reads from one canonical URL. Keep the named remotes (`<canonical>`, `<redundant>`, `<backup>`) defined separately so you can target one specifically when needed.

Example fan-out config (in `.git/config`):

```ini
[remote "origin"]
    url = <git@canonical-host:org/repo.git>
    pushurl = <git@canonical-host:org/repo.git>
    pushurl = <git@redundant-host:org/repo.git>
    pushurl = <ssh://user@backup-host/~/repo.git>
    fetch = +refs/heads/*:refs/remotes/origin/*
```

If the project keeps host-specific notes (key rotation cadence, gitleaks hook, push-protection setting, fan-out verification), put them in a project-local `REMOTES.md` and link from here. See the framework-level [`REMOTES.md`](../REMOTES.md) for the canonical pattern this section is derived from.

### When to push

The fan-out is only a backup strategy for work that has been pushed.

- **After every commit on a meaningful checkpoint.** Pushing is cheap; redundancy is the point.
- **Before stepping away from the machine** for any non-trivial period.
- **Before history-rewriting or destructive operations** (rebase, force-push, branch delete) — push first so the unmodified state survives on at least one remote.
- **End of session, no exceptions.**

Not pushing leaves work on a single machine. The point of multiple remotes is recovery from any single point of failure.

### Recovery procedure

If the canonical host is unavailable or a working copy is lost:

1. Identify the most-recently-pushed remote — typically `<canonical>`, but fall back to `<redundant>` or `<backup>` if needed.
2. Clone from that remote: `git clone <url> <workspace_path>/<repo>`.
3. Re-establish the fan-out: re-add the missing `pushurl` entries (see example above) or run the project's mirror-setup script if one exists (e.g. `<workspace_path>/setup-mirrors.ps1`).
4. Verify with `git remote -v` (expect one `fetch` URL and N `push` URLs on `origin`) and a `git push origin --dry-run`.

### Approval Signals & Drift Rules

Some projects gate material work behind explicit human approval signals carried in conversation transcripts. The convention:

- **Approval-signal literal.** A short SCREAMING_SNAKE_CASE token the lead stakeholder writes verbatim to authorize a phase of work. Common shapes: `FUNDING_APPROVED` (the funded scope is locked in), `SCOPE_APPROVED` (a specific feature set is approved for this milestone), `DEPLOY_APPROVED` (production deploy is authorized for this release). Pick names that reflect the actual gate.
- **Drift-and-re-pitch rule.** When implementation diverges materially from the approved scope — target audience, value proposition, stack choice, burn envelope, or any other axis the original approval was conditioned on — pause and re-pitch in `docs/OPEN_DECISIONS.md` before continuing. Material drift requires a fresh approval signal; trivial additions inside the funded envelope do not.
- **Where the actual signals live.** This file states the convention; the project-specific signal list, drift triggers, and authority boundary live in the role contract under `docs/agents/<ROLE>.md` (e.g. `docs/agents/FOUNDER.md` for projects with a funder/scope-guardian role). Cross-reference both directions so the contract and the convention stay in sync.

Approval-signal matching rule: a signal matches when the token appears verbatim, compared case-insensitively, ignoring surrounding whitespace and punctuation ("FUNDING_APPROVED." and "funding_approved" both match). Nothing else matches — paraphrases, enthusiasm, or "sounds good, approved" do not open the gate. If the user appears to be approving but the token is absent, ask for the exact token; never infer it.

If the project does not use a stakeholder-approval gate, delete this subsection.

## IMPORTANT: Documentation Is Part of the Work

Keeping docs current is not optional. Every session that changes code must leave the docs accurate. Stale docs are worse than no docs because they actively mislead future agents.

Documentation is a completion gate, not a cleanup task. Before any final response or commit, audit documentation impact and either update the relevant docs or explicitly state why no docs were needed.

Do not mark work complete if the relevant docs have not been updated. Specifically:

- Update root `README.md` when the repository entrypoint, top-level purpose, or first-read directions change.
- Update `docs/TODO.md` as work progresses and before ending a session.
- Update `docs/CHANGELOG.md` before committing meaningful work.
- Update `docs/ARCHITECTURE.md` when file layout, runtime flow, or frontend/backend structure changes.
- Update `docs/DATA_MODEL.md` when persistence, schema, auth, or rewards change.
- Update `docs/API_REFERENCE.md` when endpoints, request shapes, or auth behavior change.
- Update `docs/ASSETS.md` when media assets are added, renamed, or referenced by code.
- Update `docs/DEPLOYMENT.md` when env vars, hosting, email setup, or the launch checklist changes.
- Update `docs/PROJECT_CONTEXT.md` when product direction, design language, or domain context changes.
- Update `docs/DECISIONS.md` when a durable technical or product decision is made.
- Update `docs/OPEN_DECISIONS.md` when a paired session surfaces a blocking decision that needs user input before work can continue. Remove entries once the answer has folded into `docs/DECISIONS.md` or the matching `docs/TODO.md` entry.
- Update `docs/AGENTS.md` when the host model, subagent roles, autonomy tags, or human-collab gate change.
- Update this file when any documentation responsibility changes.

Required end-of-task documentation audit (mandatory cleanup gate):

- Run or inspect `git diff -- docs` before calling the task complete.
- If code changed and no docs changed, verify that the change is truly internal-only and say so explicitly.
- For renames, endpoint changes, asset path changes, or product wording changes, search docs for stale old names/paths before finishing.
- **Delete completed entries from `docs/TODO.md`** once they are captured in `docs/CHANGELOG.md`. TODO is a queue, not a log; do not leave `[x] DONE` entries.
- **Mark completed `docs/ROADMAP.md` items with ✅** or move them under a `## Completed` section.
- **Reflect on the playbook**: if this session revealed a real workflow-impact change to AGENTS / HANDOFF / TODO conventions, add a proposal to `docs/PLAYBOOK_FEEDBACK.md`. Do not edit workflow docs directly without user review. Workflow-impact discipline is mandatory — see `docs/AGENTS.md` Playbook Improvement Loop section for the rule and what NOT to propose.
- Final responses should include a concise docs status, e.g. `Docs updated: docs/API_REFERENCE.md, docs/ASSETS.md` or `Docs unchanged: no behavior/API/file/path changes`.

## Start Here

1. Read `docs/README.md` for setup commands and folder structure.
2. Read `docs/TODO.md` for current context and active tasks.
3. Read `docs/AGENTS.md` for the AI agent playbook (host model, subagent roles, autonomy tags).
4. Read `docs/AUTONOMOUS_QUEUE.md` if running unsupervised — it lists pre-approved tasks.
5. Read `docs/CHANGELOG.md` for recent completed changes.
6. Read area-specific cold-path docs before editing related systems.

*Projects may reorder the first 2–3 entries when a different doc carries more upfront context (e.g. lead with `PROJECT_CONTEXT.md` for a project where domain understanding gates everything else). Keep the agent-playbook entry in the top half regardless.*

## Documentation Index

- `docs/README.md`: Quick overview and setup. (Hot path)
- Root `README.md`: Concise repository entrypoint. Keep it stable and point to `docs/` for full context.
- `docs/TODO.md`: Short-term active work and test checklist. (Hot path)
- `docs/AGENTS.md`: AI agent playbook — host model, named subagent roles, autonomy tags, human-collab gate, playbook improvement loop.
- `docs/AUTONOMOUS_QUEUE.md`: Priority-ordered list of pre-approved tasks for unsupervised AI runs. Optional — only present if the project has enabled autonomous workflows.
- `docs/PLAYBOOK_FEEDBACK.md`: Staging file for proposed improvements to the workflow docs. Inbox between "agent noticed something" and "canonical doc gets edited" — see `docs/AGENTS.md` for the lifecycle.
- `docs/IMPROVEMENT_LOOP.md`: (Cold path) The object-level recursive improvement loop (discover → execute → verify → evaluate → integrate → repeat). Optional — only present if the project runs an autonomous improvement loop. Pairs with VERIFICATION_GATE.
- `docs/VERIFICATION_GATE.md`: (Cold path) The machine-checkable ground-truth signal every loop iteration must pass (compile/test/repro). Optional — required by IMPROVEMENT_LOOP.
- `docs/PROJECT_CONTEXT.md`: Product and domain context.
- `docs/ARCHITECTURE.md`: Codebase and runtime architecture.
- `docs/DATA_MODEL.md`: Persistence and schemas.
- `docs/ASSETS.md`: Media asset paths and preparation notes.
- `docs/API_REFERENCE.md`: Endpoints and integrations.
- `docs/DEPLOYMENT.md`: Production setup and operations.
- `docs/CHANGELOG.md`: Completed notable changes.
- `docs/ROADMAP.md`: Long-term plans, milestones, and deferred ideas.
- `docs/DECISIONS.md`: Durable decision records.
- `docs/OPEN_DECISIONS.md`: Staging file for design/product decisions that block active work and need user input. Inbox between "decision arose in a session" and "decision recorded in `docs/DECISIONS.md` or folded into a `docs/TODO.md` entry." Optional — only present if the project hits blocking design questions worth tracking. When this file holds only the heading, the project is unblocked.
- `docs/CREDITS.md`: Third-party libraries, vendored code, assets, fonts, attributions.
- `LICENSE` (repo root): Project license. Default scaffold is All Rights Reserved.
- `NOTICE` (repo root): Third-party attribution summary; required by Apache-2.0, optional otherwise.
- `REMOTES.md` (repo root): Multi-host mirror config, push discipline, recovery procedure, and any project-local backup-hygiene checklist. (Cold path) Optional — only present if the project mirrors to more than one remote.

*Projects may add domain-specific cold-path docs (e.g. `PUZZLE_DESIGN.md`, `HARDWARE_SPECS.md`, `COMPLIANCE.md`, `BACKEND_GUIDE.md`) — index them above with a one-line description. Keep this list in sync with the actual files in `docs/`.*

**Avoid duplicate update-rule lists.** This file already has an "IMPORTANT: Documentation Is Part of the Work" list above. Do not also create a separate "Update Rules" section restating the same bullets — the two will drift. If projects need a quick-reference list, link back to the IMPORTANT section.

## Persistence Rules

If the project has persistent state, document the per-environment rules here so first-read agents internalize them before editing data flows. Skip this section for stateless projects.

- Where production state lives:
- Where local-dev state lives / how to reset:
- What must NEVER be exposed to clients (secrets, hashes, tokens, internal IDs):
- What must NEVER be committed to the repo (real secrets, live state files, large binaries):

## Current Local Dev

How to bring the project up locally for the first time. Generic stub:

- Start command (full paths if a particular shell can't find them):
- Local URL / port:
- Seeded credentials, demo account, sandbox token (if any):
- How to reset local state (delete which file, drop which database):

Skip this section for projects with no local-dev mode.

## Project Workflow

### Branching

- Start every new feature, bugfix, or working session on a fresh branch from the main branch unless explicitly directed otherwise.
- Use short descriptive branch names (e.g. `feature/<topic>`, `fix/<topic>`, `docs/<topic>`).
- Before starting unrelated work, merge or resolve the previous feature branch back into the main branch.
- If there are uncommitted changes on the main branch when starting new work, commit them, branch them, or ask the user how to proceed.
- **One PR = one feature = one branch off latest main.** When a PR merges, or work pivots to a meaningfully different feature, start a fresh branch off the *updated* main: `git fetch && git checkout -b <new-branch> <remote>/<main-branch>`. Never push follow-on commits to a merged or stale branch — those commits become orphans that never reach main. If you've already committed onto a stale branch, cherry-pick onto a fresh branch and open a new PR; do not try to salvage the stale one.

### Cross-repo git invocations

Use `git -C "<absolute path>" <command>` instead of `cd "<path>" && git <command>` when operating on a sibling repo. See `docs/AGENTS.md#shell-and-git-invocation` — `cd && git` triggers a per-call permission prompt, `git -C` does not.

### What stays uncommitted

- Real secrets, `.env` files, signing keys.
- Local-dev state files (e.g. JSON-backed dev databases).
- Build outputs and caches not meant to be vendored.
- `package-lock.json` — this project uses pnpm; lockfile is `pnpm-lock.yaml`.

### Pre-commit checks

```bash
# syntax / type check
# unit tests
# linter (if applicable)
```

### Commit style

State the project's commit-message convention here (Conventional Commits, prefix-tag, free-form, etc.).

### Test commands

```bash
# unit tests
```

### Build commands

```bash
# pnpm install  # first run
# build
```

### Deployment commands

See `docs/DEPLOYMENT.md` for the full procedure. Day-to-day shortcuts:

```bash
# deploy
```

## AI Agent Playbook

The full host-model policy, escalation rules, named subagent roles (with input/output contracts and per-role model tiers), autonomy tag scheme, and human-collaboration gate live in `docs/AGENTS.md`. Read that file before spawning subagents or picking up tagged work.

Quick rules that must hold regardless of project specifics:

- The host reconciles all subagent output; subagents do not own commits, merges, or doc-completion-gate sign-off.
- Tasks tagged `[autonomy: needs-human-collab]` must NOT start without explicit user approval.
- Spawn edit-capable subagents in worktrees during autonomous runs so parallel work cannot conflict.

## Safety Rules

- Do not commit secrets.
- Do not overwrite user work.
- Do not expose private data in logs or frontend responses.
- Confirm destructive operations with the user.
- **Package manager: pnpm.** Run `pnpm install` / `pnpm add` — never `npm install`. Never commit `package-lock.json` (the lockfile is `pnpm-lock.yaml`). The repo `.npmrc` sets `ignore-scripts=true`; pass `--ignore-scripts=false` only when a legitimate postinstall is required.

## Testing Expectations

- Every project should have unit tests.
- Run unit tests before committing meaningful code changes.
- Add or update tests when behavior changes.
- Prefer testing pure helpers for important logic instead of relying only on manual smoke tests.

## Completion Gate

A code task is not complete until all applicable docs are audited and updated. Use this mapping as the default trigger list:

- API route, auth, request, or response change -> `docs/API_REFERENCE.md`.
- Schema, persistence, state, entitlement, or data ownership change -> `docs/DATA_MODEL.md`.
- Runtime flow, folder structure, frontend/backend structure, or deployment topology change -> `docs/ARCHITECTURE.md` and usually `docs/README.md`.
- Repository entrypoint, top-level purpose, or first-read directions change -> root `README.md`.
- Asset/media addition, rename, optimization, or referenced path change -> `docs/ASSETS.md`.
- Launch requirement, environment variable, hosting, storage, or deployment checklist change -> `docs/DEPLOYMENT.md`.
- Product behavior, user flow, domain context, or design direction change -> `docs/PROJECT_CONTEXT.md`.
- Durable technical/product decision -> `docs/DECISIONS.md`.
- Blocking design/product decision surfaced (paired session, autonomous-run fork) -> `docs/OPEN_DECISIONS.md`.
- New dependency, vendored snippet, licensed asset, or font added/removed -> `docs/CREDITS.md`.
- License chosen / changed, copyright holder updated -> `LICENSE` (repo root).
- Notice-level dependency added/removed, Apache-2.0 component bundled -> `NOTICE` (repo root).
- AI host model, escalation rules, subagent roles, or autonomy tag scheme change -> `docs/AGENTS.md`.
- Any meaningful completed work -> `docs/CHANGELOG.md`.
- Any active/follow-up work or smoke-test need -> `docs/TODO.md`.
- Any completed TODO entry -> deleted from `docs/TODO.md` once captured in `docs/CHANGELOG.md`.
- Any completed roadmap item -> ✅ in `docs/ROADMAP.md` or moved under a `## Completed` section.

## End-of-Session Housekeeping

Before declaring a session complete, run through this short list:

1. **Delete shipped entries from `docs/TODO.md`** once captured in `docs/CHANGELOG.md`. No `[x] DONE` carryover.
2. **Mark completed `docs/ROADMAP.md` items with ✅** or move under `## Completed`.
3. **Update `docs/CHANGELOG.md`** with a dated one-line entry per meaningful change.
4. **Trim `docs/AUTONOMOUS_QUEUE.md`** if a queued item shipped (delete from queue; out-of-queue holdouts stay until reviewed).
5. **Trim `docs/OPEN_DECISIONS.md`** if any entries were answered this session and the answers have been folded into `docs/DECISIONS.md` or the matching `docs/TODO.md` entry. The file is a staging inbox, not a log.
6. **Reflect on the playbook**: add a proposal to `docs/PLAYBOOK_FEEDBACK.md` only if a real workflow-impact change surfaced — see `docs/AGENTS.md` Playbook Improvement Loop. Do NOT edit AGENTS / HANDOFF directly.
7. If a cross-repo dependency or sibling-repo arrangement changed, update the "Related Repos" section above and the matching section in each sibling's `HANDOFF.md` so the reference graph stays consistent (cross-link invariant).
8. If the remote fan-out, mirror-host list, or backup procedure changed, update the "Remotes & Backup" section above and any project-local `REMOTES.md`.
