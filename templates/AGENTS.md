# Agents

Playbook for AI coding agents working in this repository. Defines the host model, when to escalate, the standard named subagent set, autonomy tags, and the human-collaboration gate for risky work.

This file is read at the start of any non-trivial session. Keep it short, prescriptive, and honest about cost and risk. Update it when the model lineup, escalation rules, autonomy queue, or the standard subagent set changes.

This file is the framework starter. Project copies should add a one-line note near the top pointing back at the framework's canonical template (wherever you keep it) so that promotions land back in the framework via `docs/PLAYBOOK_FEEDBACK.md` rather than diverging silently.

## Host Model And Escalation

Default host: **Sonnet 4.6**.

Run the host as Sonnet by default. Escalate to **Opus 4.7** for the categories listed below. Use **Haiku 4.5** aggressively as a subagent for cheap, well-bounded read-only and small-edit work.

The reason for Sonnet-by-default is cost over time: Opus is roughly 5x the per-token cost of Sonnet, and most work in this repo is doc-driven and well-specified — the marginal Opus advantage rarely pays for itself. Cache hygiene and parallelism matter more than raw capability for long autonomous runs.

### Escalate to Opus 4.7 for

- Ambiguous architecture decisions that will land in `docs/DECISIONS.md`.
- Cross-repo refactors that touch multiple subproducts at once.
- Security-sensitive code: auth, JWT, rate limiting, input validation, password handling.
- Non-obvious debugging where the failure mode is not yet understood.
- Work tagged `[needs-human-collab]` (after explicit user approval — see below).
- Pre-implementation planning passes (run a short Opus Plan, then drop to Sonnet for the body of the work).

When "ambiguous" is itself ambiguous, use the countable triggers — any one is sufficient to escalate:

- The task touches 3+ repos or 6+ files.
- The change alters an interface, schema, or contract that another repo or component imports.
- You have rewritten your own plan twice and it still doesn't survive contact with the code.
- Two distinct root-cause hypotheses, each backed by cited evidence, have both been falsified.
- The decision will be recorded in `docs/DECISIONS.md`.

### Use Haiku 4.5 for

- Codebase reconnaissance ("where is symbol X used", "list all references to Y").
- Doc-consistency audits (find stale paths, names, endpoints after a rename).
- Test-output summarization.
- Content-spill / accessibility / link-checker scans.
- Mechanical CSS/palette find-replace.
- Single-line tweaks (default values, size bumps, copy edits).
- File-existence and directory-shape checks.

### Default to Sonnet 4.6 for

Everything else. Most feature work, most refactors, most test writing, most documentation updates, most CHANGELOG/DECISIONS entries.

## Cross-Ecosystem Tier Framework

The Sonnet/Opus/Haiku names above are Claude-specific. The same three-tier structure applies to other providers and to local models.

### Three tiers (model-agnostic)

- **Frontier tier** — maximum reasoning, designed for ambiguity and complex synthesis. Slowest and most expensive. Use for: ambiguous architecture, cross-repo refactors, security review, non-obvious debugging, paired-design work tagged `[autonomy: needs-human-collab]`. Claude equivalent: Opus 4.7.
- **Workhorse tier** — strong general capability, balanced speed and cost. The default host. Use for: most feature work, test writing, doc updates, single-tool features, CHANGELOG/DECISIONS entries. Claude equivalent: Sonnet 4.6.
- **Recon tier** — fast and cheap, well-bounded tasks. Use for: file/symbol search, doc-consistency audits, mechanical find-replace, test-output summarization, single-line tweaks. Claude equivalent: Haiku 4.5.

### Weak-model floor (hard rule)

Some tasks are never run below Frontier tier unsupervised, regardless of how well-specified they look. A Workhorse- or Recon-tier agent that encounters one of these mid-task stops and surfaces it rather than attempting it:

- Scoring or ranking decisions that feed a funding/approval gate (scorecard application, comparative ranking, judge passes).
- Adversarial review (red-team, security review) — weaker models soft-pedal adversarial roles.
- Materiality calls (is this drift? is this friction real?) that gate a re-pitch or a playbook change.
- Edits to the funding gate, approval signals, or `docs/AUTONOMOUS_QUEUE.md` membership.

