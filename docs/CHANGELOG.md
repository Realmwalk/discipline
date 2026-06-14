# Changelog — Discipline

Project-local chronological log of shipped work for this repo.

## 2026-06-14 — Spec & Design phase (CORE): SPEC_WORKFLOW + SPEC + BUILD_PLAN + SPEC_ARCHITECT + lint

New **core** phase that sits between *deciding to build* and *building* — front-loads the human design judgment into an airtight, testable, machine-verifiable spec so an unattended executor (local model, ChatGPT, or Claude) builds the right thing. Two stages, two verbatim gates: Stage A plain-English functional spec → `SPEC_APPROVED`; Stage B technical plan (stack tradeoffs + queue-ready stories + verifier suite) → `BUILD_PLAN_APPROVED`. Model-agnostic throughout; no Claude-only "plan mode" dependency. **Core, not optional** — a good spec is the load-bearing input to every build, and getting you there is the whole point; the anti-completeness stance is about niche project-specific scaffolding, which this is not (see `docs/DECISIONS.md` 2026-06-14).

- (new: templates/SPEC_WORKFLOW.md) **The phase definition.** Where it sits (after `FUNDING_APPROVED` / ticket accept; before Build), the first-prompt **interaction tier** (Express / Guided / Thorough[default] / Exhaustive), Stage A spec discipline (the spec IS the verifier; `[AUTO]`/`[HUMAN]` tags; red-team before locking), Stage B technical plan + dependency-ordered stories, verifier-suite generation with best-effort fallback when the stack has no test runner, tier routing (red-team = Frontier one call; the weak-model floor), the two gate tokens, and `Specifying...` / `Planning...` signals.
- (new: templates/SPEC.md, templates/BUILD_PLAN.md) **Stage A + Stage B templates.** SPEC.md is entirely plain English (screens / controls / flows / negative space), every requirement tagged + testable, acceptance tests + human checklist + open questions. BUILD_PLAN.md carries stack tradeoff tables, queue-ready stories (`[id:]` / `satisfies: R#` / `[dep: none|S-xx]` / standard tags), and the generated verifier suite. **Core** templates (Core 8 → 11), alongside SPEC_WORKFLOW.md.
- (new: templates/agents/SPEC_ARCHITECT.md) **The role contract.** Read-only design agent that runs both stages; Workhorse for drafting, Frontier for the red-team / ambiguous-architecture call; must not implement, install, or queue before the gate tokens. **Core** role (Core 5 → 6); installs by default with `discipline init`.
- (feat: bin/discipline.js) **Core promotion + four spec-phase lint rules.** `CORE_8` → `CORE` (11 templates); SPEC_ARCHITECT added to `CORE_ROLES` (6). New lint rules, firing whenever the files exist (now every project): `spec-req-untagged` (every SPEC.md requirement carries `[AUTO]`/`[HUMAN]`), `spec-auto-coverage` (every `[AUTO]` requirement has an Acceptance Tests entry — the verifier seed), `story-dep-tag` (every BUILD_PLAN.md story carries a `[dep: …]` marker — the dependency graph is the build schedule), `story-traceability` (every story traces to a requirement via `satisfies: R#`). All WARN; the shipped templates are lint-clean by construction. `help`/`list`/`init` counts updated.
- (update: README.md) Spec & Design phase added to Core ideas + the comparison table; Optional-templates list refreshed.

## 2026-06-10 — Weak-model hardening: `discipline lint` + mechanism-over-judgment template pass

Analysis found the framework's gates (cleanup gate, two-gate autonomy, approval signals, judgment-call contracts) fail when executed by weaker LLMs because enforcement relies on model judgment and memory. This pass converts judgment to mechanism and adds worked examples / countable rubrics.

