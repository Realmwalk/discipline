# Open Decisions

Staging file for design or product decisions that block active work and need user input before implementation can proceed. Sits between "a decision arose during a session" and "the decision is recorded in `docs/DECISIONS.md`" (durable architecture) or folded into a `docs/TODO.md` entry (implementation detail).

When this file holds only the heading, the project is unblocked.

## When to add an entry

- A paired session with the user produced a concrete question that needs an answer before the next session can ship its work.
- An autonomous run hit a fork in the road that required user judgment beyond the autonomy gate (`[autonomy: needs-human-collab]` work).
- An ambiguity surfaced that, if resolved by the agent unilaterally, would lock in an architectural choice the user should make.

## When NOT to add an entry

- Implementation details that don't change observable behavior — pick the cleanest option and note it in the relevant TODO.
- Trivial decisions where the user has already given a directive in conversation — write the answer directly into the affected doc / code.
- Speculative "we might want to think about X someday" entries that aren't blocking active work — those belong in `docs/ROADMAP.md` or the relevant TODO.
- Wording or formatting preferences — pick one and move on.

The file is a staging inbox, not a wishlist. Bloat here makes it useless as a blocker surface.

## When to remove an entry

Remove the entry once the user has answered AND the answer has been folded into:

- `docs/DECISIONS.md` if the decision is durable architecture worth recording for future maintainers.
- The relevant `docs/TODO.md` entry if it's an implementation detail.
- The kickoff prompt for the next session if it's session-scoped guidance.

Don't leave answered entries here as a log — that's what `docs/CHANGELOG.md` and `docs/DECISIONS.md` are for.

## Format

Each entry follows this template. Numbering is project-defined — match prior conversation references where possible so the user can trace decisions back to the discussion that surfaced them.

```markdown
### #N. Short title

**Context**: brief statement of why this is blocking and what work is gated on it.

**Options**:
- (a) Option A.
- (b) Option B.

**Recommendation**: (X) — short reason.

**Asymmetry** (optional): what the worst case looks like if the user picks differently.

> **Your answer**: 
```

Group entries by topic (Operational, [feature area], etc.) when more than ~6 are open at once. Use letters (`A`, `B`, ...) for cross-cutting operational decisions and numbers (`#11`, `#12`, ...) for feature-area decisions if the project benefits from the distinction.

## Open decisions

*(empty — add entries here as they arise.)*

## Notes

- This file is project-local. Patterns that prove themselves cross-project should be promoted into the framework template via the playbook improvement loop (`docs/PLAYBOOK_FEEDBACK.md`).
- If an entry has been open for >2 weeks without movement, surface it to the user explicitly rather than letting it fossilize. Stale blockers are worse than visible blockers.