Recon-tier agents additionally never self-assess "this is within my envelope" for work outside the Recon task list — when in doubt at Recon tier, the answer is hand back, not attempt.

### Experimental scope and the two-failure rule

When you introduce a new `(model, task-type)` pair — e.g. trialing a Recon-tier model on simple-single-test additions, or running a Workhorse-tier model on an architectural decision normally reserved for Frontier — mark the pair **experimental** rather than silently widening validated scope. Track every experimental run in `docs/AGENT_TRACKER.md` (see the framework template) regardless of outcome.

- **Two failures contracts the scope.** Two failures on a `(model, task-type)` pair drops that combination back to its prior validated tier. Record the contraction with a one-line entry in `docs/PLAYBOOK_FEEDBACK.md` "Applied (recent)".
- **Three clean runs graduates.** Three successful runs on a `(model, task-type)` pair promotes it from experimental to validated scope; update the tier table or role contract accordingly.
- Vibes-based escalation is out — the rule is empirical. Cross-reference `AGENT_TRACKER.md` for the full schema and the running record.

### Mapping examples (early 2026)

| Tier | Anthropic | OpenAI | Google | Local |
|---|---|---|---|---|
| Frontier | Opus 4.7 | GPT-5 / o4 / o3-pro | Gemini 3 Pro | Llama 3.3 405B, Qwen 3 235B, DeepSeek-R1 |
| Workhorse | Sonnet 4.6 | GPT-5 mini, GPT-4.1 | Gemini 2.5 Flash | Llama 3.3 70B, Qwen 2.5 72B, DeepSeek-V3 |
| Recon | Haiku 4.5 | GPT-5 nano, GPT-4.1 mini | Gemini 2.5 Flash Lite | Llama 3.1 8B, Qwen 2.5 7B, Phi 4 |

Lineups change quarterly; treat the table as illustrative, not authoritative.

### Picking a tier for an unknown model

In order of reliability:

1. **Provider positioning** — top of lineup (frontier), mid-tier balanced (workhorse), smallest/cheapest (recon).
2. **Cost per token** — early-2026 thresholds: above ~$5/M output → frontier; ~$0.5–5/M → workhorse; below ~$0.5/M → recon.
3. **Parameter count for local models** — above ~100B → frontier-adjacent; 30–100B → workhorse; below 30B → recon. Reasoning fine-tunes punch a tier above their base counterparts.
4. **Reasoning vs. base mode** — extended-reasoning mode is effectively tier-up from base.

### Runtime patterns

- **Multi-model routing** (Cursor, Continue.dev, custom orchestrators with per-subagent model selection): apply tier-by-role. Workhorse for the host and `cross-repo-sync` / `*-impact`; Recon for `recon` / `doc-audit`; Frontier for explicit Plan-pass calls or `[autonomy: needs-human-collab]` items.
- **Single-model runtime** (one provider key, one local endpoint): stick with Workhorse-tier as the host. Subagent specialization becomes conceptual rather than enforced — you still spawn subagents for context isolation and parallelism, but they all run on the same model.

### Local-model caveats

- Tool-calling reliability varies — test JSON tool-call output before relying on subagent orchestration.
- Smaller context windows — prefer focused subagent prompts; offload via file reads.
- Streaming behavior varies — limits long-running supervised mode UX.
- Latency math changes — a local Workhorse on consumer GPU may be slower than a cloud Recon. If every spawn costs 30 seconds of warmup, coordinator-heavy is the wrong default for that runtime; flip to Supervised-Direct as the local default.

## Host Posture: Coordinator-Heavy by Default

**The host's default posture is coordinator-heavy in every mode.** The host orchestrates; named subagents do the work; the host reconciles results, writes commits, reports back. This applies in autonomous queue runs AND in interactive/supervised sessions.

### What the host does directly (always)

