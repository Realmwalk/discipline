# Build Plan: <product name>

<!--
  Stage B output of the Spec & Design phase (see SPEC_WORKFLOW.md). Turns the
  LOCKED functional spec (SPEC.md, already SPEC_APPROVED) into the HOW: stack
  chosen through explicit tradeoffs, architecture, and queue-ready stories.

  This file is LOCKED by the verbatim token BUILD_PLAN_APPROVED. The Build
  phase (queue execution) does not begin until it lands.
-->

**Status:** Draft — awaiting `BUILD_PLAN_APPROVED`
**Spec:** [`SPEC.md`](SPEC.md) — locked at `SPEC_APPROVED`
**Architecture:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
**Last updated:** <YYYY-MM-DD>

## Stack Decisions

<!--
  One subsection per engineering fork the human weighed. Surface each as an
  enumerated decision with options + pros/cons; record the chosen option and
  the one-line reason. Depth follows the SPEC.md interaction tier.
-->

### <Decision, e.g. "Datastore">

| Option | Pros | Cons |
|---|---|---|
| <option A> | <pros> | <cons> |
| <option B> | <pros> | <cons> |

**Chosen:** <option> — <one-line reason>.

## Stories

<!--
  The spec decomposed into implementation tasks, ready for AUTONOMOUS_QUEUE.md.
  Each story:
    - [id: S-NN]            stable id
    - satisfies: R#, R#     the SPEC.md requirement(s) it implements
    - [dep: none]           parallel-safe — OR — [dep: S-01, S-02] serial
    - standard tags         [size:][risk:][autonomy:] — see AGENTS.md
    - acceptance            the [AUTO] check or [HUMAN] checklist line

  The [dep:] markers ARE the build schedule: everything [dep: none] runs in
  parallel; a [dep: S-xx] story waits for its predecessors.
-->

### S-01 — <story title>

- **satisfies:** R1, R2
- `[dep: none]` `[size: S]` `[risk: low]` `[autonomy: safe]`
- **acceptance:** <the runnable check, or the human checklist line>

### S-02 — <story title>

- **satisfies:** R3
- `[dep: S-01]` `[size: M]` `[risk: med]` `[autonomy: review]`
- **acceptance:** <the runnable check, or the human checklist line>

## Verifier Suite

<!--
  Generated from the locked spec's Acceptance Tests. One runnable check per
  [AUTO] requirement (references the requirement number); a single runner that
  reports pass/fail per requirement and exits non-zero on any failure.

  Fallback when the stack has no natural test runner: best-effort runner the
  stack DOES support (build succeeds, schema validates, links resolve, headless
  smoke) + route the rest to the Human Checklist. Log what got pushed to human.
-->

- **Runner:** <command that runs all checks and exits non-zero on failure, e.g. `pnpm test`>
- **R1** `[AUTO]` → <check + where it lives, e.g. `tests/r1.spec.ts`>
- **R2** `[AUTO]` → <check>
- **Pushed to Human Checklist (no automated check available):** <list, with why>

## Human Checklist

<Carried from SPEC.md plus anything the verifier couldn't automate. This is the
reviewer's entire post-build surface — the [AUTO] half is trusted once green.>

- [ ] **R3** — <the specific thing to confirm>

## Open Questions

<Anything still needing a human call before BUILD_PLAN_APPROVED.>

- <open question>
