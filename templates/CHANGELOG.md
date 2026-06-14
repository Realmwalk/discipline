# Changelog

Human-readable record of notable changes. Update this file before committing meaningful work. Every commit should have an entry, either by commit hash after the commit exists or by exact commit title before committing.

This is the **canonical chronological log of shipped work** for this project. Per the mandatory cleanup gate in `docs/HANDOFF.md` and `docs/AGENTS.md`, shipped TODO entries are deleted from `docs/TODO.md` once captured here, and completed roadmap items are marked ✅ in `docs/ROADMAP.md`. Do not introduce a separate `FEATURES.md` — it would only duplicate either this file (chronological) or `docs/PROJECT_CONTEXT.md` (current-state).

This file is **project-scoped**. The framework repo additionally maintains a root `CHANGELOG.md` for changes that affect multiple downstream projects. See "Dual-CHANGELOG Convention" in `DocumentationFramework.md`. Project changelogs do not log framework-template changes; framework changelogs do not log project work.

## Entry conventions

Three conventions keep the log skim-able for both humans and agents looking at it cold:

### 1. Date or wave headings

Use H2 for the heading. The default shape is a date plus an optional branch / PR / commit-hash suffix in parentheses for traceability:

```markdown
## 2026-05-06 (feature/payment-flow)
## 2026-05-06 (#147)
```

Projects running concurrent multi-subagent batches (a coordinator session that fans work out to several subagents and lands the results in one cleanup) should group those into a **wave** heading instead of one H2 per subagent — the wave is the unit of human review.

```markdown
## Wave 6 — 2026-05-09 (feature/dual-changelog-rollout)

- (infra: framework) Adopted dual-CHANGELOG convention; root log now scoped to cross-project changes only.
- (docs: meta) ...
- (feat: queue) ...
```

One H2 per logical change set (date or wave); bullet body for what shipped. Newest at the top — keep ordering consistent across the file.

### 2. Test-count delta on every entry

Each entry includes a test-count line so regressions stand out at a glance:

```markdown
(tests N/N green, +M from prior)
```

`N/N green` is the absolute count after the change; `+M from prior` is the delta vs. the previous entry. A negative delta or a `green → red` shift lights up immediately. If the change set did not touch tests, write `(tests N/N green, +0 from prior)` so the silence is explicit.

For wave entries put the test-count line directly under the H2; for single-change entries put it as the first bullet or as a parenthetical at the end of the change line.

### 3. Category prefixes on bullets

Tag each bullet with one of the following prefixes for skim-ability:

- `(infra: ...)` — build, CI, deploy, mirroring, repo-level plumbing.
- `(docs: ...)` — documentation-only changes, no runtime behavior delta.
- `(fix: ...)` — bug fix; behavior was wrong and is now correct.
- `(feat: ...)` — new feature or capability shipped to users.
- `(refactor: ...)` — code reshape with no behavior change. Use sparingly; a refactor that doesn't unlock something usually doesn't deserve its own bullet.
- `(test: ...)` — test additions or fixes that don't ride along with a feat/fix.
- `(chore: ...)` — dependency bumps, formatting, housekeeping.

After the prefix, lead with the **user-visible** change, then mention the file or system that moved. The prefix doubles as the section a future reader will jump to when looking for "what features shipped this quarter" or "what infra moved last month."

## Worked example

```markdown
## Wave 6 — 2026-05-09 (feature/dual-changelog-rollout)

(tests 142/142 green, +4 from prior)

- (feat: queue) `AUTONOMOUS_QUEUE.md` now supports per-item agent-tier suggestions; the autonomous host respects them when picking a subagent.
- (infra: framework) Mirrored the new `agents/` folder into `docs/agents/` during bootstrap.
- (docs: meta) Documented the dual-CHANGELOG convention; clarified that `docs/CHANGELOG.md` is project-scoped.
- (fix: handoff) `HANDOFF.md` Approval Signals section corrected: "go ahead" alone is not approval for `[needs-human-collab]` items.

## 2026-05-08 (#214)

(tests 138/138 green, +2 from prior)

- (feat: usage) Added `--dry-run` to the daily ingest CLI so operators can preview without writing.
- (test: ingest) Two new test cases covering empty-input and partial-failure modes.
```

## YYYY-MM-DD (branch-or-pr-or-hash)

(tests N/N green, +M from prior)

- (category: ...) Added/changed/fixed something notable. Lead with the user-visible change, then mention the file or system that moved.

## YYYY-MM-DD (branch-or-pr-or-hash)

(tests N/N green, +M from prior)

- (category: ...) Subsequent change set (newest at top — keep ordering consistent across the file).
