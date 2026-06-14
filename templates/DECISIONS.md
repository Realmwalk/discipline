# Decisions

Record important product and technical decisions that future maintainers should not have to rediscover. The `architect` Frontier-tier subagent (defined in `docs/AGENTS.md`) produces draft entries in this format; the host reviews and lands them.

Each decision is its own H2 section dated and titled. Body subsections are H3 so multiple decisions stack cleanly in one file.

## Common Decisions Worth Recording

A non-exhaustive prompt list — decisions you'll likely face on any non-trivial product, worth recording the moment they're made (or the moment you realize an unwritten convention has hardened into one). Each is a stub shape; expand into a full entry when the decision is actually made.

- **Branded ID types in the domain layer.** When the domain has multiple entity types with string- or number-shaped IDs, branded types (e.g. `SampleId` ≠ `SourceId` ≠ `ProjectId`) prevent cross-entity confusion at the type-checker level. Record the branding mechanism, the entities that get branded, and which boundaries enforce or unwrap them.
- **`schemaVersion: N` on persisted state with a load-time guard.** Any state that round-trips through a file, KV, or database earns a `schemaVersion` field plus a load-time switch that runs migrations forward (and rejects `version > current`). Record the initial version, where the guard lives, and the migration strategy (forward-only, reversible, etc.).
- **Auth model.** Anonymous-first vs sign-in-first; password vs magic-link vs OAuth; session storage (cookie / JWT in localStorage / opaque KV token).
- **Local-only vs hosted phase.** Whether the project is intentionally not deployed yet, with explicit exit criteria for graduating to a hosted phase.
- **Persistence boundary in dev vs prod.** Local JSON / SQLite for dev, hosted DB for prod — and the seam that switches between them.
- **License choice.** Default (e.g. All Rights Reserved) vs open-source vs source-available. Affects whether external contributions are accepted.
- **Funding / scope drift rule.** When implementation diverges materially from a funded spec, what's the procedure? (Pause and re-pitch upstream, or proceed under stated authority.)
- **Error-shape conventions.** How errors flow from data layer → service → UI. Status codes, error envelopes, `Result<T, E>` vs throws.
- **ID generation.** UUIDv4 vs ULID vs nanoid vs DB sequence; client-generated vs server-generated.
- **Time and timezone handling.** UTC everywhere internally vs local time at boundaries; how "today" is defined for daily-reset features.

When one of these gets decided, write it up as a full entry below using the format that follows.

## Entry Format

Every decision uses the same H3 structure under an H2 header:

```
## YYYY-MM-DD — <Decision Title>

Status: Decided | Accepted | Superseded
Decided: YYYY-MM-DD
Decision: <one-line summary of what was chosen>

### Context

Why this came up — the problem, the tradeoff, the trigger. Reference relevant docs (`PROJECT_CONTEXT.md`, prior `DECISIONS.md` entries, `ARCHITECTURE.md`) rather than restating their content.

### Consequences

What changes as a result. Use bullets for clarity:

- Positive consequence.
- Negative or tradeoff consequence.
- New maintenance burden, constraint, or downstream work introduced.

### Asserted by

Files, tests, code locations, deployment assets, or external configuration that **depend on this decision being true**. If any of these change shape, the decision is implicitly broken and should be revisited. Use `path:line` format where possible so a future reader can jump straight there.

- `<path/to/test>:Lxx` — `<what it asserts>`
- `<path/to/code>:Lxx-Lyy` — `<the implementation that embodies this decision>`
- `<path/to/deployment-asset>` — `<config that encodes this decision>`

### Future audits

Conditions under which this decision should be revisited. Not a deadline — a list of *triggers* that should automatically re-open the question.

- If `<X>` is ever retired, this decision should be re-evaluated.
- If `<metric>` exceeds `<threshold>`, the alternative (`<alt>`) becomes worth reconsidering.
- When `<dependency>` ships `<version>`, check whether the workaround is still needed.

### Alternatives Considered (optional)

- Alternative — why it was not chosen.
- Alternative — why it was not chosen.
```

## YYYY-MM-DD — <Worked Example: Use Branded ID Types in Domain Layer>

Status: Decided
Decided: YYYY-MM-DD
Decision: All entity IDs in `<src/domain/types.ts>` use TypeScript branded types so cross-entity ID confusion is a compile error.

### Context

The domain has `<EntityA>`, `<EntityB>`, and `<EntityC>`, each with string-shaped IDs. Without branding, `function foo(id: string)` accepts any of the three, and a refactor that swaps argument order silently compiles. Caught a real instance of this in `<test or code path>` during `<milestone>`.

### Consequences

- Cross-entity ID mix-ups become compile errors instead of runtime bugs.
- Constructing an ID from a raw string requires going through a branded constructor (`<makeEntityAId(s)>`), which adds one line per ID-creating boundary (parsers, DB reads, URL params).
- Generic helpers that take "any ID" need either a union type or a generic parameter.
- Test fixtures need the constructor too — `<fixture-helper-path>` exposes `<asEntityAId(s)>` etc. for ergonomic construction.

### Asserted by

- `<src/domain/types.ts>:Lxx-Lyy` — branded type declarations.
- `<src/domain/ids.ts>:Lxx` — branded constructors and unwrap helpers.
- `<test/domain/ids.test.ts>:Lxx` — type-level negative test (should fail to compile if branding is removed).
- `<src/api/routes/*.ts>` — every route handler that accepts an ID parses it through the branded constructor at the boundary.

### Future audits

- If the project migrates off TypeScript (e.g. to Go or Rust), the branding mechanism changes shape — re-record under the new language's idiom (newtype, distinct types, etc.).
- If the domain is ever flattened to a single entity type, branding becomes overhead — revisit.
- If runtime parsing libraries (zod, valibot) are adopted project-wide, fold branded constructors into their schemas rather than maintaining parallel constructors.

### Alternatives Considered

- Plain `string` aliases (`type EntityAId = string`) — rejected; aliases are not nominal in TypeScript, so the compiler still treats them as interchangeable.
- Wrapper objects (`{ kind: "EntityA", value: string }`) — rejected; runtime overhead and ergonomics worse than zero-cost branding.

## YYYY-MM-DD — <Second Decision Title>

Status: Accepted
Decided: YYYY-MM-DD
Decision: <one-line summary>

### Context

(Each decision repeats the same H3 structure. Keep entries chronological — newest at the bottom or newest at the top, pick one and stay consistent across the file.)

### Consequences

### Asserted by

### Future audits

### Alternatives Considered
