# <ROLE_NAME> Agent Work Contract

<!--
  Generic role-contract scaffold. Copy this file to a new UPPERCASE.md (or
  HYPHENATED-NAME.md) inside docs/agents/ and fill in the <placeholders>.

  Keep contracts short, prescriptive, and self-contained. Reference
  docs/AGENTS.md for cross-cutting tier guidance instead of duplicating it.
-->

One-paragraph summary of what this role does and why it exists in this project.

## Role Summary

- **Name:** `<ROLE_NAME>`  <!-- UPPERCASE_SNAKE matching the filename -->
- **Tier:** <Recon / Workhorse / Frontier / specialized subagent> <!-- pick one; see docs/AGENTS.md -->
- **Mode:** <one-line identity, e.g. "Read-only reviewer", "Planning agent", "Implementation worker">
- **Stakeholder model:** <who this role reports to and who owns approval signals>

## Authority Boundary

What this role MAY decide unilaterally:

- <bullet>

What this role MUST NOT do without an explicit approval signal or human handoff:

- <bullet>

## Responsibilities

1. <core responsibility>
2. <core responsibility>
3. <core responsibility>

## Workflow Phases

### Phase 1: <Discovery / Scope>

<what happens, what artifacts are read, what questions are answered>

### Phase 2: <Analysis / Plan>

<work done in this phase; allowed and disallowed actions>

### Phase 3: <Recommendation / Execution>

<deliverable shape and where it lands>

### Phase 4: <Handoff>

<who receives the output and what they do next>

## Drift And Re-Pitch Rules

Stop and check with the human (or escalate to the stakeholder role) when any of these occur:

- <drift trigger, e.g. "scope materially exceeds the original ask">
- <drift trigger, e.g. "evidence contradicts the original plan">
- <drift trigger>

## Content-Safety Rules

<!-- Project-domain-specific dos and don'ts. Examples: defamation rules for
     trivia content, medical-claim limits for health products, PII rules
     for analytics tools. Replace with project-appropriate items. -->

- <project-specific safety rule>
- <project-specific safety rule>

## Cleanup Gate

Before this role considers a task done:

- <required artifact updated, e.g. "docs/CHANGELOG.md updated">
- <required artifact updated>
- <verification step>

## Approval Signals

Literal phrases that gate this role's work. Match exactly; ambiguous approvals require re-confirmation.

- `<SIGNAL>_APPROVED` — <what this signal authorizes>
- `<OPTIONAL_SIGNAL>` — <what this authorizes>

## Stop Conditions

Hand back to the human when:

- <ambiguity that requires a judgment call>
- <discovery that invalidates the original ask>
- <evidence that the task is out of scope for this role>

## Inputs

- <expected input, e.g. "task brief from caller", "path to repo", "funded spec at docs/PROJECT_CONTEXT.md">

Read exactly the inputs above plus any files the spawn prompt names. Do not browse other docs on your own initiative.

## Outputs

- <produced artifact, e.g. "ordered plan in docs/TODO.md", "audit report at docs/<PATH>.md">

## Worked Example

**Input:** <one-line realistic task for this role>

**Good output:**

<verbatim example in the role's required output shape — concrete fake paths/lines are fine>

**Not this:**

<short bad output exhibiting the role's typical weak-model failure>

*Why it fails:* <one sentence naming the specific contract rule violated>
