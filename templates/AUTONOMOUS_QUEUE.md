# Autonomous Queue

Priority-ordered list of tasks pre-approved for unsupervised AI work. The autonomous host pulls from the top. Anything not in this queue requires user input even if tagged `[autonomy: safe]` in `docs/TODO.md`.

This file is curated, not auto-generated. Add an entry when a TODO item is genuinely safe to land without user review beyond the standard PR. Remove an entry when it ships (and capture it in `docs/CHANGELOG.md`).

## Autonomy Tag Legend (inlined for self-containment)

This queue is intentionally self-contained: the same tag scheme is also documented in `docs/AGENTS.md`, but inlining it here means a fresh reader (human or agent) can act on the queue without hopping files. If the two ever drift, AGENTS.md wins — re-sync this section.

- `[size: XS|S|M|L|XL]` — XS = under ~15 min. S = under an hour. M = a focused session. L = multi-session / design-required. XL = epic.
- `[tier: haiku|sonnet|opus]` — model tier that should drive implementation. (Or model-agnostic `recon|workhorse|frontier`.)
- `[risk: low|med|high]` — blast radius if the change goes wrong.
- `[scope: isolated|cross-cutting|infra]` — single subsystem / multi-subsystem / build+deploy+secrets.
- `[autonomy: safe|review|needs-human-collab]` — `safe` = autonomous host may pick up and open a normal PR. `review` = host may implement but MUST open a DRAFT PR for human merge. `needs-human-collab` = host must NOT start; requires explicit user approval and a paired session.

Default for unmarked entries: `[size: S][tier: sonnet][risk: low][scope: isolated][autonomy: safe]`. Only call out tags that differ.

## Tier Selection Hints

Each queue entry carries a **Suggested agent tier** field that tells the autonomous host (or the user reading the queue) how to dispatch the work. Controlled vocabulary:

- `Haiku` — recon, simple file lookups, status reads, mechanical find-replace, single-line tweaks, doc-consistency sweeps.
- `Sonnet` — most implementation work: feature additions, refactors within a single subsystem, test writing, doc updates, CHANGELOG/DECISIONS entries.
- `Opus` — ambiguous design decisions, security-critical work, architectural choices, cross-repo refactors, non-obvious debugging, anything destined for `docs/DECISIONS.md`.
- `subagent: <role>` — specifically dispatched to a named subagent rather than running on the host. Standard roles: `recon`, `planner`, `architect`, `debugger`, `doc-audit`, `test-strategist`, `security-reviewer`, `cross-repo-sync`, `backend-impact`, `frontend-impact`, `queue-curator`. See `docs/AGENTS.md` for each role's contract.

**Mapping table — task type → suggested tier:**

| Task type | Suggested tier |
|---|---|
| File / symbol lookup, "where is X used" | `subagent: recon` (Haiku) |
| Doc-consistency audit after rename | `subagent: doc-audit` (Haiku) |
| Single-line tweak, default value bump, copy edit | `Haiku` |
| Single-tool feature, test additions, doc update | `Sonnet` |
| Refactor within one subsystem | `Sonnet` |
| Cross-repo edit (palette swap, link insertion) | `subagent: cross-repo-sync` (Sonnet, worktree) |
| Pre-implementation plan for `[size: M\|L]` work | `subagent: planner` (Opus) |
| Architecture decision for `docs/DECISIONS.md` | `subagent: architect` (Opus) |
| Auth / token / rate-limit / access-control review | `subagent: security-reviewer` (Opus) |
| Non-obvious failure investigation | `subagent: debugger` (Opus) |
| Ambiguous design choice, paired-design candidate | `Opus` (or escalate to direct Frontier session) |

When in doubt, prefer a subagent (context isolation + structured output) over running on the host directly.

## Queue Format

Each entry is a one-line pointer into `docs/TODO.md` (or `docs/ROADMAP.md`) plus its tags, suggested tier, and a short note on why it is safe.

```
- [ ] <short title> — <where in TODO/ROADMAP> — [tags] — tier: <Suggested agent tier> — note
```

**Example shape** (placeholders, not real entries):

```
- [ ] Add <feature flag> for <scope> — `docs/TODO.md` §<section> — `[size: S][tier: sonnet][risk: low][scope: isolated][autonomy: safe]` — tier: Sonnet — UI-only, behind a default-off flag; no schema or migration impact.
- [ ] Audit stale references after <rename> — `docs/TODO.md` §Hygiene — `[size: XS][risk: low][scope: cross-cutting]` — tier: subagent: doc-audit — read-only sweep across `docs/` and any code with hard-coded paths.
- [ ] Plan <medium feature> before implementation — `docs/ROADMAP.md` §<milestone> — `[size: M][risk: med][scope: isolated][autonomy: review]` — tier: subagent: planner — Frontier-tier plan first; implementation tier drops to Sonnet once the plan lands.
- [ ] Review <auth-adjacent change> before merge — `docs/TODO.md` §<section> — `[size: S][risk: high][scope: isolated][autonomy: review]` — tier: subagent: security-reviewer — DRAFT PR; security-reviewer must sign off before human merge.
```

