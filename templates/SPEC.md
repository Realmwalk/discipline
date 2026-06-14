# Functional Spec: <product name>

<!--
  Stage A output of the Spec & Design phase (see SPEC_WORKFLOW.md).
  ENTIRELY PLAIN ENGLISH. No tech choices, no stack, no libraries — those
  belong in BUILD_PLAN.md (Stage B). A non-engineer must be able to read
  this and recognize their product.

  Every requirement is tagged [AUTO] (a machine can check it) or [HUMAN]
  (needs human judgment). Every requirement is testable — if you can't say
  how it would be verified, rewrite it or tag it [HUMAN].

  This file is LOCKED by the verbatim token SPEC_APPROVED. Stage B does not
  begin until it lands.
-->

**Status:** Draft — awaiting `SPEC_APPROVED`
**Interaction tier:** Thorough  <!-- Express | Guided | Thorough | Exhaustive — set at first prompt -->
**Last updated:** <YYYY-MM-DD>

## Goal

<One or two sentences. What "done" looks like for this product, in plain English.>

## Context / Inputs

<What already exists, what's provided, the relevant constraints. For a funded
pitch, link it: `docs/pitches/<status>/<PRODUCT>.md`.>

## Screens / Pages

<One subsection per screen. A reader should be able to picture the product
from this section alone.>

### <Screen name>

- **Purpose:** <what this screen is for, who reaches it and how>
- **Controls:** <every button / input / menu / tool on it, and what each one does>
- **States:** <empty / loading / error / populated / max — what the user sees in each>

## Requirements

<!--
  Numbered. Each tagged [AUTO] or [HUMAN]. Each phrased as an observable,
  checkable condition: "<thing> MUST <condition>".
-->

- **R1** `[AUTO]` <thing> MUST <observable, checkable condition>.
- **R2** `[AUTO]` <thing> MUST <observable, checkable condition>.
- **R3** `[HUMAN]` <thing that needs judgment, e.g. "the onboarding copy reads warmly">.

## User Flows

<The paths through the product. For each: the steps, the state transitions,
and what success looks like at the end.>

1. **<Flow name>:** <step → step → step → success condition>

## Boundaries & Edge Cases

<Explicit behavior at the limits and on bad input — this is where most spec
failures hide.>

- **Empty / zero / none:** <behavior>
- **Maximum / overflow:** <behavior>
- **Malformed / invalid input:** <behavior>
- **Conflict resolution:** <when requirement X and Y disagree, X wins because …>

## Out of Scope

<What this deliberately does NOT do. The highest-leverage section — it is what
stops scope creep at build time. Be specific; "for now" items go here too.>

- <explicitly excluded capability>

## Assumptions

<Everything the spec takes for granted. An executor resolves unstated
assumptions in the most generic direction — so state them and have the human
confirm or correct each one.>

- <assumption the human should confirm>

## Acceptance Tests

<For each [AUTO] requirement, the concrete check that proves it. These become
the verifier suite generated in Stage B. Reference the requirement number.>

- **R1** → <the check: unit test / schema validation / round-trip / headless smoke / shell check that passes iff R1 holds>
- **R2** → <the check>

## Human Checklist

<For each [HUMAN] requirement, the specific thing the reviewer confirms after
the build. This plus anything the runner flags is the entire post-build review
surface.>

- [ ] **R3** — <the specific thing to confirm>

## Open Questions

<Anything the red-team pass surfaced that needs a human decision before
SPEC_APPROVED. Resolve these; do not paper over them with a default.>

- <open question awaiting a human call>
