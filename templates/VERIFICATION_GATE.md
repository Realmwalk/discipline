<!--
  Discipline optional template. Install with: npx discipline add VERIFICATION_GATE
  The ground-truth signal the Improvement Loop is built on (see IMPROVEMENT_LOOP.md).
  Fill the <placeholders> with THIS project's real, runnable commands.
  COLD-PATH doc — read it when verifying work or running the loop.
-->

# Verification Gate

The machine-checkable signal that proves a change is **actually** good — not "looks done." Every autonomous iteration must pass this gate before it counts as done. The gate is the single thing that keeps an AI improvement loop honest: it catches the agents' own mistakes (a fix that breaks a test, a "done" that doesn't compile, a change that regresses behavior) that review alone misses.

**Rule:** no `TODO`/`AUTONOMOUS_QUEUE` item is done until the gate passes. On failure, loop-fix and re-run — do not mark done, do not commit, do not advance the loop. An agent's "done" is intent; the gate is proof.

## The signal for this project

Concrete, runnable, deterministic. Fill these in — vague gates ("looks right") are not gates.

```bash
# Build / typecheck — must exit 0
<e.g. pnpm run build   |   cmake --build build --target <target>>

# Tests — must report 0 failures
<e.g. pnpm test   |   ./run-tests   |   pytest -q>

# Smoke / reproduction — the change must actually run / the bug must actually be gone
<e.g. launch the app and assert <observable>   |   the failing repro now passes>

# Lint / format (optional, but cheap)
<e.g. pnpm run lint>
```

**Expected pass criteria:** <state the exact success condition, e.g. "build exit 0; N/N tests pass; standalone launches and closes < 2s; no new lint errors">.

## Gate layers (use the strongest ones available)

Prefer signals closest to real behavior — they're hardest to game:

1. **Compile / typecheck** — catches the "doesn't build" class outright.
2. **Tests** — unit + integration. A change that needs a test deleted/weakened to pass is a red flag, not a pass.
3. **Reproduction harness** — for a bug fix, the strongest gate is *the bug actually reproduced before and is gone after*. Build the repro; it's the highest-leverage thing here.
4. **Eval suite / golden set** — for behavior/quality changes a binary build can't judge: a labeled set + a metric computed without a human.
5. **Adversarial review** — only where 1–4 can't reach. A SEPARATE reviewer (never the author) prompted to *refute*, multi-lens, confidence vote. Subjective sign-off by the author is not a gate.

## Anti-gaming rules

- Gate on **behavior / reproduction**, not self-report. "The agent said it's fixed" is not a signal.
- A fix that **disables, weakens, or deletes a test/assertion** to go green is presumed a regression — require justification and a separate adversary's confirmation.
- **No silent gate-narrowing.** If coverage is reduced (skipped suite, sampled inputs, `--no-verify`), it must be LOGGED. A quietly narrowed gate reads as "passing" when it isn't.
- If a step has **no possible automated gate**, it is **judgment, not execution** — route it to `OPEN_DECISIONS.md`; do not let the loop "verify" it by vibes.

## Wiring to the harness

- **Required step:** the Improvement Loop's GATE stage runs these commands and reads the result.
- **Optional enforcement (Claude Code):** a Stop / pre-commit hook in `.claude/settings.json` that runs the gate and blocks completion on failure — so it can't be skipped. See `HARNESS_INTEGRATION.md`.
- Keep the gate **fast**: if it takes too long, agents (and humans) skip it. Split a slow full-suite gate into a fast per-change gate + a slower nightly gate.

## Maintenance (anti-rot)

- The gate must track the project. A test that's been skipped for months, a build target that no longer exists, or a repro that no longer reproduces is a **broken gate** — fix it before trusting the loop, or the loop verifies against nothing.
- When the project's build/test commands change, update this file in the same commit (doc-sync rule).

## Inputs

- This project's build/test/run tooling.

## Outputs

- A pass/fail signal consumed by the Improvement Loop GATE stage; a logged record of any deliberately narrowed coverage.
