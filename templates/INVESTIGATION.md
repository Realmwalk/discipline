<!--
  TEMPLATE: INVESTIGATION.md (Tier B4 — bounded research writeup)

  WHEN TO USE:
    - Before committing to a tech-stack pick, hosting choice, framework migration,
      or any other "we have to choose between N options" decision that benefits
      from a structured side-by-side rather than an in-line discussion.
    - When a question has been raised that's bigger than a TODO line item but
      smaller than a full architectural decision (which would land in DECISIONS.md).
    - When you need to record an investigation where the OPERATOR is the one who
      ultimately picks — an investigation produces a recommendation, not a fait
      accompli.

  HOW TO USE:
    1. Copy this file into the project's `docs/` directory.
    2. Rename to the convention: INVESTIGATION_<TOPIC>.md
       (UPPER_SNAKE_CASE topic, one file per investigation; e.g.
       INVESTIGATION_DASHBOARD_TECH_STACK.md, INVESTIGATION_LLM_HOSTING.md).
    3. Replace every <placeholder> with project-specific content.
    4. When the operator picks, leave this file in place as a record. Add a
       one-line "Decision: <picked> on <YYYY-MM-DD>; see DECISIONS.md#<anchor>"
       at the top so future readers can trace from investigation to outcome.
    5. Investigations are CHEAP TO ABANDON — if the operator picks differently
       than recommended, that's fine; the value is in the record of options
       considered, not in being right.

  RELATED:
    - Pairs with DECISIONS.md (where the final, locked decision lives).
    - Pairs with OPEN_DECISIONS.md (where pending picks are tracked).
-->

# Investigation — <topic>

Status: <investigation in progress | investigation complete; operator decision pending | resolved YYYY-MM-DD — see DECISIONS.md#<anchor>>

> Note on sources: <state explicitly whether live web access (WebFetch / WebSearch)
> was available during the investigation. If not, note that version numbers and
> "active maintenance" claims may need a spot-check before the operator commits.>

## TL;DR

<two-to-four-sentence summary: which option to pick, why, what to avoid, what the
runner-up is. The operator should be able to read this section and stop if they
already trust the framing.>

## Background — why this came up

<one-to-three paragraphs: what triggered the investigation. The TODO line that
spawned it, the milestone it gates, the decision that's blocked on it. Include
enough context that a reader six months from now can re-derive the question.>

## Requirements

<bulleted list — the hard constraints the option must meet. Cite the source doc
that anchors each constraint where possible (e.g. "Single operator — per
PROJECT_CONTEXT.md §Non-Goals").>

- <constraint 1, with citation if applicable>
- <constraint 2>
- <constraint 3>
- <…>

## Candidates Compared

### <Option A>

**Elevator pitch.** <one-to-two-sentence description of the option.>

**Learning curve.** <hours / days / weeks to a working prototype, with what assumed prerequisites.>

**Ecosystem.** <maintenance status, community size, recent release cadence, vendor stability.>

**<criterion-1, e.g. Charting | Performance | Pydantic reuse>.** <how the option handles it.>

**<criterion-2>.** <…>

**Deployment.** <where it can run, free-tier options, self-host viability.>

**Footguns.** <bulleted list of gotchas — known weak points, surprises, things that bite teams who pick this option.>

**Verdict.** <one-paragraph judgment for THIS use case.>

### <Option B>

(same shape as Option A)

### <Option C>

(same shape)

### <Option D — optional, only if it's a real candidate>

(same shape)

## Comparison table

| Option        | <criterion-1> | <criterion-2> | <criterion-3> | <criterion-4> | Maturity   | Verdict for this use case            |
| ------------- | ------------- | ------------- | ------------- | ------------- | ---------- | ------------------------------------ |
| <Option A>    | <…>           | <…>           | <…>           | <…>           | <…>        | **Recommended**                      |
| <Option B>    | <…>           | <…>           | <…>           | <…>           | <…>        | <runner-up | overkill | wrong-fit>     |
| <Option C>    | <…>           | <…>           | <…>           | <…>           | <…>        | <…>                                  |
| <Option D>    | <…>           | <…>           | <…>           | <…>           | <…>        | <avoid for this build>               |

## Verdict / Recommendation

**<Option A>.** The decision is driven by <number> concrete properties of this
use case, not by general popularity:

1. **<property-1>.** <one paragraph linking the property to why option A wins on it.>
2. **<property-2>.** <…>
3. **<property-3>.** <…>

If the operator finds <Option A> limiting after the MVP ships
(e.g. <concrete trigger>), **migrating to <Option B> later is straightforward**
because <reason — usually a shared substrate, e.g. "both are Python + Plotly,
the schema imports don't change">.

## Operator Decision Pending

- **Pending?** <yes | no — if no, skip this section>
- **What's needed:** <a sentence stating exactly what the operator must do — pick A vs. B vs. C, or sign off on the recommendation, or provide info that the investigation could not get.>
- **Blocking:** <what work is blocked by this decision, if anything>
- **Default if no decision:** <what the project does in absence of a pick — proceed with recommendation? wait? something else?>

## Next Steps

<assuming the recommendation is accepted, the concrete steps to act on it.
Numbered list. Each step is short and actionable.>

1. <step 1, e.g. "Provision the chosen hosting tier and capture the project ID in DEPLOYMENT.md.">
2. <step 2>
3. <step 3>
4. <…>

## Open Questions

<questions the investigation could NOT answer from available materials —
operator follow-up, vendor outreach, or a spike on the operator's own account.
Be honest about the unknowns so the operator can decide whether to spend the
time to close them or to ship under uncertainty.>

- <unknown 1 — what would close it>
- <unknown 2>
- <…>

## Sources Consulted

<short list of docs read / URLs hit / project files inspected. If live web
access was denied, name what would have been consulted and recommend a
verification step.>

- <source 1>
- <source 2>
- <…>
