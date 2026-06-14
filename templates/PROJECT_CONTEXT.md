# Project Context

Update this document when product direction, user audience, design language, runtime shape, constraints, or non-obvious intent changes.

## Elevator Pitch

One paragraph. What this is, who it serves, what problem it solves. The hook a future contributor reads first.

## What This Project Is

*One paragraph: what it is, who it serves, what problem it solves. Expand on the elevator pitch above with one level more detail. Not a feature list — that lives in CHANGELOG and the cold-path docs.*

Describe the product, application, library, or system.

## Runtime Shape

*High-level system overview. Point readers at deeper docs (`ARCHITECTURE.md`, `DATA_MODEL.md`, `API_REFERENCE.md`) rather than restating their content.*

- Frontend / client surface: (web app, CLI, library, mobile, embedded — or "n/a")
- Backend / server: (Express on Railway, serverless functions, none)
- Persistence: (Postgres, SQLite file, no persistent state)
- Build step: (yes / no — keeps setup expectations clear)

Delete or rename rows that don't apply. A pure-source library may have only a "Build step" row.

## Goals

*Outcomes the project aims to achieve, not features it ships.*

- Goal 1
- Goal 2
- Goal 3

## Users / Audience

*Personas and their needs. Not feature lists.*

Describe who uses this and what they need.

## Product Principles

*The "feel" or quality bar. What good looks like.*

- Principle 1
- Principle 2

## Design / UX Direction

*Visual language, interaction patterns, tone, and accessibility requirements. Libraries / CLIs may rename this section to "API Surface Style" (naming conventions, error message tone, output format) or delete it if the project has no UI.*

Describe visual language, interaction patterns, tone, and accessibility requirements.

## Important Constraints

*Limits the project must respect. Sub-categorize when the list grows:*

### Technical
- Constraint.

### Regulatory / Compliance
- Constraint.

### Resource (time, budget, team size)
- Constraint.

(Drop sub-categories if a flat list of 2–4 items is enough.)

## Non-Goals

*What this project explicitly does NOT do. Prevents scope creep and clarifies the project's edges.*

- Non-goal 1
- Non-goal 2

## Known Open Questions

*Decisions deferred, ambiguity worth surfacing. Resolve over time; once resolved, the answer lands in `DECISIONS.md`.*

- Question 1
- Question 2

## Related Documents

This file is meant to be a thin index, not a deep reference. For specifics:

- Persistence and data shape: `docs/DATA_MODEL.md`
- API endpoints / public surface: `docs/API_REFERENCE.md`
- Runtime architecture: `docs/ARCHITECTURE.md`
- Deployment + operations: `docs/DEPLOYMENT.md`
- Decision history: `docs/DECISIONS.md`
- Long-term planning: `docs/ROADMAP.md`