- (feat: cli) **New `discipline lint [--target <path>] [--strict]` command** in `bin/discipline.js`. Zero-dependency linter for a target's `docs/`: `todo-done-residue` (error — `[x]` entries violate the cleanup gate), `tag-validity` (error — tag values outside the documented legend), `queue-orphan`, `todo-two-gate` (`[autonomy: safe]` without a queue entry), `decisions-structure`, `hot-doc-size` (AGENTS 36KB / HANDOFF 24KB / TODO 16KB / CLAUDE 12KB budgets), `placeholder-residue`, `handoff-stale` (>60 days). Exit 1 on errors (or warnings under `--strict`); rules skip gracefully when their file is absent; never lints this package's own `templates/`. `help` and `list` output mention it; README gains a lint section.
- (update: templates/agents/*.md + templates/agents/optional/*.md + both docs/agents/ copies) **`## Worked Example` in every role contract** (RECON, PLANNER, DEBUGGER, SECURITY_REVIEWER, CROSS_REPO_SYNC, STAKEHOLDER + the 6 optional roles, and `_TEMPLATE.md` skeleton): one realistic input, a verbatim good output in the role's required shape, a "Not this" exhibiting the role's documented weak-model failure (Recon speculation, Planner pathless steps, Debugger evidence-free fix, security severity inflation, forgotten sibling back-link, strawman alternatives, doc-audit additions-instead-of-retirements, curator tag promotion, vague test themes, hand-wavy rollback/consumer lists), and a one-line *Why it fails*. Each contract also gains an inputs-discipline line ("Read exactly the inputs above plus any files the spawn prompt names"). DEBUGGER stop condition made countable: two evidence-backed hypotheses both falsified → escalate to Frontier.
- (update: templates/AGENTS.md) **Weak-model floor (hard rule)** — scoring/ranking feeding an approval gate, adversarial review, materiality calls, and edits to the funding gate / approval signals / queue membership never run below Frontier unsupervised; Recon-tier never self-assesses its envelope. **Countable escalation triggers** after the Opus escalation list (3+ repos / 6+ files, imported-contract changes, plan rewritten twice, two falsified hypotheses, DECISIONS-bound). **"Completed" pinned** for the cleanup gate (landed on default branch + CHANGELOG entry written; TODO deletion in the same commit) plus a new cleanup step: run `npx discipline lint` before signing off.
- (update: templates/HANDOFF.md) **Approval-signal matching rule** — verbatim token, case-insensitive, surrounding whitespace/punctuation ignored; paraphrases and enthusiasm never open the gate; ask for the exact token rather than inferring it.
- (update: templates/TODO.md) **Two-gate reminder blockquote** at the top: `[autonomy: safe]` is necessary but NOT sufficient — the item must also be in `docs/AUTONOMOUS_QUEUE.md`.
- (update: templates/AGENT_TRACKER.md) **Decision rules pinned to row-counting** — graduation (3 clean) / contraction (2 fails) are computed by counting entry rows for the `(model, task-type)` pair, never from memory. Row schema was already tight; left as-is.
- (update: docs/AGENTS.md, docs/TODO.md, docs/AGENT_TRACKER.md) **Dogfood copies synced where sections exist** — Cleanup Gate gains the lint step + completed-definition; TODO gains the two-gate blockquote; AGENT_TRACKER placeholder example rows replaced with honest empty state (tracker started 2026-05-09). docs/AGENTS.md has no tier-framework/escalation sections and docs/HANDOFF.md has no approval-signals section, so the floor/trigger/matching blocks were not duplicated there.
## 2026-06-07 — Object-level Improvement Loop (2 optional templates)

Added the recursive object-level improvement loop as two opt-in templates: `IMPROVEMENT_LOOP.md` (the discover → execute → verify → evaluate → integrate → repeat cycle, composing the existing queue + autonomy tags + RECON/reviewer roles — no new roles) and `VERIFICATION_GATE.md` (the machine-checkable ground-truth signal that keeps an autonomous loop honest). Registered in `bin/discipline.js` (Optional 14 → 16), the README (new Core idea #7), `templates/AGENTS.md` (Playbook Improvement Loop → "Two improvement loops" pointer), and `templates/HANDOFF.md` doc index. Recorded as a deliberate, audited exception to the anti-completeness rule + the 2026-05-24 "no new templates" clause (which was scoped to the *meta* playbook loop, not this *object-level* one) — see `docs/DECISIONS.md` 2026-06-07. The Claude Code `/improve-loop` skill + cleanup-gate Stop-hook adapter is deferred to Stage-2 harness integration. Validated end-to-end on a real multi-agent rewrite (~20 real bugs fixed, gated on compile/tests/repro).

## 2026-05-25 — STAKEHOLDER Low-Effort mode: clarify operate-vs-create

Clarified the Low-Effort Stakeholder mode, keeping the two `STAKEHOLDER.md` copies byte-identical. The change loosened the lazy contract's bias against "creation effort".

- (update: templates/agents/STAKEHOLDER.md + docs/agents/STAKEHOLDER.md) **"Low-effort" = low effort to operate, not to build.** Added a clarifying paragraph to `## Alternate Mode: Low-Effort Stakeholder`: the bias governs *ongoing operating burden*, not one-time creation effort. Scope that takes real upfront craft but then runs itself (curated content, an original reference, a synthesis guide) is *preferred*, not penalized — the craft done once is the moat a competitor cannot clone cheaply. Prevents the mis-read that high-craft-but-low-maintenance scope is drift. Note: the cross-disciplinary methodology / Commercial Doubt-Screens are scouting-layer and deliberately absent from this single-product framework.

## 2026-05-24 — Stop tracking dogfood docs; sync framework templates

- (.gitignore) **Dogfood docs untracked.** Discipline runs its own templates on itself; those `docs/` instances (`docs/agents/`, `docs/AGENT_TRACKER.md`, `docs/AUTONOMOUS_QUEUE.md`, `docs/DEPLOYMENT.md`, `docs/INVESTIGATION.md`, `docs/OPEN_DECISIONS.md`, `docs/PLAYBOOK_FEEDBACK.md`, `docs/SECURITY_AUDIT.md`) duplicate `templates/` and are now gitignored so they stay local-only. Specific to Discipline dogfooding the framework it ships — adopter repos are the opposite (their `docs/` are real and tracked).
- (update: templates/CLAUDE.md, templates/HANDOFF.md) **Template sync.** `templates/CLAUDE.md` gains a Session-start preflight and the explicit one-PR-per-change rule (replacing the placeholder); `templates/HANDOFF.md` gains pnpm lockfile / package-manager notes. Candidate for wider promotion via the PLAYBOOK_FEEDBACK path.

## 2026-05-24 — Harness integration design doc

Captured the harness-integration strategy as a `docs/` design doc and wired references. No CLI/code change — Stages 1–2 (generated adapters) stay re-pitch-gated.

- (new: docs/HARNESS_INTEGRATION.md) **Harness integration design doc.** Thesis (Discipline is already harness-agnostic; integration = thin per-harness adapters that point a harness's native entry file at `docs/AGENTS.md`), three-layer model, per-harness matrix (Claude Code / OpenCode / Codex / Cursor / others), the `AGENTS.md` convergence leverage point, staged delivery (Stage 0 guide in-scope → Stage 1 `discipline init --harness` → Stage 2 deep primitives, both re-pitch-gated), anti-completeness guardrail (adoption-gated via the cross-product harvest + product-outcome retro), governance, and risks.
- (update: docs/README.md, README.md, docs/ROADMAP.md) **References.** Added to the docs map, an adopter pointer in the root README, and a cross-cutting "Harness integration (proposed)" entry on the roadmap.

## 2026-05-24 — STAKEHOLDER contract gains a Funding Gate + Low-Effort alternate mode

Enriched the `STAKEHOLDER.md` role contract (both `docs/agents/` and `templates/agents/` copies, kept byte-identical) by distilling two patterns into project-stakeholder scope. No new role files — the lean five-role set is unchanged.

- (update: docs/agents/STAKEHOLDER.md + templates/agents/STAKEHOLDER.md) **New `## Funding Gate` section.** Makes the pre-approval authority split explicit: while a new-scope decision is pending the approval signal, the Stakeholder MAY inspect / draft the re-pitch / plan, but MUST NOT create files, install deps, start a server, queue the work, or expand it under the label of "setup." Codifies the literal-signal discipline into the Stakeholder role contract (exact phrase only; a paraphrase or implied yes is not the signal; approval is scoped to what was pitched).
- (update: docs/agents/STAKEHOLDER.md + templates/agents/STAKEHOLDER.md) **New `## Alternate Mode: Low-Effort Stakeholder` section.** Opt-in posture (recorded in `docs/DECISIONS.md` when adopted) that biases toward operationally-inert scope: prefers static / self-serve / async surfaces, applies a walk-away test, suppresses the runtime/SaaS reflex, and allows a project-set maintenance ceiling. Operational-burden growth is treated as material drift even when technically in-scope. Distilled into the Stakeholder role contract, with hardcoded figures replaced by `<walk-away-window>` / `<hours-per-month>` placeholders so the contract stays stack- and project-agnostic.

## 2026-05-24 — Self-improvement loop closed (verify + prune + product-outcome + cross-product harvest)

Extended the framework's existing improvement machinery (PLAYBOOK_FEEDBACK capture + AGENT_TRACKER tier loop + CROSS_REPO_SYNC promotion) from an *inbox* into a closed, self-correcting loop. Implemented as edits to existing templates — no new templates or roles; the Core 8 / Optional 14 and five-role lean set are unchanged. See `docs/DECISIONS.md` (2026-05-24) for rationale.

- (update: templates/PLAYBOOK_FEEDBACK.md + templates/AGENTS.md) **Effect-verification.** Lifecycle gains step 5 "Verify": applied entries record the friction they were meant to kill; a later session confirms it's gone (rule earned its keep) or recurring (improvement-theater — re-propose removal). The "Applied (recent)" format gains "Friction it killed" + "Verify by" fields.
- (update: templates/agents/optional/DOC_AUDIT.md) **Rule-retirement.** New responsibility: flag conventions/gates/role instructions that are routinely ignored, worked around, or aspirational as **retirement candidates**. Pruning is now a first-class output, co-equal with adding.
- (update: templates/AUTONOMOUS_QUEUE.md) **Product-outcome retro.** New recurring, `[autonomy: review]` pass that checks shipped product work against the pitch's success metrics + kill criteria (`docs/PROJECT_CONTEXT.md`) and routes to `docs/TODO.md` or a `STAKEHOLDER` re-pitch/kill in `docs/OPEN_DECISIONS.md`. Improves the product, not just its docs; pairs with the Low-Effort Stakeholder walk-away test.
- (update: templates/agents/CROSS_REPO_SYNC.md) **Cross-product harvest.** New recurring pass + `HARVEST_APPROVED` signal: mine sibling products' PLAYBOOK_FEEDBACK + AGENT_TRACKER for friction recurring across ≥2–3 products; promote the pattern to the framework, or retire a default multiple products keep deleting. Recurrence across the fleet is stronger evidence than one repo's opinion.

Scope note: this pass edited the shipped `templates/` copies (the framework deliverable) plus this CHANGELOG and DECISIONS. The `docs/` dogfood copies were not synced here — the working tree had unrelated in-progress work and dogfood sync was deferred to avoid entangling it.

## 2026-05-12 (docs: binding tier, Recon-host posture, exploration ceiling)

Applied three framework hardening changes to the dogfood `docs/` copies:
- `docs/agents/PLANNER.md` — **New file.** Planner role contract (Workhorse/Sonnet-class). Binding tier assignment authority, cleanup gate, and output contract incorporated.
- `docs/AUTONOMOUS_QUEUE.md` — Tier assignment is now binding, not suggested. Planner sets it at enqueue; entries without an assignment are not dispatchable. *(skipped — text diverged or file not present)*
- `docs/AGENTS.md` — New "When the host runs at Recon tier" host-posture subsection; new exploration-ceiling bullet in Subagent prompting rules. *(skipped — anchor sections not present in this repo's AGENTS.md template version)*

Local overrides preserved; diverged sections skipped, not rewritten.
## 2026-05-11 — Template HANDOFF.md + CLAUDE.md gain branch-lifecycle rule

- **`templates/HANDOFF.md` `## Project Workflow → ### Branching` now contains the branch-lifecycle bullet.** Canonical home for the rule: "One PR = one feature = one branch off latest main. Never push follow-on commits to a merged or stale branch — those commits become orphans. If you slipped, cherry-pick onto a fresh branch and open a new PR."
- **`templates/CLAUDE.md` Hard Rules section now contains a `<branch-lifecycle rule>` placeholder.** Mirrors the HANDOFF rule as a load-bearing one-liner in the per-repo onboarding doc. Rationale: same-day mistake in a sibling repo where a follow-on commit was pushed to a feature branch *after* its PR had merged, producing an orphan commit that never reached `main`.

## 2026-05-09 — Agent role split (core 5 / optional 6)

Followup to the initial scaffold: split the agent role contracts into a core/optional structure parallel to the Core 8 / Optional 14 template split. Driven by Capital Stakeholder feedback that the retired roles (architect, doc-audit, test-strategist, backend-impact, frontend-impact, queue-curator) shouldn't disappear entirely — they're still useful in specific contexts and should ship as opt-in installables.

- `templates/agents/` now holds the 5 core roles (RECON, PLANNER, DEBUGGER, SECURITY_REVIEWER, CROSS_REPO_SYNC) plus meta files (`_TEMPLATE.md`, `README.md`, `STAKEHOLDER.md`).
- `templates/agents/optional/` is new and holds the 6 retired-from-default roles (ARCHITECT, BACKEND_IMPACT, DOC_AUDIT, FRONTEND_IMPACT, QUEUE_CURATOR, TEST_STRATEGIST). They're not deleted; they're just opt-in.
- `bin/discipline.js` updated to know about the split:
  - `discipline init` copies templates/agents/ top-level files only (the core 5 + meta), no longer drags `optional/` along.
  - New `discipline add-role <NAME>` command copies an optional role from `templates/agents/optional/` into the target's `docs/agents/`.
  - `discipline list` shows the role split alongside the existing template split.
  - `discipline help` mentions the new command.
- The `templates/agents/` split means adopters get the lean default on `discipline init` and can opt back in to the retired roles via `discipline add-role`.

## 2026-05-09 — Initial scaffold

- Repository scaffolded.
- `LICENSE` (MIT) written; copyright John Hardy, 2026.
- Public-facing `README.md` written with the contrarian thesis above the fold ("Your AGENTS.md will rot in 6 months").
- `package.json` set up as a Node CLI package with `discipline` bin entry; `bin/discipline.js` implements `init`, `add`, `list`, `help` commands. Core 8 + Optional 14 split baked into the CLI source.
- `templates/` folder established with the initial template set. Full template set ships with the package; CLI's default `init` only drops the Core 8.
- Project-local `docs/` written using Discipline's own Core 8 templates (eat-your-own-dogfood):
  - `README.md`, `HANDOFF.md`, `AGENTS.md` (with Local Overrides on framework defaults), `PROJECT_CONTEXT.md`, `TODO.md`, `DECISIONS.md`, `ROADMAP.md`, `CHANGELOG.md`.
- `.gitignore` set up for Node project basics.
- Five durable decisions logged in `docs/DECISIONS.md`: MIT license, Core 8 / Optional 14 split, supervised-direct as default posture, five-role lean subagent set.
- `docs/ROADMAP.md` documents staged delivery phases.
