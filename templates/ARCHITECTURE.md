# Architecture

Update this document when file layout, runtime flow, frontend/backend structure, major dependencies, or testing strategy changes.

## Overview

Describe the system at a high level. One paragraph that another developer can read cold and orient from.

## Runtime Architecture

If the project has a single runtime, one fenced block is enough. If there are multiple (production vs. local dev, host vs. embedded, server vs. CLI), draw each separately so readers don't conflate them.

Production runtime:

```text
client -> server -> database/external services
```

Alternate runtime (local dev, offline mode, embedded, etc. — delete if N/A):

```text
client -> local server -> in-memory or file-backed state
```

## Folder / Module Map

- `path/`: Purpose.
- `path/file.ext`: Purpose.

If the project has clear architectural layers (frontend / backend, host / plugin, core / adapters), group entries by layer with sub-headings rather than listing flat. Flat lists work for small projects; layered groupings scale better.

## Key Flows

List the 3–7 user- or system-visible flows that matter — not every flow, just the ones a contributor needs to know about. Examples: a registration/login flow, a primary user action, a critical background job, a deploy flow.

### Flow Name

1. Step one.
2. Step two.
3. Step three.

### Second Flow Name

1. Step one.
2. Step two.

## Dependencies

- Dependency: why it is used.

Distinguish runtime dependencies from build-time / dev-time dependencies if the distinction matters for the project (e.g. things shipped to clients vs. things that only run on CI).

## Security Boundaries

Identify the trust boundaries in the system. Generic prompts:

- **Secrets that must stay server-side** — credentials, API keys, signing keys, anything in `.env`.
- **Data that must never reach clients or logs** — password hashes, reset tokens, internal user IDs, raw third-party payloads.
- **Trust boundaries between components** — what each service or layer is allowed to assume about its inputs vs. what it must validate.

Delete this section if the project genuinely has no security surface (a pure-function library, a static art piece with no input). Otherwise, fill it in honestly — the absence of this section is a tell that boundaries weren't thought through.

## Testing Strategy

Unit test command:

```bash
# command here
```

What unit tests cover:

- Pure helper logic.
- Important edge cases.
- High-risk behavior.

### Coverage Gaps

What is intentionally not covered yet, and why:

- Gap or deferred test area — short reason (manual smoke test suffices for now / blocked on infra / low priority).

## Tradeoffs

- Tradeoff or constraint that future maintainers should understand.

## Future Architecture Notes

- Possible improvement that is intentionally deferred.