## Active Queue

Order = priority. Top of list runs first. Each entry points at a `docs/TODO.md` bullet that carries its own tag block; the line below is a human-readable summary so the queue reads at a glance.

<!-- Populate this section by hand. Empty queue = autonomous host has nothing to pick up; surface to the user and wait. -->

- [ ] (none yet — populate when ready to enable autonomous runs)

When the host finishes one of these, it should remove the entry from this list, update `docs/TODO.md` (delete the shipped entry per the cleanup gate), add a `docs/CHANGELOG.md` line, and open a PR. Do not pull the next item until review of the previous PR is complete unless the user explicitly opts into batch mode.

## Recurring: Product-Outcome Retro

A standing, opt-in entry that closes the loop on the *product itself* — not just the workflow docs. Most of this queue tracks work to ship; this entry checks whether shipped work moved the numbers the pitch promised.

On a set cadence (`<weekly | monthly | per-milestone>`), the host runs a retro pass:

1. **Pull the targets.** Read the success metrics and kill criteria from the funded spec (`docs/PROJECT_CONTEXT.md` / the pitch). These were defined at funding time and are rarely revisited.
2. **Compare to reality.** Check them against what actually shipped and what the product is actually doing — usage, revenue, support load, whatever the pitch named as the winning metric.
3. **Route the verdict:**
   - **On track** — note it; no action.
   - **Underperforming but fixable** — file the specific fix as a `docs/TODO.md` entry.
   - **A kill criterion is met** — stop adding scope and surface a `STAKEHOLDER` re-pitch/kill decision in `docs/OPEN_DECISIONS.md`. Do not autonomously keep building a product the evidence says should wind down.

This pass is `[autonomy: review]` at most: it produces a verdict and queued items, never a silent pivot or a kill. The kill/continue call is the stakeholder's. Pairs with the Low-Effort Stakeholder mode's walk-away test in `docs/agents/STAKEHOLDER.md`.

Example entry:

- [ ] Product-outcome retro (`<month>`) — `docs/PROJECT_CONTEXT.md` §Success Metrics — `[size: S][tier: opus][risk: low][scope: isolated][autonomy: review]` — tier: Opus — check shipped work vs. success metrics + kill criteria; route to TODO / OPEN_DECISIONS.

## Out-of-Queue (Explicit Holdouts)

Items that look picky-uppable but are deliberately NOT in the queue right now. Each entry MUST note the rationale so a future session does not silently promote them. Even items tagged `[autonomy: safe]` belong here when there is a project-specific reason to gate them behind a human.

**Format:**

```
- **<short title>** — `<doc reference>` — `[tags]` — <why held out>
```

**Common holdout categories** (drawn from real-project shape):

- **Strategy / tuning parameters** — anywhere choice-of-parameter carries edge or expresses product judgment (gap thresholds, MA windows, ranking weights, rate-limit numbers). Operator should weigh in before the values bake into shipped behavior.
- **Live-trading / production toggles** — any `LIVE=1` / `PROD=1` / "talk to real money or real users" code path. Production gate; never autonomously promoted regardless of tag.
- **Security-sensitive defaults** — default password policy, default token lifetimes, default CORS origins, default rate limits, default auth scopes. Looks safe-to-tweak; isn't.
- **Universe / seed data choices** — picking which N items populate a curated list (sectors, presets, demo content). Judgment work the operator owns.
- **Architectural reversals** — anything that revises a prior `docs/DECISIONS.md` entry. Needs paired session.
- **Large-bundle vendor integrations** — bundle weight, license check, identity question (e.g. swapping a major dependency, adding a renderer).
- **Production deployment work** — DNS, hosting, secrets, schema migrations against live data, password-hash reseeding. Requires real credentials and human gates.
- **Investigations / research** — output is a write-up, not code; needs operator judgment on the "fits / not a fit" verdict before downstream work proceeds.
- **Operator-side actions** — anything the bot literally cannot do (account setup, real API key creation, smoke-testing against a live broker / vendor).
- **Deploy-affecting changes when the security-audit gate would fail** — any task whose merge would put new code on a public surface without a current `SECURITY_AUDIT_*.md` (≤90 days old OR covering all changes since the last audit, whichever is stricter) is held out of autonomy. Either run `security-reviewer` first and let the audit land, or wait for a human to schedule an audit pass. See `docs/DEPLOYMENT.md` Pre-Deploy Gate for the gate condition.

**Example entries** (shape only — replace with real holdouts):

- **<Strategy parameter set>** — `docs/TODO.md` §<section> — `[autonomy: needs-human-collab]` — parameter values carry edge; operator weighs in before backtest results.
- **<Live integration toggle>** — codebase-wide — production gate; never autonomously promoted.
- **<Default security setting>** — `docs/TODO.md` §<section> — `[autonomy: needs-human-collab]` — looks like a config tweak, but defaults ship to all users.
