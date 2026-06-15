# Agents — Discipline (project-local)

This is Discipline's own project-local agent playbook. It annotates only Discipline's divergences from the framework defaults for working ON Discipline itself; the canonical templates ship under `templates/` (what `npx discipline-md init` installs).

## Local Overrides

- **Posture:** Use the framework default of **supervised-direct**. Discipline's own development is a focused project; spawn overhead would dwarf task size. Coordinator-heavy is opt-in for genuine parallel fan-out (cross-template polish passes, pre-release audits).
- **Subagent set:** Use the lean Core 5 (`recon`, `planner`, `debugger`, `security-reviewer`, `cross-repo-sync`). No project-local roles needed yet.

## Cleanup Gate

Standard framework cleanup gate applies:

1. Delete shipped TODO entries (no `[x] DONE` graveyards).
2. Update ROADMAP with ✅ for completed items.
3. Add CHANGELOG entry for meaningful changes.
4. Update DECISIONS for non-obvious tradeoffs.
5. Run `git diff -- docs` before signing off.
6. Run `npx discipline-md lint` (here: `node bin/discipline.js lint`) and fix anything red before signing off.

"Completed" for the cleanup gate means: the change has landed on the default branch (or, for docs-only work, the edit is committed) AND its `docs/CHANGELOG.md` entry is written. Delete the TODO entry at that moment — not when tests pass, not when a PR is opened. The CHANGELOG entry and the TODO deletion happen in the same commit.
