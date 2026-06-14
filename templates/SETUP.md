<!--
  TEMPLATE: SETUP.md (one-time first-run discussion checklist)

  WHEN TO USE:
    - At first-run when the framework is being initialized in a new repo. The
      agent walks through these questions with the user; the answers are
      recorded into `docs/HANDOFF.md` ("Project-Specific Landing Zone") or
      `docs/AGENTS.md` ("Local Overrides"). Each question below names where
      its answer goes.
    - This file is a *discussion* surface, not a runtime doc. Once the
      answers have landed in HANDOFF/AGENTS, delete `docs/SETUP.md` from the
      project. The framework's own copy stays in `templates/` as the
      canonical seed.

  HOW TO USE:
    1. Copy this file into the new project's `docs/` folder alongside the
       rest of the templates.
    2. The agent prompts the user through each section in order. Defaults are
       suggestions, not decisions — the user states their preference and the
       agent records it in the named destination doc.
    3. Once every section's answer has landed in HANDOFF / AGENTS / etc.,
       delete this file from the project. Do not keep stale answers here.

  WHY THIS ISN'T A TEMPLATE DEFAULT:
    These questions encode per-project preferences (autonomy posture,
    approval-signal literals, deploy gating thresholds, stakeholder identity,
    sibling-repo wiring). Baking any one project's answers into the framework
    would mis-seed the next. The discussion is the point — the *answers* are
    project-local and live in the project's own docs.
-->

# Project Setup — First-Run Discussion Checklist

Walk through this once when initializing the framework in a new repo. Each section is a question (with options and a default) plus a "Recorded in:" pointer naming the doc that owns the answer afterward. Delete this file once every answer has landed.

## 1. Autonomy level

What posture does the autonomous host run with on this project?

- **High** — autonomous merges on `[autonomy: safe]` items, opens DRAFT PRs for `[autonomy: review]` items, blocks on `[autonomy: needs-human-collab]`. Best for solo / trusted-author projects with a strong test suite.
- **Medium** — every merge gets a PR review, regardless of autonomy tag. Autonomous host implements but never auto-merges. Best for shared repos or anywhere a second pair of eyes is cheap insurance.
- **Low** — human approves each step. Autonomous mode is effectively disabled; supervised sessions only. Best when the project is in early shape-finding or when the codebase changes faster than the test suite covers it.

Cross-reference: see "Autonomy Markers" in `docs/AGENTS.md` for the per-task tags. The level chosen here governs the *default posture*; per-task tags still apply.

**Recorded in:** `docs/AGENTS.md` "Local Overrides" (state which level applies and why).

## 2. Approval signal literals

Which exact phrases gate work on this project?

Default: at least one funding/scope signal so material drift requires a re-pitch. Common choices:

- `<PROJECT>_APPROVED` — funding/scope signal for the pitch in `docs/PROJECT_CONTEXT.md`. Gate for any work that would expand scope beyond the funded shape.
- `RELEASE_APPROVED` — gate for cutting a public release / version bump.
- `DEPLOY_APPROVED` — gate for promoting a build to a public-facing surface (see also: Pre-Deploy Gate in `docs/DEPLOYMENT.md`).
- `ACTIVE_PROBE_APPROVED` — gate for security-reviewer active probing of a deployed surface (see `docs/agents/SECURITY_REVIEWER.md`).

Pick literals that are unambiguous (the agent matches on exact strings). Project may add additional signals (e.g. `MIGRATION_APPROVED` for risky schema work).

**Recorded in:** `docs/HANDOFF.md` "Approval Signals" section.

## 3. Default model tier

Which tier drives routine implementation work on this project?

- **Workhorse (Sonnet 4.6 / equivalent)** — typical default for most projects. Cost-efficient over long sessions, sufficient for most feature work, refactors, and doc updates.
- **Frontier (Opus 4.7 / equivalent)** — preferred default for ARG-style projects, security-heavy domains, novel-research builds, or anywhere Workhorse-tier slips have historically been expensive to recover from.

Subagent tiers (Recon for lookup, Frontier for `planner` / `architect` / `security-reviewer` / `debugger`) follow the standard playbook regardless of host default.

**Recorded in:** `docs/AGENTS.md` "Local Overrides" (only if differing from the framework default of Workhorse).

## 4. Test gating

Which test pass(es) gate which milestones on this project?

- **Commit gate** — what must pass before each commit? (Default: unit tests + typecheck.)
- **Merge gate** — what must pass before merging into the default branch? (Default: full test suite + lint + typecheck.)
- **Deploy gate** — what must pass before promoting to a public surface? (Default: full test suite + smoke test against the build artifact + Pre-Deploy Gate; see §5.)

Skip a tier if the project doesn't have it (e.g. single-author repos may collapse commit and merge into one).