- Conversational replies (questions, tradeoffs, design discussion, status).
- Reading docs the host must update (CHANGELOG, TODO, AUTONOMOUS_QUEUE, DECISIONS).
- Reconciling subagent output.
- Writing the final commit / branch / merge / PR. Subagents do not own git.
- Single trivial edits the user pointed at directly ("fix this typo", "rename this variable").

### What the host delegates by default

Everything else: file/symbol search → Recon `recon`; doc-consistency sweeps → Recon `doc-audit`; backend impact → Workhorse `backend-impact`; frontend impact → Workhorse `frontend-impact`; test plans → Workhorse `test-strategist`; multi-file/multi-repo edits → Workhorse `cross-repo-sync` in worktrees; long-output runs (tests, lints) → subagent absorbs noise, returns verdict.

### Why coordinator-heavy as the universal default

Context budget hygiene, parallelism via concurrent subagents, worktree-safe fan-out for edits, consistency across modes, auditable orchestration log.

### Cost of coordinator-heavy (be honest)

Slower interactive turns, less interruptible, spawn overhead can exceed task size for tiny edits. The user accepts these costs in exchange for context hygiene and consistency.

### Supervised-Direct mode (opt-in override)

The user can override the default for a task or session. Signals: "just do it directly", "no subagents", "be quick I'm watching", "edit it yourself". In Supervised-Direct mode, the host works directly with Edit/Read/Grep/Bash. Subagents still fire for genuinely-parallel cross-repo work, workspace-wide searches, or long-output runs (those are coordinator wins regardless of supervision).

To return: "back to coordinator mode", "use subagents from here", or starting a new task. State the mode change out loud when it happens.

## Named Subagent Roles

When spawning a subagent, pick a named role from the standard set below and follow its prompt template. Each role has a fixed tier, a read-only-or-edit posture, and a required output shape.

### Standard subagent set

This is the canonical list the framework ships with. Project-local roles go under `docs/agents/<ROLE>.md` (see "Project-Local Roles" below). The set continues to evolve — projects may add more, and patterns that prove general should be promoted back via `docs/PLAYBOOK_FEEDBACK.md`.

| Role | Tier | Posture | One-line description |
|---|---|---|---|
| `recon` | Recon | read-only | Fast read-only search, file lookups, status reads. |
| `planner` | Frontier | read-only | High-level approach planning, multi-step task decomposition. |
| `architect` | Frontier | read-only | Design decisions, trade-off analysis, structural choices. |
| `debugger` | Frontier | read-only | Root-cause hunts on failing tests and mysterious behaviour. |
| `doc-audit` | Recon | read-only | Documentation review for stale, inconsistent, or missing content. |
| `test-strategist` | Workhorse | read-only | Test plan design, gap analysis, coverage strategy. |
| `security-reviewer` | Frontier | read-only | Security audit passes, threat modelling. **Required** before any deploy to a public surface — see `templates/DEPLOYMENT.md` Pre-Deploy Gate. **Recommended** before major architecture decisions and changes to auth/data/deploy/integrations. |
| `cross-repo-sync` | Workhorse | edit-capable | Multi-repo coordination, sibling-doc sync. |
| `backend-impact` | Workhorse | read-only | Backend change-impact analysis. |
| `frontend-impact` | Workhorse | read-only | Frontend change-impact analysis. |
| `queue-curator` | Frontier | read-only | Autonomous queue maintenance, refill, prioritization. |

The detailed contracts for each role follow.

### `recon` (Recon, read-only)

Locate code: file patterns, symbol references, "where is X defined / which files reference Y". Use this before editing.

Output: bulleted list of `path:line` references plus a one-paragraph summary of what was found.

### `backend-impact` (Sonnet, read-only)

Read backend code paths affected by a planned change. Identify route handlers, schema dependencies, mutex/lock points, rate-limit interactions, test coverage.

Output: affected files, risks, suggested edit order, tests that must be updated.

### `frontend-impact` (Sonnet, read-only)

Same as `backend-impact` for the frontend layer. Identify pages/components affected, state interactions, asset references, accessibility considerations.

