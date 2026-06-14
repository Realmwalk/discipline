# Playbook Feedback

Staging file for proposed improvements to the project's workflow docs (`docs/AGENTS.md`, `docs/HANDOFF.md`, `docs/TODO.md` conventions, completion gate, etc.) and for proposed promotions of project-local patterns to the framework template at `the framework's canonical templates/`.

This file is the **inbox** between "the agent noticed something" and "the canonical doc gets edited." Direct edits to AGENTS / HANDOFF / etc. without going through this file skip the user review gate.

See `docs/AGENTS.md` (Playbook Improvement Loop section) for the full lifecycle.

## Workflow-impact discipline (hard rule)

**Do not propose changes just to check a box.** Improvement-theater is the failure mode — adding aspirational language because language is easy. Stale aspirational guidance is worse than absent guidance.

A proposal must satisfy at least one of:

1. **A real friction point in this session would have been prevented or reduced** by the change.
2. **A real friction point is foreseeable in upcoming work** and the change prevents it.
3. **A pattern showed up multiple times** and is worth codifying so future agents don't re-derive it.
4. **A subagent role's contract had to be bent** to fit a real situation, suggesting the contract needs tuning.

If none of these apply, do not propose. Note the observation in your end-of-session summary if useful, but do not add it here.

## Two kinds of proposal

- **Local improvements** — edits to project-local docs (this repo's `AGENTS.md`, `HANDOFF.md`, TODO conventions, completion gate, etc.). Most proposals are local.
- **Template promotions** — a pattern that started project-local has proved general enough to push back to `the framework's canonical templates/`. Higher bar: the pattern should have shipped at least once in this project and demonstrably worked. Don't promote untested ideas.

## Lifecycle

1. **Propose** — agent adds an entry below under Proposed Local Improvements or Proposed Template Promotions, with rationale + the specific friction point that motivated it.
2. **Review** — user reads the proposal, accepts / rejects / asks for revision.
3. **Apply** — on accept, agent edits the canonical doc (project-local AGENTS/HANDOFF/etc., or framework template), adds a `docs/CHANGELOG.md` entry, moves the PLAYBOOK_FEEDBACK entry to "Applied (recent)" **with the friction it was meant to kill recorded inline** (so a later session can check whether it actually worked).
4. **Trim** — once the CHANGELOG entry exists, the "Applied (recent)" entry can be deleted from this file on the next cleanup pass.
5. **Verify (closes the loop — later, not the same session)** — the next session that works in the changed area checks whether the recorded friction is actually gone. Gone → the change earned its keep; let it stand. The rule is being ignored, worked around, or the friction recurs → that is improvement-theater surfacing late: propose the rule's *removal* or revision. A loop that only ever adds guidance becomes the rot it was built to prevent; this step is what lets it subtract.

Rejected proposals get a brief one-line note under "Rejected (recent)" so the same idea does not get re-proposed by a future session.

## Proposed Local Improvements

<!--
Format:
### YYYY-MM-DD — Short title

**Trigger:** the friction point or pattern that motivated this proposal. Be specific.
**Proposed change:** exact edit (which doc, what wording).
**Workflow impact:** what would change for next session if this lands.
**Tier:** small / medium / large (rough effort to write up).
-->

(none yet)

## Proposed Template Promotions

<!--
Format:
### YYYY-MM-DD — Short title

**Project pattern:** the project-local doc/section that has proved its worth.
**Track record:** what specifically demonstrated the pattern works (sessions / commits / measurable improvement).
**Proposed promotion:** exact edit to the framework template (file path under `the framework's canonical templates/`).
**Generality check:** would another project (different domain) benefit from this without modification?
-->

(none yet)

## Applied (recent)

<!--
Once a proposal is approved and the canonical doc is edited + CHANGELOG entry added, move the entry here briefly. Trim on the next cleanup pass once CHANGELOG covers it.

### YYYY-MM-DD — Short title (applied)
**Friction it killed:** the specific friction this change was meant to remove (carried over from the proposal's Trigger).
**Verify by:** the next session that touches <area/doc> — confirm the friction is gone (let it stand) or recurring (re-propose removal/revision per Lifecycle step 5).
Brief note + CHANGELOG date reference.
-->

(none yet)

## Rejected (recent)

<!--
Brief note so future agents don't re-propose the same idea.

### YYYY-MM-DD — Short title (rejected)
One-line reason the user rejected.
-->

(none yet)
