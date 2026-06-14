# Harness Integration

How Discipline binds to specific AI coding harnesses (Claude Code, OpenCode, OpenAI Codex, Cursor, and others). This is a design/strategy doc, not a shipped feature — see **Governance** below for what is in scope now vs. re-pitch-gated.

## Thesis

Discipline is already harness-agnostic: the canonical playbook is `docs/AGENTS.md` plus the role contracts in `docs/agents/`, and any agent that reads instruction files can follow it. "Integration" is therefore not a rewrite — it is a thin, per-harness **adapter** that points the harness's native entry file at the canonical playbook. Pointers age well; deep integrations rot. For a framework whose entire thesis is anti-rot, that distinction is the whole design.

## Three-layer model

1. **Canonical (exists today).** `docs/AGENTS.md`, `docs/HANDOFF.md`, the Core docs, and `docs/agents/*` role contracts. Harness-independent; single source of truth.
2. **Adapter (the 80/20).** A native entry file per harness whose entire job is: *"read `docs/AGENTS.md` and `docs/HANDOFF.md` first; here is the reading order."* Most harnesses need only this. Adapters point — they never duplicate playbook content.
3. **Deep mapping (opt-in).** Map Discipline concepts onto a harness's native primitives where they exist and earn it. Always optional, always gated on adoption.

## Per-harness matrix

Conventions move fast. An adapter must track each harness's *current* convention — verify before shipping one. (That volatility is itself the argument for thin pointers over deep integrations.)

| Harness | Native entry point | Thin adapter (the 80/20) | Deep mapping (opt-in) |
|---|---|---|---|
| **Claude Code** | `CLAUDE.md` + `.claude/` | `CLAUDE.md` → reading order into `docs/AGENTS.md` (Discipline already dogfoods this) | role contracts → `.claude/agents/*.md`; cleanup gate → a Stop hook; autonomy tags → `settings.json` permissions; the `discipline` CLI → a Skill |
| **OpenCode** | `AGENTS.md` (native, nested-aware) | root `AGENTS.md` pointing to `docs/AGENTS.md` | roles → OpenCode custom agents/modes; permission config |
| **OpenAI Codex** (CLI + cloud) | `AGENTS.md` (+ `~/.codex/config.toml`) | same root `AGENTS.md` pointer | config profiles; MCP servers |
| **Cursor** | `.cursor/rules/*.mdc` (glob-scoped) | a project rule pointing to `docs/AGENTS.md` | **hot/cold paths → glob-scoped auto-attached rules** — cold-path docs attach only when editing that area. Strongest native fit of any harness. |
| **Others** — Gemini CLI (`GEMINI.md`), GitHub Copilot (`.github/copilot-instructions.md`), Aider (`CONVENTIONS.md`), Continue, Windsurf, OpenHands microagents | varies | one thin pointer each | per-tool primitives as they prove out |

## The leverage point: `AGENTS.md` convergence

OpenCode, Codex, and a growing set standardize on `AGENTS.md`. Treat it as the primary cross-harness surface; make `CLAUDE.md` / `.cursor/rules` / `GEMINI.md` thin pointers to it. That keeps the maintained surface to **one file, not N**.

## Delivery — staged

- **Stage 0 — Integration guide (in current scope).** This doc + copy-paste entry-file snippets per harness. Pure docs, near-zero maintenance; makes the existing harness-agnostic promise explicit.
- **Stage 1 — `discipline init --harness <claude-code|agents|cursor>` (material scope → re-pitch).** Generates the thin adapter file(s) for the top harnesses. New CLI surface + maintenance.
- **Stage 2 — deep primitive generation (bigger scope → separate re-pitch, adoption-gated).** e.g. `.claude/agents/` from role contracts, a cleanup-gate hook, Cursor scoped rules from the hot/cold split. Only for harnesses the data shows people use.

## Anti-completeness guardrail

The failure mode is a 15-harness bespoke integration matrix — the awesome-list trap the thesis forbids (see `CLAUDE.md` Anti-completeness rule). Mitigations:

- One adapter *pattern* covers most harnesses with a pointer; only the top few get a generated adapter.
- Depth is gated on **measured adoption**, decided by the cross-product harvest + product-outcome retro (`docs/agents/CROSS_REPO_SYNC.md`, `docs/AUTONOMOUS_QUEUE.md`). The loop decides which adapters earn their keep — and retires ones that don't.
- Adapters point, never duplicate. The canonical playbook stays in `docs/AGENTS.md`.

## Governance

- **Stage 0** (this doc + snippets) is within Discipline's existing harness-agnostic scope → ships as a normal PR.
- **Stages 1–2** (CLI surface, generated native files, deep primitives) are material new scope → re-pitch in the project's open-decisions log, build only after the scope is re-approved. The STAKEHOLDER Funding Gate (`docs/agents/STAKEHOLDER.md`) is the mechanism.

## Risks

- **Convention drift** — harnesses change their entry-file formats. Thin pointers absorb this; deep integrations break. Keep depth minimal.
- **Integration-count creep** — directly violates the thesis. Cap via the guardrail above.
- **Playbook fragmentation** — never let an adapter accumulate playbook content. It points; `docs/AGENTS.md` owns.
