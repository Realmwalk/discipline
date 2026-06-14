# Decisions — Discipline

Durable architectural / product decisions for the Discipline OSS framework.

## 2026-06-07 — Object-level Improvement Loop: two new optional templates (scoped anti-completeness exception)

**Status:** Accepted. `FUNDING_APPROVED` (stakeholder, this session: *"adding 2 templates for something genuinely new is not template runaway. add both"*).

**Context:** The 2026-05-24 decision below ("Self-improvement loop: close it") closed the **meta-loop** — the framework improving its *own playbook* — across four existing surfaces, with an explicit "**no new templates or roles**" clause. A separate, **object-level** loop was then requested: using AI subagents to recursively improve a *project's own code/features* (discover → execute → verify → evaluate → integrate → repeat), demonstrated end-to-end on a live project (a multi-agent triage→fix→QA→loop→full-app-QA run that fixed ~20 real bugs, gated on compile/tests/repro).

That object-level loop is a genuinely different capability, and the framework had no first-class home for its two load-bearing pieces: (1) the **verification gate** — the machine-checkable ground-truth signal that keeps an autonomous loop honest (it caught the agents' own compile error, test regression, and a deadlock during a real multi-agent run) — which existed nowhere; and (2) the **loop cycle itself** as a composed, runnable contract.

**Decision:** Add **two** optional templates — `IMPROVEMENT_LOOP.md` (composes existing surfaces: AUTONOMOUS_QUEUE, autonomy tags, PLAYBOOK_FEEDBACK, the RECON / reviewer roles) and `VERIFICATION_GATE.md` (the new primitive). **No new roles** — the loop fans out the existing roster. Optional 14 → 16; Core 8 and the role set unchanged.

**Why this is not a violation of the anti-completeness rule:** the rule forbids competing on *count* / awesome-list sprawl — templates added for breadth, not need. These two are the opposite: a single new capability with exactly one new primitive (the gate) plus one composition doc, both earning their place by closing a real gap the framework demonstrably had. The meta-loop's "no new templates" clause was scoped to the *playbook* loop and is not amended; this entry records the object-level loop as a deliberate, audited exception rather than scope creep. Future additions must clear the same bar (genuinely-new capability, minimal new primitives) or be refused.

**Consequences:** Registered in `bin/discipline.js` OPTIONAL, the README, `templates/AGENTS.md`, and `templates/HANDOFF.md`. A Claude Code `/improve-loop` skill + cleanup-gate Stop-hook adapter is deferred to the staged harness-integration work (`HARNESS_INTEGRATION.md` deep-mapping), not shipped here — the canonical loop stays harness-agnostic Markdown.
## 2026-06-14 - Spec & Design phase: core, two-gate, model-agnostic, verifier-driven

**Status:** Accepted.

**Context:** Discipline gated *what gets built* (the funding/accept gate) and *how hygiene is kept* (the cleanup gate), but had nothing between a decision-to-build and an implementer. A funded idea or accepted ticket is a business case, not a buildable contract — handed straight to an executor, especially an unattended local model, it resolves every unstated decision in the most generic, usually-wrong direction. The verifier-driven insight is that **the spec is the verifier**: an ambiguous spec doesn't produce ambiguous output, it produces confidently-wrong output that passes its own checks. So the human-judgment chokepoint belongs at the spec, not the output.

**Decision:** Add a **core** Spec & Design phase: `SPEC_WORKFLOW.md` (the phase definition) + `SPEC.md` / `BUILD_PLAN.md` templates + the `SPEC_ARCHITECT` role + four spec-phase lint rules. Two stages, two verbatim gates (`SPEC_APPROVED` locks a plain-English functional spec; `BUILD_PLAN_APPROVED` locks the technical plan + queue-ready stories + verifier suite). A first-prompt interaction tier (Express / Guided / Thorough[default] / Exhaustive) configures how much the human is consulted. Everything is model-agnostic — written for local LLM / ChatGPT / Claude, with tier routing (Frontier / Workhorse / Recon), never a vendor-specific "plan mode" dependency.

**Core, not optional (decided 2026-06-14, same day):** the phase ships in the default `discipline init` — promoting the templates into Core (8 → 11) and the role into the core set (5 → 6). The anti-completeness thesis is about not shipping *niche, project-specific* scaffolding by default (API_REFERENCE for a project with no API, ASSETS for one with no assets). The Spec & Design phase is the opposite: it is general — every project that builds anything benefits — and load-bearing — you don't get good output without a good spec, and getting you there is the framework's whole point. That makes it a workflow, not an add-on. The earlier same-day instinct to ship it opt-in was wrong on exactly this distinction.

**Consequences:**

- **Core templates 8 → 11, core roles 5 → 6.** `discipline init` now scaffolds `SPEC_WORKFLOW.md` + `SPEC.md` + `BUILD_PLAN.md` and the `SPEC_ARCHITECT` role by default. The shipped `SPEC.md` / `BUILD_PLAN.md` templates are lint-clean by construction (tagged requirements, acceptance-covered, dep-marked stories) so a fresh init passes the spec-phase rules.
- **The verifier suite makes unattended local execution safe** — it is the ground truth a weak executor cannot fake. This is why every requirement must be checkable; the discipline exists to serve the suite.
- **The four spec-phase lint rules now run for every adopter** (the files always exist), not just those who opted in — the gate is enforced by default, consistent with making it core.
- Candidate for wider promotion via the `PLAYBOOK_FEEDBACK` path once it has shipped and been verified here.

## 2026-05-24 - Self-improvement loop: close it, and let it subtract

**Status:** Accepted.

**Context:** Discipline already captured workflow-improvement proposals (`PLAYBOOK_FEEDBACK.md`), ran an empirical tier-routing loop (`AGENT_TRACKER.md`), and had a promotion path (`CROSS_REPO_SYNC` + `PROMOTE_TO_FRAMEWORK_APPROVED`). But the workflow side was an *inbox*, not a *loop*: it captured and applied, yet nothing verified whether an applied change actually reduced the friction it claimed, nothing systematically retired stale rules, and nothing aggregated friction across the products the framework builds. For an anti-rot framework, a one-directional "always adds guidance" loop is the exact failure mode it exists to prevent.

**Decision:** Close the loop across four existing surfaces. No new templates or roles — the Core 8 / Optional 14 split and the five-role lean set are unchanged.

1. **Effect-verification** (`PLAYBOOK_FEEDBACK.md` + `AGENTS.md` lifecycle) — applied entries record the friction they were meant to kill; a later session verifies it's gone or re-proposes removal.
2. **Rule-retirement** (`DOC_AUDIT` role) — "does each convention still earn its place?" is a first-class finding; pruning is co-equal with adding.
3. **Product-outcome retro** (`AUTONOMOUS_QUEUE.md`) — a recurring, `[autonomy: review]` pass that checks shipped product work against the pitch's success metrics + kill criteria and routes to TODO or a `STAKEHOLDER` re-pitch/kill.
4. **Cross-product harvest** (`CROSS_REPO_SYNC`) — a recurring pass that promotes (or retires) framework defaults based on friction recurring across ≥2–3 products, gated by `HARVEST_APPROVED` / `PROMOTE_TO_FRAMEWORK_APPROVED`.

**Consequences:**

- The loop can now subtract, not only add — every mechanism above can recommend *removing* guidance. This is the anti-completeness thesis applied to the loop itself.
- The additions are edits to existing files; role and template counts do not grow.
- #3 and #4 are opt-in (a recurring queue entry; a gated harvest), so projects that don't want the overhead don't pay it.
- Candidate for wider promotion via the `PLAYBOOK_FEEDBACK` path once it has shipped and been verified here.

## 2026-06-14 - MIT license (relicensed from Apache-2.0)

**Status:** Accepted.

**Context:** Discipline is published as OSS for wide adoption. It's mostly Markdown templates plus a small zero-dependency CLI — there's no patentable invention and no patent surface — so Apache-2.0's patent-grant machinery buys little here, while MIT's simplicity lowers adoption friction. (The earlier Apache-2.0 choice is superseded before any public release.)

**Decision:** MIT license. Copyright John Hardy, 2026.

**Consequences:**

- Adopters can use, modify, and distribute Discipline freely; the copyright notice must be preserved (keeps the author's attribution).
- Simplest, most familiar permissive license; no `NOTICE` file required (the root `NOTICE` was removed).
- Commercial use is permitted.

## 2026-05-09 - Core 8 vs Optional template split

**Status:** Accepted.

**Context:** An honest audit on 2026-05-09 found the default template set carried ~30-40% bloat — 18+ templates, many of which projects don't need (API_REFERENCE.md, ASSETS.md, DATA_MODEL.md, etc.). Empty templates feel like TODO items.

**Decision:** `npx discipline init` ships 8 core templates by default (README, HANDOFF, AGENTS, PROJECT_CONTEXT, TODO, DECISIONS, ROADMAP, CHANGELOG). 14 optional templates available via `npx discipline add <name>`.

**Consequences:**

- Default scaffold is leaner; new projects feel less overwhelmed.
- Users opt-in to additional templates as their project grows into them (e.g. `add API_REFERENCE` once they have an API; `add DEPLOYMENT` once they're deploying).
- CLI maintains the explicit Core 8 / Optional 14 split in source — if a template moves between buckets in the future, that's a DECISIONS-worthy change.

## 2026-05-09 - Supervised-direct as default posture

**Status:** Accepted.

**Context:** The default posture had been coordinator-heavy. Honest measurement showed spawn overhead routinely exceeded task size for small/medium work; the default was wrong for solo and small-team work shapes.

**Decision:** Discipline ships with supervised-direct as the default posture. Coordinator-heavy is opt-in for genuine parallel fan-out, autonomous queue runs, multi-repo edits, and Frontier-tier subtasks.

**Consequences:**

- Default sessions are faster and less interruption-resistant.
- Coordinator-heavy still earns its keep where it earns it (the 20% case).
- Adopting projects can opt back into coordinator-heavy via Local Overrides in their own `docs/AGENTS.md` if they prefer.

## 2026-05-09 - Five-role lean subagent set

**Status:** Accepted.

**Context:** The role set had 11 named subagent roles. An honest audit found heavy overlap: `recon` and `doc-audit` overlapped, `planner` and `architect` overlapped, `*-impact` roles were too narrow.

**Decision:** Discipline ships with 5 core subagent roles: `recon`, `planner`, `debugger`, `security-reviewer`, `cross-repo-sync`. Retired roles documented as collapsed-into or replaced-by patterns.

**Consequences:**

- Smaller default cognitive load when picking which role to spawn.
- Project-specific Frontier roles still available via `docs/agents/<ROLE>.md` (e.g. `compliance-review`, `puzzle-design`).
- The framework reference template was updated the same day; this decision applies to Discipline itself and is the canonical position for OSS Discipline going forward.

## 2026-05-09 - Launch posture: quiet OSS publication over marketing-first

**Status:** Accepted.

**Context:** An earlier same-day draft proposed a marketing-first launch (an essay as a validation gate before shipping the OSS). That approach was reconsidered: the framework thesis is best demonstrated by the artifact itself — the OSS repo, the CLI, the opinions baked into the templates — rather than by a marketing campaign ahead of real-world usage.

**Decision:** Ship the OSS framework immediately, without a marketing campaign. Let the artifact speak for itself and accumulate genuine usage before any active promotion.

**Consequences:**

- Active maintainership of Discipline is the meta-validation: if the framework cannot sustain itself on real projects, the thesis is wrong and the project winds down gracefully.
- Promotion decisions are deferred until authentic experience with the framework accumulates.
