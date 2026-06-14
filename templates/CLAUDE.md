<!--
  TEMPLATE: CLAUDE.md (Tier B7 — repo-root agent onboarding)

  WHEN TO USE:
    - At the root of any repo where AI coding agents (Claude Code or others)
      will operate. This is the agent's HOT PATH — the first file read every
      session.

  HOW TO USE:
    1. Copy this file to the repo root as `CLAUDE.md`.
    2. Replace every <placeholder>.
    3. Keep it SHORT. Target under 80 lines. Anything that needs more depth
       belongs in a doc that Reading Order points to, not here.
    4. CLAUDE.md is for orientation, not policy detail. The Hard Rules section
       is for things that, if violated, cause real damage; routine guidance
       belongs in the linked docs.

  WHY KEEP IT TIGHT:
    - Every session pays the token cost of this file as part of context.
    - A wall of text trains the agent to skim it instead of obey it.
    - The four sections below are the minimum useful surface; resist adding more.
-->

# CLAUDE.md

Working notes for Claude Code (and any other AI coding agents) operating
inside `<repo-path>`.

## Session start

Preflight (loads every session — cheapest mishap insurance):

1. **Read the handoff.** Read `HANDOFF.md` in your current working directory if present; treat a stale `Last updated` as a smell — flag mismatches, don't trust them.
2. **Place yourself.** Confirm the working directory and git branch before editing; for new work, branch off the latest default branch (see Hard Rules).
3. **Scope big moves out loud.** Multi-file edits, deletions, pushes, or deploys: say what you're about to do, then proceed.
4. **Verify before "done."** "Builds clean" / a subagent's "done" is intent, not proof — run it, grep, or check in-app first.

End of session: update this folder's `HANDOFF.md` (`Status` + `Last updated`) and clear shipped TODOs.

## Reading Order

Before editing, read in this order:

1. `<docs/HANDOFF.md or session-state doc>` — current work-in-progress / where the last session left off.
2. `<docs/README.md or PROJECT_CONTEXT.md>` — what this project is.
3. `<docs/PROJECT_CONTEXT.md or equivalent>` — funded scope / build contract.
4. `<docs/AGENTS.md or AGENTS-policy doc>` — tier routing, who does what.
5. `<docs/TODO.md and AUTONOMOUS_QUEUE.md>` — what's in scope right now.

## Common Commands

```<powershell | bash>
<install command>                # first run only, e.g. npm install / pnpm install / pip install -e ".[dev]"
<dev command>                    # local dev server / watcher
<typecheck command>              # e.g. tsc -b --noEmit / mypy / pyright
<test command>                   # unit tests
<test:watch command>             # watch-mode tests (omit if not applicable)
<full-gate command>              # the single command CI runs and you should run before commit
<lint command>                   # if separate from typecheck
<build command>                  # production build
<preview command>                # serve / preview the production build locally
```

> Keep this list to commands the agent will actually run. If the project has
> 30 npm scripts, list the 8 that matter and link the rest from package.json.

## Hard Rules

Things never to do. Each line is a load-bearing rule — violating it causes
real damage (data loss, scope creep, license drift, content-safety incident,
secret leak).

- **<funded-scope rule>.** <e.g. "The pitch in `docs/PROJECT_CONTEXT.md` is what may be built. Material drift requires a re-pitch in `docs/OPEN_DECISIONS.md` and a fresh `FUNDING_APPROVED` signal.">
- **<no-secrets-in-repo rule>.** Never commit `.env*`, credentials, API keys, deploy tokens, or anything in `<secret-paths>`. `.gitignore` covers the common cases; if you're about to bypass it, stop.
- **<no-push-without-approval rule>.** Don't `git push` without the operator's explicit go-ahead. Don't force-push to `<protected-branch>` ever.
- **One PR per change — open a new one every time, never reuse.** Every change reaches `<protected-branch>` through a pull request; no direct pushes to `<protected-branch>`, never force-push it. Branch off the latest `<protected-branch>` and open a NEW PR for each set of edits. Do NOT add commits to an existing or already-open PR — even your own, even if related — unless the operator explicitly says so; when unsure, open a new PR.
- **<no-deploy-without-security-audit rule>.** Don't deploy to a public-facing surface without a current `docs/SECURITY_AUDIT_<YYYY-MM-DD>.md` (≤90 days old OR covering all changes since the last audit, whichever is stricter). See `docs/DEPLOYMENT.md` Pre-Deploy Gate.
- **<content-safety rule>.** <project-specific — e.g. "See `docs/agents/FOUNDER.md` for the rules: real options must link to a real Wikipedia article, fakes must be invented, no living-person gotchas, no medical claims, no tragedy material.">
- **<doc-sync rule>.** When work crosses a doc-completion-gate boundary (`<docs/HANDOFF.md or equivalent>` lists them), update those docs in the same change.
- **<no-shipped-todo-residue rule>.** Once a task ships and is logged in `<docs/CHANGELOG.md>`, delete it from `<docs/TODO.md>`.

## Defaults

- **Default model tier:** <e.g. Sonnet for routine implementation, Opus for architect / security-reviewer / planner. See `docs/AGENTS.md` for the full routing table.>
- **Default branch:** `<main | master | trunk>`. <one line on protection state if any.>
- **License:** `<All Rights Reserved | MIT | Apache-2.0 | …>` (see `LICENSE`). Do not silently change it.
- **Stack:** `<one line: language + framework + runtime>`. Do not add `<things-that-would-be-scope-creep>` without a re-pitch.
- **Code comments:** <project's stance — e.g. "Default to writing no comments; names should carry meaning." or "Document every public function.">
- **Formatter / linter:** `<prettier | black | rustfmt>` is the source of truth — don't argue with it.
