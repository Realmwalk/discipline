<!--
  TEMPLATE: AGENT_TRACKER.md (Tier B3 — empirical agent-outcome log)

  WHEN TO USE:
    - In any project that delegates work to multiple model tiers (Haiku / Sonnet / Opus
      or future equivalents) and wants tier-routing decisions backed by data, not vibes.
    - Pairs with an AGENTS.md / PLAYBOOK_FEEDBACK.md tier-routing doc — this file is
      the EVIDENCE; AGENTS.md is the POLICY derived from the evidence.

  HOW TO USE:
    1. Copy this file into the project's `docs/` directory as `AGENT_TRACKER.md`.
    2. Replace placeholder example rows under "Entries" with real attempts as they happen.
    3. Log immediately while context is hot — a half-day later the failure mode is
       already vague.
    4. Apply the Two-Failure Rule and the Three-Clean-Runs Graduation as written below.
    5. Do NOT clean up old entries — the historical record IS the value.
-->

# Agent Task Tracker

## Purpose

Empirical log of subagent task outcomes by **(model, task-type)**. The data
drives tier-routing decisions in `docs/AGENTS.md` (or the project's equivalent
policy doc) instead of being made on intuition. This file is the *evidence*;
the policy doc is the *conclusion drawn from the evidence*.

The tracker exists because the right tier for a task is empirical, not
predicted: a reasoning-heavy task that "should" take Opus may turn out to be
fine on Sonnet for THIS codebase, or a "simple" recon task may keep failing
on Haiku for THIS file layout. Without a record, every routing decision is a
fresh argument.

## What gets logged

- **Every clear failure** — hallucinated paths, incorrect output format,
  ignored constraints, fix-broke-tests, false-positive reports, runaway scope.
  Log immediately while context is hot.
- **Every experimental-scope task** — outcome regardless of success/failure.
  Trials need positive evidence too, not just failure data.
- **Frontier-tier (Opus) decision overrides** — when an architect /
  security-reviewer / planner makes a binding recommendation and the user
  explicitly picks something else. These accumulate qualitatively to flag
  patterns ("the architect keeps recommending X when the user wants Y").
- **Notable partials** — subagent shipped most of the spec but missed
  something subtle that took coordinator follow-up.

## What does NOT get logged

- Routine clean runs by validated-tier models on validated-scope tasks.
  Voluminous, no decision value. Absence of failures IS the data.
- Coordinator (host) actions and decisions — those live in commit messages
  and PR diffs, not here. This file tracks SUBAGENT outcomes.
- Subjective preferences ("I'd have phrased it differently"). Only objective
  failure modes — code that broke, output that contradicted constraints,
  paths that didn't exist.

## Schema

```
- YYYY-MM-DD — model — task-type — outcome — context
```

- **date**: ISO date (`YYYY-MM-DD`) of when the attempt happened.
- **model**: exact model name — `<model-tier>-<version>` (e.g. `haiku-4.5`,
  `sonnet-4.6`, `opus-4.7`). Name versions exactly so future routing can
  distinguish a current-version success from a prior-version failure.
- **task-type**: short tag drawn from the project's named-subagent-role names
  where possible: `recon` / `planner` / `architect` / `security-reviewer` /
  `backend-impact` / `frontend-impact` / `test-strategist` / `cross-repo-sync`
  / `doc-audit` / `queue-curator` / `implementation` / (or ad-hoc tags like
  `regex-sweep`, `single-test-add`, `helper-extract`).
- **outcome**: one of:
  - `ok` — task completed correctly, no coordinator follow-up needed.
  - `failed: <one-line mode>` — concrete failure (hallucinated path, ignored
    constraint, false report, etc.).
  - `partial: <one-line issue>` — mostly worked but coordinator had to fix or
    extend something.
  - `overridden: <one-line — what user picked instead>` — Frontier-tier
    recommendation reversed by user.
- **context**: one sentence. What the work was, what session/PR if available,
  anything load-bearing for future readers.

## Decision rules

Both rules below are computed by **counting entry rows** for the `(model,
task-type)` pair — never from memory or general impressions of how a model
has been doing.

### Two-Failure Rule

Two failures on a `(model, task-type)` pair within the trial period contracts
that combination back to the next-tier-up. Add a one-line entry in the policy
doc's "Applied (recent)" section noting the scope contraction.

The rule is "two within the trial period," not "two ever" — a model upgrade
or a substantial codebase shift resets the period.

### Three-Clean-Runs Graduation

Three consecutive clean runs (no `failed`, no `partial`) on an experimental
`(model, task-type)` pair graduates that combination to the "validated scope"
list in the policy doc. Same — record the graduation in the project's
PLAYBOOK_FEEDBACK.md or equivalent.

### Repeated Frontier Overrides

Three or more `overridden` entries against the same model + same kind of
decision within a short window flags the work for paired-design treatment
instead of a one-shot subagent call. The signal: the decision has more
context than fits in a focused subagent prompt.

## Current Status

A point-in-time snapshot of which `(model, task-type)` pairs sit in which
tier. Update whenever the Two-Failure Rule or Three-Clean-Runs Graduation
triggers. Keep it short — one row per pair, most-changed-recent first.

| Model           | Task type        | Tier         | Notes                                     |
|-----------------|------------------|--------------|-------------------------------------------|
| <model-vX.Y>    | <task-type>      | validated    | <e.g. graduated YYYY-MM-DD after 3 clean> |
| <model-vX.Y>    | <task-type>      | experimental | <e.g. trial began YYYY-MM-DD>             |
| <model-vX.Y>    | <task-type>      | deprecated   | <e.g. contracted YYYY-MM-DD after 2 fails>|

## Entries

(most-recent first; append at top after the heading)

### YYYY-MM-DD

- <YYYY-MM-DD> — <model-vX.Y> — <task-type> — `ok` — <one-sentence context: what work, what session/PR>
- <YYYY-MM-DD> — <model-vX.Y> — <task-type> — `failed: <concrete failure mode>` — <one-sentence context>
- <YYYY-MM-DD> — <model-vX.Y> — <task-type> — `partial: <what was missed>` — <one-sentence context>
- <YYYY-MM-DD> — <model-vX.Y> — <task-type> — `overridden: <what user picked instead>` — <one-sentence context>

### Older entries

(none — tracker started <YYYY-MM-DD>)