Output: same shape as `backend-impact`.

### `doc-audit` (Haiku, read-only)

After a rename or behavior change, sweep the docs for stale references. Searches for old name/path/endpoint strings across `docs/` and any code that documents itself.

Output: list of stale references with line numbers, grouped by file.

### `test-strategist` (Sonnet, read-only)

Given a change, propose the test plan: which existing tests must change, which new tests are needed, which manual smoke checks are still required.

Output: existing-test diffs needed, new-test list with file paths, manual smoke checklist.

### `cross-repo-sync` (Sonnet, edit-capable)

Apply a change consistently across sibling repos (palette swap, tool-link add, back-link insert). Always edit-capable; always uses worktree isolation.

Output: list of edits per repo, plus a verification command per repo.

### `queue-curator` (Frontier, read-only, optionally background)

Audit `docs/AUTONOMOUS_QUEUE.md`, `docs/TODO.md`, `docs/ROADMAP.md`, `docs/CHANGELOG.md`, plus any sibling repos' equivalents to propose new entries for the queue. Useful when (a) the queue is running dry, (b) at the end of a long autonomous chain to scope next-session work, or (c) periodically as a hygiene pass to surface forgotten queue-able items.

The curator must NOT promote items to `[autonomy: safe]` that the author tagged otherwise — proposals respect the original autonomy tag. Items the curator considers but rejects go in a "Notes" section with a one-line reason so future curators don't re-evaluate.

**Run pattern:** spawn read-only with `run_in_background: true` so the curator works alongside active queue execution. The host surfaces proposals to the user at the end of the session; user picks which to add. Adding to `AUTONOMOUS_QUEUE.md` is a coordinator action, not a curator action — the queue stays a curated artifact.

Output: structured proposal list — for each entry, source `path:line`, why-safe rationale, acceptance criterion, and a queue-format-ready bullet line. Plus a Notes section for rejected items, plus a one-paragraph queue-health summary.

### Frontier-tier roles (Opus / equivalent)

Spawn these when the host hits a subtask matching the escalation list at the top of this file. Pattern: the host stays at Workhorse tier and delegates the Frontier-tier subtask to a named Frontier subagent, then resumes implementation as Workhorse with the subagent's structured output as input. This is preferable to escalating the host itself: Opus burn stays bounded to the hard subtask, host context stays lean, and Frontier subagent output is structured and reviewable.

#### `planner` (Frontier, read-only)

Pre-implementation planning pass for medium/large features. Reads the spec (TODO/ROADMAP entry), relevant files, and prior `docs/DECISIONS.md`. Output: numbered plan with `path:line` references, alternatives considered with rationale, risk list, test plan. Plain markdown, no code.

When to spawn: any task tagged `[size: M|L]` or `[autonomy: review]`, work expected to span 5+ files, or anywhere multiple implementation paths are plausible. Run before implementation subagents fire.

#### `architect` (Frontier, read-only)

Architecture decisions destined for `docs/DECISIONS.md`. Reads project context, prior decisions, and relevant code. Output: structured decision record (`Status` / `Context` / `Decision` / `Consequences`) plus a 1-paragraph rationale per major alternative.

When to spawn: any work tagged `[autonomy: needs-human-collab]`, refactors that revise an existing decision, or any ambiguous-architecture sub-task surfaced by `planner`.

#### `security-reviewer` (Frontier, read-only)

Security review of auth/credential/access-control code. Reads changed code plus its callers, schema columns, and existing test coverage. Looks for OWASP-class issues: auth bypass, IDOR, credential leak, race conditions, rate-limit bypass, JWT verification edge cases.

Output: findings list with severity (`high` / `med` / `low` / `note`), `path:line`, brief description, suggested mitigation. If clean: explicit "no findings" with the surface area covered.

When to spawn: before merging any change to authn/authz, password handling, token issuance/verification, rate-limit middleware, or schema columns affecting access control.

#### `debugger` (Frontier, read-only)

Non-obvious failure investigation. Distinguished from `recon` by depth — `recon` locates code, `debugger` reasons about behavior. Reads test output, repro steps, error logs, then traces code paths to hypothesize root cause.

