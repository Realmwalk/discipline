# TODO

<!-- HOT PATH FILE. Static sections at top (commands, reference). Volatile task list at bottom. -->
<!-- Keep the top stable so session-to-session prompt caching works. -->

> Two-gate rule: an `[autonomy: safe]` tag on an entry here is necessary but NOT sufficient for unattended execution. The item must ALSO be listed in `docs/AUTONOMOUS_QUEUE.md`. If it isn't in the queue, it waits for user input — no exceptions.

## Commands

Start local dev:

```bash
# command
```

Run tests:

```bash
# command
```

Build (if applicable):

```bash
# command
```

## Deployment Notes

Stable reference for deployment-time gotchas. Detail goes in `docs/DEPLOYMENT.md`; this section is for the "must remember" bullets agents need at hand.

- Note 1.
- Note 2.

## Test Checklist

Pre-commit / pre-merge sanity sweep:

- [ ] Run unit tests.
- [ ] Run build.
- [ ] Smoke test key user flows.
- [ ] Audit docs before final response or commit: inspect `git diff -- docs`, update relevant docs, search for stale names/paths after renames or behavior changes.
- [ ] Keep core docs updated when behavior changes — `docs/HANDOFF.md`, `docs/CHANGELOG.md`, `docs/ROADMAP.md`, `docs/ARCHITECTURE.md`, `docs/API_REFERENCE.md`, `docs/DATA_MODEL.md` (only the ones that actually changed; don't touch unaffected docs).
- [ ] **Cleanup gate (mandatory)**: delete shipped TODO entries once they hit `docs/CHANGELOG.md` (TODO is a queue, not a log — no `[x] DONE` carryover); mark completed `docs/ROADMAP.md` items ✅ or move under `## Completed`; trim `docs/AUTONOMOUS_QUEUE.md` as queued items ship. See `docs/AGENTS.md` for the full mandatory cleanup gate.

## Tag Conventions

Every entry in `## Active / Next` (and any milestone subsection below) should carry a tag block. Tags drive autonomy decisions, model-tier selection, and queue triage.

**Format** (suffix on the bullet):

```
[size: XS|S|M|L|XL][risk: low|med|high][scope: isolated|cross-cutting|infra]
```

Optional additional tags layer on top: `[tier: haiku|sonnet|opus]`, `[autonomy: safe|review|needs-human-collab]`. See `## Autonomy Tag Legend` below.

**Meanings:**

- `size` — `XS` = single-line tweak (under ~15 min). `S` = under an hour. `M` = a focused session. `L` = multi-session or design-required. `XL` = epic / multi-week, expect to break down.
- `risk` — blast radius if the change goes wrong. `low` = isolated UI tweak / dead-code removal. `med` = data-touching code, exported APIs, build config. `high` = auth, payments, schema migrations against live data, anything user-facing in production.
- `scope` — `isolated` = single repo, single subsystem. `cross-cutting` = touches multiple subsystems / packages within one repo. `infra` = build, CI, deploy, secrets, hosting wiring.

**Default for unmarked entries:** `[size: S][risk: low][scope: isolated]` plus `[tier: sonnet][autonomy: safe]` from the Autonomy Tag Legend. Omit tags that match the default; only call out where an entry differs.

**Examples** (shape only — fill with real entries):

```
- [ ] Reset / clear catalog action with confirmation. `[size: XS][risk: low][scope: isolated]`
- [ ] Library list virtualization for 1k+ rows. `[size: S][risk: low][scope: isolated]`
- [ ] Duplicate detection (filename/path heuristics). `[size: M][risk: med][scope: isolated]`
- [ ] JSON catalog import (export already shipped). `[size: S][risk: med][scope: isolated]`
- [ ] End-to-end test: index folder → catalog → link → export packet. `[size: M][risk: med][scope: cross-cutting]`
- [ ] Migrate <feature> from monolith to <package>. `[size: L][risk: high][scope: cross-cutting]`
- [ ] Recruit external validators. `[size: M][risk: med][scope: isolated][autonomy: human-only]`
```

## Autonomy Tag Legend

Tag scheme defined in `docs/AGENTS.md`. Default for an unmarked entry is `[size: S][tier: sonnet][risk: low][scope: isolated][autonomy: safe]`; only call out tags that differ.

- `[size: XS|S|M|L|XL]` — see Tag Conventions above.
- `[tier: haiku|sonnet|opus]` — model tier that should drive implementation. (Or use the model-agnostic `recon|workhorse|frontier` if the project doesn't run on Claude.)
- `[risk: low|med|high]` — blast radius if the change goes wrong.
- `[scope: isolated|cross-cutting|infra]` — see Tag Conventions above.
- `[autonomy: safe|review|needs-human-collab]` — `safe` = autonomous host may pick up; `review` = autonomous host may implement but must open a draft PR; `needs-human-collab` = MUST NOT start without explicit user approval.

## Backup / Mirror Hygiene

Standing reference checklist — these are RECURRING items, not one-off tasks. Do not delete on completion; instead, note the most recent verification date inline. See `docs/HANDOFF.md` "Remotes & Backup" section (or equivalent) for the project-specific context.

- **Annual SSH key rotation.** `~/.ssh/<key>` is the auth credential for all remotes (GitHub + any mirrors: GitLab, NAS, etc.). Rotate yearly. After rotation: re-register with GitHub via `gh auth refresh`, GitLab via web console or `glab ssh-key add`, and any self-hosted mirror's `authorized_keys` for each user account. Last rotated: `<YYYY-MM-DD>`.
- **Pre-commit gitleaks hook.** Install gitleaks as a pre-commit hook so accidental secrets get caught before any push (especially before fan-out to multiple mirrors). Respect `.gitleaksignore` where present. Verified installed: `<YYYY-MM-DD>`.
- **GitHub push protection enabled.** In repo settings on github.com, "Secret scanning push protection" must be ON so even a typo cannot accidentally push a real credential. Verified enabled: `<YYYY-MM-DD>`.
- **Secret scanning enabled.** GitHub repository-level secret scanning (passive scanner over history) must be ON in addition to push protection. Verified enabled: `<YYYY-MM-DD>`.
- **Fan-out verification.** Run `git push origin --dry-run` from each repo to confirm pushurls still resolve (catches hostname changes, key revocation, mirror outage) before the next real push needs them. Last verified: `<YYYY-MM-DD>`.

---

## Current Context

*A few bullets covering where the session is picking up. Examples of useful content:*

- *Where production / local-dev state lives, and how to reset.*
- *In-flight feature branches and their status.*
- *Decisions that were made recently but haven't fully propagated.*
- *Things deferred to a later session and why.*

(Single bullet is fine for small projects; expand as the project grows.)

## Active / Next

- [ ] Task. `[size: S][risk: low][scope: isolated]`
- [ ] Task. `[size: S][risk: low][scope: isolated]`

## Blockers (delete this section if empty)

- Blocker or dependency.
