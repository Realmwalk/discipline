# Spec & Design Phase

**The most expensive thing an agent builds is the wrong thing, built correctly.**

This is the phase that sits between *deciding to build* and *building*. It exists because a funded idea (or an accepted ticket, or a one-line request) is a **business case, not a buildable contract**. Hand that directly to an implementer — especially an unattended one — and it resolves every unstated decision in the most generic, usually wrong, direction. The Spec & Design phase front-loads the human judgment so the build is mechanical.

> **Front-load the judgment.** A wrong spec executed flawlessly is still wrong, and a verifier-driven build is the one thing downstream that *cannot* catch it. So the design decisions concentrate here, where a human is in the loop — not at build time, where they aren't.

This doc is harness-agnostic and **model-agnostic**: it is written to be run by a local LLM, ChatGPT/Codex, or Claude, under any of the runtime patterns in [`AGENTS.md`](AGENTS.md). Where a step benefits from a stronger model, that is a tier note (Frontier / Workhorse / Recon), never a vendor name.

---

## Where it sits

```
Idea / request / funded pitch
        │
        ▼
   ┌─────────────────────────── Spec & Design ───────────────────────────┐
   │                                                                      │
   │  Stage A — Functional Spec (plain English)  ──►  SPEC_APPROVED       │
   │  Stage B — Technical Plan (stack + stories) ──►  BUILD_PLAN_APPROVED │
   │                                                                      │
   └──────────────────────────────────────────────────────────────────────┘
        │
        ▼
   Build (autonomous queue, parallel except serial deps)
```

Two stages, two gates, in order. **Neither gate is skippable and neither is inferred** — each opens only on its verbatim approval token (see Gates). The phase has an explicit predecessor gate too: in a Founder/venture flow it runs *after* `FUNDING_APPROVED`; in a plain ticket flow it runs after the work is accepted. It never runs speculatively against an unapproved idea.

---

## The first prompt: pick an interaction tier

The very first thing the Spec Architect does is ask the human **how much they want to be involved**. This is a dial, set once at the top of Stage A, recorded in the spec header, and overridable mid-flight ("go deeper here", "stop asking, infer the rest").

| Tier | The Architect… | Use when |
|---|---|---|
| **Express** | infers almost everything; asks only true blockers (decisions it genuinely cannot make and cannot safely default). | the build is small, conventional, or you trust the defaults and want speed. |
| **Guided** | asks a structured tradeoff question at each *major* decision (page grouping, key flows, the load-bearing stack picks); infers the routine. | a normal build where you want a say on the forks that matter. |
| **Thorough** *(default)* | Guided, plus screen-by-screen and data-model confirmation before locking. | most real products — especially anything an unattended local model will execute, where more pinned down up front means fewer wrong guesses at build time. |
| **Exhaustive** | confirms essentially every choice; nothing material is inferred silently. | high-stakes, novel, or compliance-sensitive work; or when you simply want to co-design every detail. |

**Default is Thorough.** The default is deliberately *not* Express: under-specification is cheap to fix in this phase (one more question) and expensive to fix at build time (a wrong artifact, possibly merged unattended). When unsure, ask one more question.

Record the chosen tier in the spec: `Interaction tier: Thorough`.

---

## Stage A — Functional Spec (plain English)

**Posture: read-only design.** The Architect reads the codebase and context but writes only the spec — no implementation, no dependencies, no scaffolding. Express this however the harness allows: Claude Code *plan mode*, ChatGPT/Codex *plan*, or, on a bare local setup, simply the convention "this turn produces a spec, not code." The mechanism varies; the **read-only contract does not**.

**Output: `SPEC.md` — entirely plain English about the app and how it behaves.** No tech choices live here. A non-technical stakeholder must be able to read it and recognize their product. It covers:

- **Every page / screen / view** — what it is, what it's for, how the user reaches it.
- **Every control** — buttons, inputs, menus, tools, gestures — and what each one *does*.
- **Every user flow** — the paths through the product, the states a user moves between, what success looks like at each step.
- **The negative space** (where most spec failures hide — absences, not wrong statements):
  - boundary behavior — empty, max, zero, overflow, malformed input;
  - what is explicitly **out of scope** (the single highest-leverage section — it's what stops scope creep at build time);
  - what happens when two requirements **conflict**, and which one wins;
  - **assumptions** the spec is making (an executor resolves every unstated assumption, usually wrongly — so state them and have the human confirm).

### The spec is the verifier

Every requirement must be **checkable**. If you can't state how a requirement would be verified, it is not a requirement yet — rewrite it until it's testable, or tag it human-judgment-only. Prefer `<thing> MUST <observable, checkable condition>` over `<thing> should be clean / fast / good`.

Tag every requirement:

- **`[AUTO]`** — a machine can check it (compiles, test passes, schema matches, output round-trips, numeric tolerance met, link resolves, element present).
- **`[HUMAN]`** — needs human judgment; no automatic verifier exists ("the copy reads well", "the legal interpretation is sound").

More compute makes `[AUTO]` requirements bulletproof and makes `[HUMAN]` requirements only more *confident*, never more *correct*. The `[HUMAN]` list is precisely the human reviewer's worklist after the build — everything else is trusted because it passed the suite.

### Red-team before locking

Before proposing `SPEC.md` for approval, the Architect attacks its own draft and resolves or surfaces each finding — never papers over a gap with a plausible default:

1. **Ambiguities** — what can be read two ways? Quote it; give both readings.
2. **Gaps** — what input / state / edge case is unhandled?
3. **Conflicts** — which pairs of requirements can't both hold?
4. **Hidden assumptions** — what does the spec rely on but not state?
5. **Unverifiable `[AUTO]` claims** — tagged checkable but actually aren't; this is exactly where confident-wrong output hides.

For high-stakes specs this red-team pass is worth **one Frontier-tier call** — the cheapest, highest-ROI step before any expensive build. (See Tier Routing.) Findings that need a human decision go to the spec's **Open Questions**; resolved ones fold into the requirements.

**Gate 1:** the human replies with the verbatim token **`SPEC_APPROVED`**. Nothing else opens it. Stage B does not begin until it lands.

---

## Stage B — Technical Plan ("plan mode")

Now, and only now, the design turns technical. Stage B converts the *what* (locked `SPEC.md`) into the *how*: an architecture, a stack chosen through explicit tradeoffs, and a backlog of stories ready to run unattended.

**Interactive tradeoff decisions.** This is where the human weighs the engineering forks — framework, datastore, hosting, key libraries, auth, the build-vs-buy calls. The Architect surfaces each as an **enumerated decision with options and their pros/cons**, recommends one, and lets the human pick. Express this with whatever structured-choice affordance the harness has; on a bare runtime, present it as a numbered list the human answers. The depth of this back-and-forth follows the interaction tier from Stage A.

**Outputs:**

1. **`ARCHITECTURE.md`** — the full intended build architecture **with a diagram** (Mermaid or equivalent that renders in-repo): component/module breakdown, data model, major data/control flows, external dependencies and integration points, deployment target, and the trust/operational boundaries (what holds user state, where the security surface is).
2. **Queue-ready stories** — the spec decomposed into implementation tasks, each one:
   - traced to the `SPEC.md` requirement number(s) it satisfies (`satisfies: R3, R7`);
   - carrying a stable id (`[id: S-04]`) and a dependency marker — **`[dep: none]`** (parallel-safe) or **`[dep: S-01, S-02]`** (serial; cannot start until those land);
   - tagged with the standard autonomy/size/risk tags (see [`AGENTS.md`](AGENTS.md));
   - carrying its own acceptance check (the `[AUTO]` test, or the `[HUMAN]` checklist line).

   These land in `AUTONOMOUS_QUEUE.md` (+ `TODO.md`) **ready to run, in parallel except where a `[dep:]` marker forces serial order.** The dependency graph *is* the build schedule.
3. **The verifier suite** — generated from the locked spec (next section).

**Gate 2:** the human replies with the verbatim token **`BUILD_PLAN_APPROVED`**. That opens the Build phase. Until then, no implementation, no installs, no queue execution.

---

## The verifier suite

Generated from the locked spec, the verifier suite is what makes an **unattended** build safe — it is the ground truth a weak or unsupervised executor cannot fake. (This is the whole reason the spec discipline above insists every requirement be checkable: a vague requirement produces a vague check, which passes confidently-wrong output.)

For each `[AUTO]` requirement, emit a runnable check — unit test, schema validator, numeric-tolerance assertion, round-trip assertion, headless smoke, or shell check — that passes **iff** the requirement holds, and that references the requirement number. Plus a single **runner** that executes all checks, reports pass/fail per requirement, and exits non-zero on any failure. The build loop (sampling / best-of-N / fix-and-recheck on a local executor; or a single supervised pass) iterates until the runner is green.

For each `[HUMAN]` requirement, emit a **checklist line** naming the specific thing to confirm. That checklist plus anything the runner flagged uncertain is the human's *entire* post-build review surface — the `[AUTO]` half is trusted because it passed.

**Fallback when the stack has no natural test runner** (static content site, audio plugin, design-only asset): generate the **best-effort runner** the stack *does* support — build succeeds, schema validates, links resolve, headless smoke loads — and route everything unautomatable to the `[HUMAN]` checklist. Always emit a runner; never block on "no tests possible." Log what got pushed to the human checklist so the unattended-execution gap is visible, not silent.

---

## Tier routing (model-agnostic)

The phase is designed to run cheap and verify hard. Route each step by tier (Frontier / Workhorse / Recon — see [`AGENTS.md`](AGENTS.md) for the cross-ecosystem mapping), not by vendor:

| Step | Tier | Why |
|---|---|---|
| Stage A — draft the functional spec | **Workhorse** (local-smart) | structured synthesis; cheap to iterate with the human. |
| Spec red-team pass | **Frontier** (one call) | adversarial gap-finding is the weak-model floor — weaker models soft-pedal the adversary role. Highest ROI in the whole phase. |
| Stage B — architecture & tradeoffs | **Workhorse**, escalate to **Frontier** for genuinely ambiguous architecture (a `DECISIONS.md`-worthy call). | most stack picks are routine; the hard fork is worth a Frontier subagent. |
| Generate the verifier suite | **Workhorse** | mechanical translation of `[AUTO]` requirements into checks. |
| Build executor (later phase) | **Recon / Workhorse** (local-fast), with sampling | runs against the verifier as ground truth; the suite, not the model, guarantees correctness. |
| Final `[HUMAN]`-review assist | **Frontier**, sparingly | judgment-heavy, low-volume. |

**Weak-model floor (hard rule):** the spec red-team, the verifier-coverage check, and any edit to a gate token or the queue's membership are **never run below Frontier tier unattended**. A Workhorse/Recon agent that hits one stops and surfaces it. (Mirrors the floor in `AGENTS.md`.)

---

## Gates (the two tokens)

Both tokens are matched **verbatim**, case-insensitively, ignoring surrounding whitespace and punctuation. Nothing else opens a gate — not paraphrase, not enthusiasm, not "looks good, ship it." If the human seems to approve but the token is absent, ask for the exact token; never infer it.

| Token | Locks | Opens |
|---|---|---|
| `SPEC_APPROVED` | the plain-English functional spec (Stage A) | Stage B |
| `BUILD_PLAN_APPROVED` | the technical plan + queued stories + verifier suite (Stage B) | Build |

In a Founder/venture flow these chain after the funding gate: `FUNDING_APPROVED` → `SPEC_APPROVED` → `BUILD_PLAN_APPROVED` → build. A project that wants different token spellings records that as a durable decision in `DECISIONS.md` before using them.

---

## Phase signals

Emit a visible signal at each stage boundary so a human watching an autonomous run knows where it is:

- `Specifying...` — drafting / iterating the Stage A functional spec.
- `Planning...` — Stage B architecture, tradeoffs, stories, verifier suite.

(These sit alongside whatever signals the surrounding workflow already uses, e.g. a Founder's `Scouting... / Pitching... / Building...`.)

---

## Why this shape

- **Plain-English spec first, tech second** keeps the human's judgment on *product* (which they own) separate from *engineering* (which they may delegate), and keeps `SPEC.md` reviewable by a non-engineer.
- **Two gates, not one** because approving *what to build* and approving *how to build it* are different decisions, often made at different confidence levels.
- **Stories carry their dependency graph** so the Build phase parallelizes correctly by construction — the plan, not the executor, decides what's serial.
- **The verifier suite is generated from the locked spec**, not written after the code, so the tests encode the *intended* behavior, not the *implemented* behavior. A test written from the code passes by definition; a test written from the spec can fail — which is the entire point.