Output: ranked root-cause hypotheses with evidence supporting each, plus verification steps the host should run before fixing.

When to spawn: failures where the assertion doesn't reveal the cause, suspected race conditions, persistence corruption, or anywhere "I'm not sure why this is happening" is the host's honest state.

Add project-specific Frontier roles as needed (e.g. `compliance-review`, `migration-review`, `perf-review`, `dsp-design`). Each gets the same shape: tier, read-only-or-edit, when to spawn, required output structure.

#### When to escalate the host itself to a Frontier model (rare)

The subagent pattern is the default. Recommend a direct planning session — host running at Frontier tier, multi-turn dialogue with the user — when:

- The host can't write a good `planner` prompt (genuinely novel work; doesn't know what to ask). A subagent given a vague prompt produces a vague plan; a multi-turn Frontier host can ask clarifying questions.
- The user explicitly wants an interactive design conversation, not a one-shot plan.
- A `planner` pass already ran and the choice between alternatives is the actual hard problem — the decision needs dialogue, not another plan.
- The work needs simultaneous reasoning over several large docs where the host's full context window is the right tool.
- The work is tagged `[autonomy: needs-human-collab]` and the user has approved starting it.

**How.** Surface the recommendation to the user — don't switch tiers silently. End the current Workhorse session cleanly (commit in-flight work, leave a TODO note about the planning handoff). User starts a fresh Frontier session, then returns to Workhorse for implementation once the plan is in hand. `planner` / `architect` subagents resume normal use from there.

**Phrasing:** "I think this needs a direct planning session at Frontier tier, not a `planner` subagent, because [specific reason]. Want me to wrap up here so you can start a fresh Frontier session?"

**Cost discipline.** Frontier host time is several multiples of Workhorse host time per token, and planning conversations can run long. The user authorizes the tier switch — don't act as if the host were Frontier without an explicit handoff.

### Subagent prompting rules

- State the goal in one sentence.
- List the relevant files or directories explicitly.
- State the model tier and the role name.
- State whether the subagent is read-only or edit-capable.
- Require the role's output shape verbatim.
- Subagents do not own commits, merges, or doc-completion-gate sign-off. The host reconciles results and performs git operations.

## Project-Local Roles

The standard subagent set above ships with the framework. Project-specific roles — anything with content-safety rules, domain validation, custom approval signals, or workflow steps unique to this product — live under `docs/agents/<ROLE>.md` as per-role work contracts.

Each role file states:

- **Tier** — Frontier / Workhorse / Recon (cross-reference the tier table above).
- **Authority boundary** — what the role may do directly, what it must escalate, what it must not touch.
- **Drift-and-re-pitch rules** — when scope drift triggers a return to `docs/OPEN_DECISIONS.md` or a re-pitch to the funding/approval gate.
- **Content-safety rules** — domain-specific constraints (e.g. solvability checks, accessibility floors, license/IP limits, tone or audience guardrails).
- **Cleanup gate** — completion-gate steps the role owns before sign-off (CHANGELOG, TODO trim, decision logging, etc.).
- **Approval signals** — exact phrases or document states that unblock the role (e.g. `FUNDING_APPROVED` for a Founder, a sign-off line in `DECISIONS.md` for a paired-design item).

### Index pattern

`docs/AGENTS.md` in each project lists its role files in a small table so the host can find them without crawling the directory:

| Role | File | One-line description |
|---|---|---|
| `<Role-Name>` | [`docs/agents/<ROLE>.md`](agents/<ROLE>.md) | <one-line summary of what the role owns> |
| `<Role-Name>` | [`docs/agents/<ROLE>.md`](agents/<ROLE>.md) | <one-line summary> |

Roles in this index are project-specific — the standard subagent set above does not need to be re-listed unless a project meaningfully overrides one of them (and an override of that kind belongs in "Local Overrides", below).

### Local Overrides

