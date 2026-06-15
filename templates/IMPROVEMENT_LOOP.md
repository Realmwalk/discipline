<!--
  Discipline optional template. Install with: npx discipline-md add IMPROVEMENT_LOOP
  Pairs with VERIFICATION_GATE.md (the ground-truth signal the loop is built on).
  This is a COLD-PATH doc — read it when running or wiring the loop, not every session.
-->

# Improvement Loop

A closed, recursive loop that uses AI subagents to **discover → execute → verify → evaluate → integrate → repeat** on this project. The recursion is that the discovery phase re-runs on the now-improved system, so the loop generates its own next work-list instead of waiting for a human to hand-write one.

This doc is mostly **composition, not new machinery** — the loop wires together Discipline primitives you already have:

- `AUTONOMOUS_QUEUE.md` — the work-list (discovery output / execution input).
- autonomy tags (`[autonomy: safe|review|needs-human-collab]`) + the curated queue — the two-gate human-judgment control.
- `DECISIONS.md` / `OPEN_DECISIONS.md` — judgment record + the inbox where the loop parks decisions it isn't allowed to make.
- `CHANGELOG.md` — completed work.
- `PLAYBOOK_FEEDBACK.md` — where the loop proposes improvements to *itself* (meta-recursion).
- the role roster in `AGENTS.md` / `agents/*` — `RECON` fans out for discovery; `SECURITY_REVIEWER` / `TEST_STRATEGIST` / `DEBUGGER` for adversarial evaluation. **The loop adds no new roles.**

The **one genuinely new primitive** is `VERIFICATION_GATE.md` — the machine-checkable ground-truth signal. Without it the loop optimizes "sounds done" instead of "is done" and silently rots. **Do not run the loop on any step that has no verification gate** — that step is judgment, not execution; escalate it.

## The two non-negotiables

1. **A ground-truth gate** (`VERIFICATION_GATE.md`). Every iteration must prove itself against a signal a human didn't generate — compile/test/run, an eval suite, a reproduction harness. The gate is what catches the agents' *own* mistakes (a fix that breaks a test, a "done" that doesn't build). No gate → no loop.
2. **Human judgment gates.** The loop is only allowed to act where (1) exists; every consequential, taste-dependent, or hard-to-reverse fork escalates to `OPEN_DECISIONS.md` and stops. Automate execution and adversarial evaluation; keep humans on *what's worth doing*.

## The cycle

```
1. DISCOVER  fan out read-only RECON agents across dimensions (correctness /
             lifetime / UX / robustness / security). Each returns STRUCTURED
             findings (severity, location, fix-sketch, confidence). Dedup →
             append to AUTONOMOUS_QUEUE.md with honest autonomy tags.

2. SELECT    take the highest-severity items tagged [autonomy: safe] that are
             also IN the queue (two-gate). Anything [needs-human-collab] →
             OPEN_DECISIONS.md and STOP that item.

3. EXECUTE   fan out implementation agents. Disjoint files run in parallel
             (worktrees if they'd conflict); shared files run serially.

4. GATE      run VERIFICATION_GATE. FAIL → loop-fix → re-gate (inner loop)
             until green. Never trust an agent's "done" — re-run the gate.

5. EVALUATE  fan out adversarial reviewers prompted to REFUTE the change
             (multiple lenses, confidence vote). New findings → back to the
             queue. The reviewer is NEVER the agent that wrote the code.

6. INTEGRATE commit; delete shipped items from TODO/queue and log them in
             CHANGELOG (cleanup gate); record durable choices in DECISIONS.

7. CONVERGE  repeat from 1. Stop when a DISCOVER pass is "dry" (K consecutive
             rounds with no new finding above the severity floor) OR a budget /
             iteration cap is hit OR the only remaining items are judgment.

8. REFLECT   propose improvements to the loop's OWN contracts via
             PLAYBOOK_FEEDBACK.md — human-reviewed, never auto-applied.
```

Stages 1→7 are the object-level recursion (the improved system gets re-scanned). Stage 8 is the meta-recursion (the framework improving how it improves). All loop state lives in the Markdown ledgers, so the loop is inspectable, diffable, and resumable from any point.

## Tier routing (see `AGENTS.md`)

- **DISCOVER / EVALUATE** read-only fan-out → **Recon** tier (cheap, broad). Bound expensive spend to where it pays.
- **EXECUTE** → **Workhorse** tier.
- **Architecture decisions, security-sensitive fixes, the verification-gate design itself** → **Frontier** tier.

The host stays at Workhorse and spawns Frontier subagents only for the hard subtask — never run the whole loop at Frontier tier.

## Convergence rules

- **Loop-until-dry, not fixed-N.** A simple "do 5 rounds" misses the tail; a single round misses the recursion. Stop after K consecutive empty DISCOVER passes (K=2 is a sane default).
- **Severity floor.** Only spend EXECUTE tokens on findings above a bar; log + defer the rest so cheap discovery is most of the cost, not expensive fix-fanout.
- **Hard budget cap.** A token/iteration ceiling the loop cannot exceed — the runaway backstop.
- **No silent truncation.** If the loop caps coverage (top-N, sampling, deferred items), it must LOG what it dropped. "Covered everything" must never quietly mean "covered the easy 80%."

## Failure modes this loop is designed against

- **Reward hacking** — optimizing the gate instead of the goal (deletes the failing test rather than fixing the bug). Mitigation: gate on *behavior / reproduction*, not self-reported success; a separate adversary confirms the fix is real; spot-check.
- **Drift** — wandering from intent over many iterations. Mitigation: re-state the goal + constraints in each iteration's context; a completeness-critic pass ("are we still solving the original problem?"); human re-anchoring at chapter boundaries.
- **"Looks done but isn't"** — the most common one. Mitigation: re-run the gate every iteration; an agent's "done" is intent, not proof.
- **Compounding error** — small mistakes amplify across rounds. Mitigation: gate every iteration (not every N); keep iterations small/atomic; isolate parallel work.
- **Cost runaway** — fan-out × loops. Mitigation: the convergence rules above; run on a cadence (manual or scheduled), not always-on.

## Running it

Harness-agnostic: the host follows the cycle above, using the roster in `AGENTS.md` for fan-out and `VERIFICATION_GATE.md` for the gate. For a Claude Code convenience wrapper (a `/improve-loop` skill + a cleanup-gate Stop hook), see `HARNESS_INTEGRATION.md` "deep mapping" — opt-in, adoption-gated, never required.

## Stop conditions (hand back to the human)

- A DISCOVER finding implies a scope/product change beyond the funded spec → `OPEN_DECISIONS.md`.
- A fix needs a design decision with no ground-truth answer → `OPEN_DECISIONS.md`.
- The verification gate itself is unreliable or missing for a needed step → fix the gate first; do not loop without it.
- Discovery keeps outpacing execution → surface to the stakeholder for a re-pitch.

## Inputs

- `AUTONOMOUS_QUEUE.md`, `TODO.md`, `PROJECT_CONTEXT.md`, `DECISIONS.md`, the role roster.
- `VERIFICATION_GATE.md` (required).

## Outputs

- A refilled, prioritized queue; shipped fixes logged in `CHANGELOG.md`; judgment forks parked in `OPEN_DECISIONS.md`; loop-self-improvements proposed in `PLAYBOOK_FEEDBACK.md`.
