<!--
  TEMPLATE: USAGE.md (Tier D — user-facing controls + Consumer Contract)

  WHEN TO USE:
    - For end-user-facing tools (CLIs, browser-loaded HTML widgets, libraries
      with a UI surface) where someone OTHER than a developer will operate
      the thing. Distinct from README.md (install/intro) and ARCHITECTURE.md
      (internals).
    - For projects that emit OUTPUT consumed by sibling repos or downstream
      tools — the Consumer Contract section is the load-bearing part there.
    - When the controls / settings reference exceeds what fits comfortably
      in README.md and warrants its own page.

  HOW TO USE:
    1. Copy this file into the project's `docs/` directory as `USAGE.md`.
    2. Replace every <placeholder> with project-specific content.
    3. Drop sections that don't apply (e.g. if there's no downstream consumer,
       skip the Consumer Contract — but think twice; many projects have an
       implicit consumer they should make explicit).
    4. Treat the Consumer Contract as a CONTRACT — every breaking change to
       items listed there is a major-version event and warrants a CHANGELOG.md
       call-out plus, if reasonable, advance notice to the consumer repos.

  WHERE THIS LIVES IN THE DOC SET:
    - README.md     — install, what-it-is, one-screen demo. The lobby.
    - USAGE.md      — controls, settings, output formats, consumer contract.
    - ARCHITECTURE.md — internals, modules, why the design is what it is.
    - DECISIONS.md  — locked-in choices and their rationale.

    A reader who wants to USE the tool reads README + USAGE.
    A reader who wants to MAINTAIN the tool reads ARCHITECTURE + DECISIONS.
-->

# Usage — <project-name>

## Quick Start

<the shortest possible "how do I get this thing running" sequence. Three to
six lines. Assume the reader has read README.md's "what is this" but nothing
deeper. Examples:>

```bash
<install or open command>
<run command>
```

<one paragraph on what they should see after the run completes — the smoke
test that confirms it's working.>

## Controls / Settings

<one paragraph framing: where the controls live (panel, CLI flags, config
file, env vars), and the design principle behind them — e.g. "All controls
live in the panel below the canvas. No hidden tabs.">

### <Control-1 name> — <type, e.g. dropdown | slider | flag | env var>

<one paragraph: what it does, default value, value range or enum, when you'd
change it.>

- **<sub-option-1>** <— what this enum value means>
- **<sub-option-2>** <— what this enum value means>

### <Control-2 name> — <type>

<…>

### <Control-3 name> (<range>, default <default>)

<…>

> Alternative: if the control set is large and homogeneous (e.g. 20+ CLI
> flags), use a table:

| Control       | Type      | Default       | Range / Values    | What it does                         |
| ------------- | --------- | ------------- | ----------------- | ------------------------------------ |
| <name>        | <slider>  | <5>           | <1–10>            | <one-line summary>                   |
| <name>        | <flag>    | <off>         | <on/off>          | <one-line summary>                   |
| <name>        | <enum>    | <"default">   | <a | b | c>      | <one-line summary>                   |

## Output Formats

<if the tool emits files / data, document each format here. Skip the section
entirely if the tool produces no persistent output.>

### <Format-1, e.g. JS array, JSON, PNG, ASCII>

<one paragraph: where it gets emitted, when, what's in it. If the format is
load-bearing for a downstream tool, note that and link to the Consumer
Contract section below.>

```<lang>
<minimal example showing the shape>
```

- <field-1 explanation>
- <field-2 explanation>
- <indexing convention, axis ordering, units>
- <invariants the consumer can rely on>

### <Format-2>

<…>

## Consumer Contract

> The shape this project emits that downstream tools / sibling repos can rely
> on. **This section is the contract.** Items listed here are stable across
> patch and minor releases; breaking changes are major-version events.

Downstream consumers — primarily <consumer-repo-1>, <consumer-repo-2> — depend
on the shape below. Breaking changes here silently break the consumer; the
breaking-change warranty section spells out what counts as breaking.

### Stable shape

- **<contract-item-1>:** <description of the invariant. Example: "Array shape: `MAZE[y][x]`, where `y` is the row (top→bottom) and `x` is the column (left→right).">
- **<contract-item-2>:** <e.g. "Cell values: `1` = wall, `0` = open. No other values.">
- **<contract-item-3>:** <e.g. "Outer ring: always walls.">
- **<contract-item-4>:** <e.g. "Determinism: the same seed string produces the same output on the same algorithm version.">
- **<contract-item-…>:**

### Breaking-change warranty

A change to any of the following is a **major-version event** (bump the major
version, announce in CHANGELOG.md, give downstream consumers advance notice
where reasonable):

- Removing or renaming a field listed under "Stable shape" above.
- Changing the type or value range of any documented field.
- Changing axis ordering, indexing convention (0-based vs 1-based), or units.
- Changing the meaning of an enum value (e.g. swapping `1` and `0` in a wall/open grid).
- Removing a documented output format entirely.
- Changing the determinism guarantee (e.g. switching the PRNG so the same seed produces a different output).

A change that is **not** breaking, and may ship in a minor or patch release:

- Adding a new field that consumers can ignore.
- Adding a new output format alongside existing ones.
- Improving accuracy or performance without changing the documented shape.
- Documentation clarifications.

If a consumer needs richer information than the contract above provides,
expose new fields or formats rather than repurposing the existing shape.

## Tips

<short, opinionated, hard-won advice — the things you wish someone had told
you the first day. Bulleted, one-liners.>

- <tip 1>
- <tip 2>
- <tip 3>