When this repo inherits an `AGENTS.md` from a parent or upstream workspace (for example, a sibling product repo that defers to a workspace-level playbook), do not fork the whole playbook. Instead, add a "Local Overrides" subsection under `docs/AGENTS.md` here that annotates only the divergences:

- A different default tier for implementation work.
- Project-specific escalation rules (e.g. extra approval gates, additional `[autonomy: needs-human-collab]` items).
- Content-safety constraints unique to this product.
- Approval-signal renames (record any change as a durable decision in `docs/DECISIONS.md` before adopting).

This keeps the upstream playbook authoritative while making project-specific deltas visible at a glance. Drift between the override list and the upstream playbook should be reconciled at the next end-of-session cleanup.

## Worktree Isolation

For any edit-capable subagent during autonomous runs, spawn with `isolation: "worktree"` so parallel work cannot conflict. The host reviews the worktree diff before merging.

## Shell And Git Invocation

When running git in a sibling repo (or any directory other than the session's working directory), use `git -C "<absolute path>" <command>` instead of `cd "<path>" && git <command>`.

`git -C` changes git's working directory without changing the shell's. The harness gates `cd <dir> && <cmd>` with a permission prompt (the `cd` could expose untrusted hooks); `git -C` skips that gate and is the idiomatic flag for the case. It also keeps shell state stateless across calls, which matters when parallel subagents run.

```bash
# Preferred
git -C "/path/to/sibling-repo" status
git -C "/path/to/sibling-repo" log --oneline -5

# Avoid
cd "/path/to/sibling-repo" && git status        # triggers permission prompt
```

`cd` is still appropriate for non-git commands that genuinely need a different cwd (e.g. `cd <repo> && npm test` — `npm` has no `-C` equivalent and reads `package.json` from cwd). The rule is specifically about git.

## Permission Allowlist Maintenance

The `git -C` rule above prevents most cross-repo prompts at the source. For patterns that legitimately need `cd` (e.g. `cd <repo> && npm test`), use the `fewer-permission-prompts` skill to add them to the workspace allowlist so they stop prompting on future runs.

The skill scans recent Claude Code transcripts, identifies Bash/MCP tool calls that triggered an Allow/Deny prompt, filters to read-only-by-pattern operations, and writes a prioritized allowlist into `.claude/settings.json`. Properties:

- Read-only operations only — destructive commands are never auto-allowed.
- Workspace-scoped (`.claude/settings.json`); applies to every agent in the project.
- Idempotent across runs; small reviewable diffs.

Run after any autonomous run that hit prompts (captures patterns while they're in transcript history), when prompt friction bites, or periodically as hygiene. Do not edit `.claude/settings.json` by hand for routine allowlisting — let the skill handle prioritization and de-duplication.

The `git -C` rule is **prevention** (correct agent behaviour avoids the prompt); the skill is **cure** (the harness allows the unavoidable patterns). Use both.

## Autonomy Tags

Every entry in `docs/TODO.md` and `docs/ROADMAP.md` should carry one or more of these tags. The autonomous-host policy reads tags before deciding whether to pick up a task without user input.

- `[size: S|M|L]` — rough effort. S = under an hour focused work. M = a session. L = multi-session or design-required.
- `[tier: haiku|sonnet|opus]` — the model that should drive implementation.
- `[risk: low|med|high]` — blast radius if it goes wrong.
- `[scope: isolated|cross-repo]` — whether the task touches one repo or several.
- `[autonomy: safe|review|needs-human-collab]` — the human-gate level (see below).

A reasonable default for a small isolated TODO entry is `[size: S][tier: sonnet][risk: low][scope: isolated][autonomy: safe]`. Omit tags that match this default; only call out where the entry differs.

### Autonomy Markers

The `[autonomy: …]` tag has three exact values. Use these spellings verbatim — downstream tooling and the autonomous-queue policy match on them.

- **`[autonomy: safe]`** — autonomous host can implement and merge unattended. Implementation lands on a branch; tests must pass; doc gates must be honored; the host may open and merge the PR without human review.
- **`[autonomy: review]`** — autonomous host implements but opens a **draft PR**; a human reviews before merge. Use for changes that are well-scoped but touch surfaces where a second pair of eyes is cheap insurance.
- **`[autonomy: needs-human-collab]`** — implementation is blocked until paired with a human; do not start. Use for high architectural stakes, unclear product direction, or risky integrations. Surface the task to the user and wait for explicit approval and a planning conversation.

These markers are referenced from `docs/TODO.md`, `docs/AUTONOMOUS_QUEUE.md`, `docs/ROADMAP.md`, and `docs/DECISIONS.md`. A change to a marker on an item that already shipped is itself a `DECISIONS.md`-worthy moment.

### Currently `needs-human-collab` in this repo

List the project's current paired-session items here so they show up alongside the rule rather than being buried in TODO. Adding or removing items here is a `docs/DECISIONS.md`-worthy moment; do not unilaterally promote/demote.

- (none yet — populate as items get tagged)

## Approved Autonomous Queue

Tasks pre-approved for unsupervised work belong in `docs/AUTONOMOUS_QUEUE.md` (a thin priority-ordered list of pointers into TODO.md / ROADMAP.md). The autonomous host pulls from the top of that queue. Anything not in the queue requires user input even if it is tagged `[autonomy: safe]`.

The queue is curated by the user (and optionally by Frontier-tier planning passes), not promoted automatically by Workhorse-tier implementers.

## End-of-Session Cleanup (Mandatory)

Documentation hygiene is a completion gate. Before declaring a task complete, the host MUST:

1. **Delete completed entries from `docs/TODO.md`** — once an item ships and is logged in `docs/CHANGELOG.md`, remove it from TODO. Do not leave `[x] DONE` entries lingering. TODO is a queue, not a log.
2. **Update `docs/ROADMAP.md`** — mark completed items with ✅ or move them to a `## Completed` section so the planning surface stays current.
3. **Add a `docs/CHANGELOG.md` entry** for any meaningful change.
4. **Update `docs/DECISIONS.md`** when the work involved a non-obvious tradeoff.
5. **Run `git diff -- docs`** before signing off; verify no stale names, endpoints, or paths remain.
6. **Reflect on the playbook** — see "Playbook Improvement Loop" below. If this session revealed a real workflow-impact change, add an entry to `docs/PLAYBOOK_FEEDBACK.md`. Do NOT edit AGENTS / HANDOFF / etc. directly without user review.
7. **Run `npx discipline lint`** and fix anything red before signing off.

"Completed" for the cleanup gate means: the change has landed on the default branch (or, for docs-only work, the edit is committed) AND its `docs/CHANGELOG.md` entry is written. Delete the TODO entry at that moment — not when tests pass, not when a PR is opened. The CHANGELOG entry and the TODO deletion happen in the same commit.

The chronological feature log lives in `docs/CHANGELOG.md`. The "what the system does today" surface lives in `docs/PROJECT_CONTEXT.md` (and per-area cold-path docs). Do not add a separate `FEATURES.md` — it would only duplicate one of those two.

## Playbook Improvement Loop

The agent playbook should improve over time without becoming improvement-theater. After every non-trivial session, the host should ask: *did anything reveal that AGENTS / HANDOFF / TODO conventions or other workflow docs would work better with a change?*

Capture proposals in `docs/PLAYBOOK_FEEDBACK.md`, **not directly in the workflow docs**. Direct edits skip the user review gate.

### Workflow-impact discipline (hard rule)

Only propose a change when at least one is true:

- A real friction point in this session would have been prevented or reduced by the change.
- A real friction point is foreseeable in upcoming work and the change prevents it.
- A pattern showed up multiple times and is worth codifying so future agents don't re-derive it.
- A subagent role's contract had to be bent to fit a real situation, suggesting the contract needs tuning.

**If none of these apply, do NOT propose.** Improvement-theater — adding aspirational language because language is easy — is the failure mode. Stale aspirational guidance is worse than absent guidance.

### Two kinds of proposal

- **Local improvements** — edits to this repo's `docs/AGENTS.md`, `docs/HANDOFF.md`, TODO conventions, completion gate, named subagent role contracts, etc.
- **Template promotions** — a pattern that started project-local has proved general enough to push back to your framework's canonical `templates/`. Higher bar: the pattern should have shipped at least once in this project (ideally with measurable workflow improvement) before promotion.

### Two improvement loops — don't conflate them

This section is the **playbook (meta) loop**: improving *how the agents work* (AGENTS / HANDOFF / conventions), captured in `PLAYBOOK_FEEDBACK.md`, gated on workflow-impact.

The **object-level loop** is separate: using subagents to recursively improve *the project's own code/features* (discover → execute → verify → evaluate → integrate → repeat). It is optional and lives in its own contracts — `IMPROVEMENT_LOOP.md` (the cycle, composing the queue + autonomy tags + the RECON / reviewer roles) and `VERIFICATION_GATE.md` (the machine-checkable ground-truth signal every iteration must pass). Install with `npx discipline add IMPROVEMENT_LOOP VERIFICATION_GATE`. The object-level loop **must not run on any step lacking a verification gate** — that step is judgment, route it to `OPEN_DECISIONS.md`.

### Lifecycle

1. **Propose** — agent adds an entry to `docs/PLAYBOOK_FEEDBACK.md` with rationale + the specific friction point. State workflow impact concretely.
2. **Review** — user accepts / rejects / asks for revision.
3. **Apply** — on accept, agent edits the canonical doc, adds a CHANGELOG entry, moves the PLAYBOOK_FEEDBACK entry to "Applied (recent)".
4. **Trim** — once CHANGELOG covers it, delete from PLAYBOOK_FEEDBACK on the next cleanup pass.
5. **Verify (later, not the same session)** — the next session in the changed area checks whether the recorded friction is actually gone. If the rule is being ignored or the friction recurs, propose its removal or revision: the loop must be able to subtract, not only add. See `docs/PLAYBOOK_FEEDBACK.md`.

Rejected proposals get a brief note under "Rejected (recent)" so the same idea does not get re-proposed.

### Examples of proposals that should NOT land

- "AGENTS.md could be clearer about X" — without a specific friction point from this session.
- "Maybe we should add a `<role>` subagent" — no work this session would have used it; speculative.
- Wording polish, prose tightening, formatting consistency — not workflow improvements.

If you reach for one of these, mention it in the end-of-session summary as an observation and let it die if it doesn't recur.

## Human-Collaboration Gate

Some work is too high-stakes for autonomous-host execution even with passing tests. Tag those entries `[autonomy: needs-human-collab]` in TODO/ROADMAP. The agent's job in those cases is to:

1. Surface the task to the user with current context.
2. Wait for explicit approval and a planning conversation.
3. Run an Opus Plan agent for the design pass.
4. Implement only after the plan is reviewed.

Do not silently start work on `[needs-human-collab]` items just because tests pass and the task looks scoped.

## Quick Decision Tree

Tier names (Frontier / Workhorse / Recon) are used here for ecosystem neutrality — see Cross-Ecosystem Tier Framework above for the Claude / OpenAI / Google / local mapping.

```
Is this task in docs/AUTONOMOUS_QUEUE.md?
├── Yes → tag says safe   → run as Workhorse host, open PR
├── Yes → tag says review → run as Workhorse host, open DRAFT PR
└── No / tag says needs-human-collab
    └── Surface to user, wait for approval, plan via Frontier subagent or direct Frontier session

For each subtask within the work:
├── Recon / lookup     → spawn Recon-tier `recon` subagent
├── Doc audit / sweep  → spawn Recon-tier `doc-audit` subagent
├── Backend impact?    → spawn Workhorse `backend-impact` subagent
├── Frontend impact?   → spawn Workhorse `frontend-impact` subagent
├── Test plan?         → spawn Workhorse `test-strategist` subagent
├── Cross-repo edits   → spawn Workhorse `cross-repo-sync` subagent (worktree)
└── Architecture call  → spawn Frontier `architect` subagent or escalate the host itself; write decision into DECISIONS.md
```
