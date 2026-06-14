# CLAUDE.md

Working notes for Claude Code (and other AI agents) operating inside this repository.

## Session start

Preflight (loads every session — cheapest mishap insurance):

1. **Read the handoff.** Read `HANDOFF.md` in your current working directory if present; treat a stale `Last updated` as a smell — flag mismatches, don't trust them.
2. **Place yourself.** Confirm the working directory and git branch before editing; for new work, branch off the latest default branch (see Hard Rules).
3. **Scope big moves out loud.** Multi-file edits, deletions, pushes, or deploys: say what you're about to do, then proceed.
4. **Verify before "done."** "Builds clean" / a subagent's "done" is intent, not proof — run it, grep, or check in-app first.

End of session: update this folder's `HANDOFF.md` (`Status` + `Last updated`) and clear shipped TODOs.

## Reading order

1. `docs/HANDOFF.md` — first-read; completion gate, workflow.
2. `docs/AGENTS.md` — host model, tier routing, local overrides on framework defaults.
3. `docs/DECISIONS.md` — durable decisions (OSS license, stack, anti-completeness rule).
4. `docs/CHANGELOG.md` — completed work.

## Common commands

```powershell
pnpm install
pnpm run typecheck    # tsc --noEmit (or equivalent — check package.json)
pnpm run build        # check package.json for exact command
```

## Hard rules

- **Anti-completeness rule.** Discipline does NOT compete on template count or skill count. Refuse changes that push the framework toward an "awesome-list" shape. The thesis is session-100 maintenance discipline, not feature completeness.
- **Agreed scope is the contract.** Material drift from the agreed scope requires re-confirming scope before continuing, not silently expanding it.
- **No secrets in repo.** Never commit `.env*` or credentials.
- **No push without approval.** Never force-push to `main`.
- **One PR per change — open a new one every time, never reuse.** Every change reaches `main` through a pull request; no direct pushes to `main`, never force-push it. Branch off the latest `main` and open a NEW PR for each set of edits. Do NOT add commits to an existing or already-open PR — even your own, even if related — unless the operator explicitly says so; when unsure, open a new PR.
- **Doc-sync rule.** Update relevant docs in the same commit. Delete completed TODO entries once captured in `docs/CHANGELOG.md`.
- **No shipped TODO residue.** Do not leave `[x] DONE` entries — delete on ship.
- **Package manager: pnpm.** Run `pnpm install` / `pnpm add` — never `npm install`. Never commit `package-lock.json`. The repo `.npmrc` sets `ignore-scripts=true`; pass `--ignore-scripts=false` explicitly only when a legitimate postinstall is required.

## Defaults

- **Default model tier:** Workhorse (e.g. Sonnet-class). Escalate to a Frontier-tier model (e.g. Opus-class) for architecture, security review, or `[needs-human-collab]` items. See `docs/AGENTS.md`.
- **Default branch:** `main`.
- **License:** MIT, © John Hardy. See `LICENSE`. This is an intentional OSS license — do not change it.
- **Stack:** JS/npm + TypeScript. Do not add dependencies casually.
- **Code comments:** Default to none; names should carry meaning.
