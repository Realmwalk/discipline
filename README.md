# Discipline

A small set of docs, conventions, and a tiny CLI for keeping AI coding agents on the rails over the long haul — past the first session and into session 100, when the usual single-file `AGENTS.md` has quietly gone stale.

**Honest framing:** this is what works for me. It's heavier on tokens than a minimal `AGENTS.md` — there are more docs, and the agent reads the ones it needs — but on longer-running projects it's given me noticeably better results: fewer stale docs, less agent drift, less cleanup after the fact. It's opinionated on purpose. Your mileage will vary.

I've used it most with **Claude Code**, but it's deliberately **agent- and model-agnostic** — it's just plain Markdown plus a small zero-dependency CLI, so it should work with Cursor, Codex, Aider, OpenCode, local models, or whatever you run. How well it works depends on the model you point at it; stronger models follow the conventions more reliably.

You can drop it into a new project or layer it onto an existing one.

## How it's different

Most starter kits optimize session 1: one short `AGENTS.md`, terse rules, minimal startup tokens. That's great for a week. This optimizes for the project that's still going months later.

| Common approach | Discipline |
|---|---|
| One `AGENTS.md`, kept tiny | Hot/cold path docs — the agent loads only what the task needs |
| `[x] DONE` piling up in TODO | TODO entries are DELETED on ship — it's a queue, not a log |
| CHANGELOG + FEATURES + RELEASES drifting apart | One canonical CHANGELOG |
| "Just let the agent run" | Two-gate autonomy: a tag scheme + a curated queue before anything runs unattended |
| Build straight from a one-line ask | An optional spec-first flow: plain-English spec → technical plan → checks, before code |

## Core ideas

1. **Hot/cold path docs.** Some docs are read every session; others only when the agent works in that area. The split keeps the always-loaded context small as the project grows.
2. **The cleanup gate is a hard rule.** Shipped TODO entries get deleted; every CHANGELOG entry has a date. It runs at session end, not "when convenient."
3. **Two-gate autonomy.** A `[autonomy: …]` tag says what kind of work something is; a curated queue says which specific items are pre-approved. Being "safe" isn't enough on its own — it also has to be queued.
4. **Improvement with guardrails.** Workflow-change proposals have to point at concrete friction they remove. Aspirational guidance that doesn't earn its place is worse than no guidance.
5. **Expensive models only where they earn it.** The host runs on a workhorse model and spawns a stronger one for the genuinely hard subtask, rather than paying top-tier rates for the whole session.
6. **Provider-agnostic tiers.** Frontier / Workhorse / Recon as the canonical tiers, so the playbook doesn't churn every time a vendor renames a model.
7. **A spec-first flow.** A one-line request isn't a buildable contract. The optional Spec & Design flow turns it into a plain-English spec, then a technical plan with checks, before any code — so an agent builds the right thing instead of confidently building the wrong one. See [`templates/SPEC_WORKFLOW.md`](templates/SPEC_WORKFLOW.md).

## Quick start

```bash
# Drop the templates into your project's docs/ folder
npx discipline-md init
```

That scaffolds a `docs/` folder with the core templates plus a repo-root `LICENSE` and `NOTICE`. Fill in the placeholders, point your agent at `docs/AGENTS.md`, and it has a working playbook from the first session.

For wiring it to a specific harness (Claude Code's `CLAUDE.md`, Cursor rules, or `AGENTS.md`-native tools), see [`docs/HARNESS_INTEGRATION.md`](docs/HARNESS_INTEGRATION.md).

## What ships

`npx discipline-md init` installs a **small core set** — the docs and agent roles a project actually needs from day one. The idea is to ship the minimum that's genuinely useful and add more only when a real need shows up, rather than a giant pile of stubs. Everything else is opt-in:

```bash
npx discipline-md add <template>     # e.g. ARCHITECTURE, DATA_MODEL, DEPLOYMENT
npx discipline-md add-role <ROLE>    # extra agent roles, when a project needs them
npx discipline-md list               # see what's available
```

## Lint

A gate a weak model can forget isn't really a gate, so there's a small linter for the mechanical ones:

```bash
npx discipline-md lint                 # lint ./docs/
npx discipline-md lint --target <path> # lint another repo
npx discipline-md lint --strict        # warnings also fail the run
```

It checks things like `[x]` residue in TODO, tag values outside the documented set, queue entries with no backing task, oversized always-loaded docs, unfilled placeholders, stale handoffs, and the spec-flow conventions. Exit 1 on any error (or any warning under `--strict`); rules skip quietly when their file doesn't exist. Wire it into CI or your end-of-session checklist.

## Status

Early and evolving. It's used and maintained on real projects — that dogfooding is the validation. The templates and the CLI are the stable core.

## License

MIT. See [LICENSE](LICENSE).

## Contributing

Issues and PRs are welcome — especially friction you've hit on existing `AGENTS.md` / starter-kit setups, since that's what this is meant to fix.

- Every change lands via pull request and is reviewed by the maintainer, who is the final approver. (A local pre-push hook blocks direct pushes to the default branch.)
- One concern per PR.
- This competes on *discipline*, not template count — proposals that add breadth for its own sake will be declined; ones that close a real, demonstrated gap are exactly right.