**Recorded in:** `docs/HANDOFF.md` "Project-Specific Landing Zone" or `docs/DEPLOYMENT.md` (deploy gate specifically).

## 5. Deploy gating

Who has deploy authority on this project, and what must hold before a deploy?

- **Deploy authority** — which human(s) can authorize a public-facing deploy? Name them. The autonomous host never deploys without an explicit signal from this person.
- **Required signals** — typically `DEPLOY_APPROVED` plus any project-specific gate (e.g. `MIGRATION_APPROVED` if the deploy includes a schema change).
- **Security-audit recency** — default: a current `docs/SECURITY_AUDIT_<DATE>.md` must exist, **either ≤90 days old OR covering all changes since the last audit, whichever is stricter**. See `docs/DEPLOYMENT.md` "Pre-Deploy Gate" for the hard-requirement spec.

**Recorded in:** `docs/DEPLOYMENT.md` (Pre-Deploy Gate is already templated; project fills in authority and signals).

## 6. Content-safety rules

Project-specific hard rules that the agent must never violate. Examples by domain:

- ARG / fiction project: no living-person gotchas, no medical claims, no tragedy material.
- Trivia / quiz project: real options must link to a real source; fakes must be invented; no defamatory content.
- Compliance-bearing project: PII handling rules, HIPAA / GDPR boundaries, data-retention limits.
- Internal tooling: secrets-in-logs prohibition, customer-data redaction rules.

Default: at minimum, no secrets in commits, no PII in docs, no real user data in fixtures.

**Recorded in:** `docs/agents/<ROLE>.md` "Content-Safety Rules" section per affected role, plus a one-line rule in `CLAUDE.md` "Hard Rules" if it's universally load-bearing.

## 7. Stakeholder identity

Who's the lead stakeholder on this project, and which entity owns revenue / contracts / legal?

- **Lead stakeholder** — name (or role title) of the person who funds scope, accept-risks security findings, and signs off on `[needs-human-collab]` items.
- **Revenue / contract entity** — the legal entity that owns commercial output. Affects copyright lines, license decisions, NOTICE wording.

If the project has a `docs/agents/STAKEHOLDER.md` role file, this is where its identity lives.

**Recorded in:** `docs/agents/STAKEHOLDER.md` (or equivalent role contract) and `LICENSE` / `NOTICE` copyright lines.

## 8. Sibling repos

Which other repos must stay in sync with this one via the cross-link invariant?

List repo paths plus the kind of sync expected (palette swap, shared template promotion, doc back-link, etc.). The `cross-repo-sync` subagent uses this list when making coordinated edits.

**Recorded in:** `docs/HANDOFF.md` "Related Repos" section.

## 9. Mirror / backup setup

Does this project fan out pushes to multiple hosts? Where do backups live?

- **Multi-host fan-out** — e.g. GitHub + GitLab + a NAS bare repo, configured via `origin` pushurls. See the framework's own `REMOTES.md` for the pattern.
- **Backup cadence** — full repo mirror frequency, snapshot location, retention.
- **Recovery procedure** — what does "restore from backup" look like in practice? Document it before you need it.

**Recorded in:** `docs/HANDOFF.md` "Remotes & Backup" section.

## 10. Worktree convention

How does this project organize worktrees for parallel/edit-capable subagent work?

- **Default** — `.claude/worktrees/<task-name>/` adjacent to the repo, gitignored. Edit-capable subagents in autonomous runs use these so parallel work cannot conflict.
- **Custom location** — some projects keep worktrees under `<sibling-path>/worktrees/` to avoid cluttering the main repo. State the path.
- **No worktrees** — small / single-author / supervised-only projects may skip the worktree convention entirely. State that explicitly so the host doesn't try to use one.

**Recorded in:** `docs/HANDOFF.md` "Project-Specific Landing Zone" or `docs/AGENTS.md` "Local Overrides".

## 11. Permissions posture

How permissive should Claude Code's auto-approval be on this project?

- **Default (recommended starting point):** project-level `.claude/settings.json` is empty; the project inherits whatever the operator has at user-level (`~/.claude/settings.json`). Pick this if the operator's posture is appropriate for the project's threat model.
- **Tighter (project overrides user):** add an `ask`/`deny` block at project scope to force prompts on commands the user-level config would auto-approve. Use this when a project handles secrets, regulated data, or shared CI.
- **Looser:** generally not recommended — projects shouldn't expand trust beyond user defaults. If absolutely necessary, document why in `docs/DECISIONS.md`.

The `templates/.claude/settings.json` template ships with the empty default plus an opt-in permissive preset under `_alternatives` for reference. Do NOT paste the preset blindly.

**Recorded in:** `docs/AGENTS.md` Local Overrides section.

---

Once every section above has a recorded answer, **delete `docs/SETUP.md` from this project**. The framework's `templates/SETUP.md` stays in place as the seed for the next project.
