<!--
  TEMPLATE: SECURITY_AUDIT.md (Tier A5 — pre-launch / periodic security audit)

  WHEN TO USE:
    - Before first public deploy of any project.
    - On a periodic cadence after launch (quarterly, or after a major architectural change).
    - After a known incident, as a "what else have we missed" pass.

  HOW TO USE:
    1. Copy this file into the project's `docs/` directory.
    2. Rename to the dated convention: SECURITY_AUDIT_YYYY-MM-DD.md
       (one file per audit; never overwrite a prior audit's record).
    3. Replace every <placeholder> with project-specific content.
    4. Keep prior audits in the repo as a record. Append a "Resolved YYYY-MM-DD"
       note inline when a finding closes (preserves the original text).
    5. Severity bands (Critical / High / Medium / Low / Informational) are
       calibrated against the PRODUCT'S risk profile, not against generic CVSS.
       A Medium for a banking app may be a Low for a no-PII trivia game.

  RELATED:
    - Pairs with the Security Auditor agent role contract.
    - Findings often spawn entries in OPEN_DECISIONS.md or TODO.md.
-->

# Security Audit — <project-name>

**Date:** <YYYY-MM-DD>
**Auditor:** <auditor-name-or-role-and-tier>
**Scope:** <one-line scope statement, e.g. "Source-only review of `<repo-path>` at the state on disk on this date.">
**Engagement:** <pre-launch | periodic | post-incident | other — and the surrounding context, e.g. "Pre-launch audit before <hosting-platform> deploy.">

## 1. Scope

### Audited

- <list every file tree, manifest, migration, config, and doc surface that was actually read>
- <name third-party tools run, e.g. `npm audit`, `pnpm audit`, `bandit`, `gitleaks`, etc.>
- <name source-tree paths, not just "the repo">

### Excluded (per <Founder | Operator | brief>)

- <platform vendors trusted by the engagement, e.g. "Cloudflare itself", "Supabase as a platform">
- <upstream services we are downstream consumers of>
- <sibling projects with separate engagements>
- <any deployed surface — note if there is no live deploy yet>
- <active probing or penetration testing — typically out of scope for source-only review>

### Assumptions

- <what the operator is responsible for and is presumed to handle correctly, e.g. secret-rotation cadence, MFA on cloud accounts>
- <what the build pipeline is presumed to do, e.g. ".env.local is gitignored and never committed">
- <what env vars are operator-controlled vs. user-controllable>
- <any limitation of the audit environment itself, e.g. "no `.git` history readable">

## 2. Threat Model

### Trust boundaries

```
        ┌──────────────────────────────────────────┐
        │ Trusted: <build-host>                    │
        │   - <what it reads>                      │
        │   - <what it writes>                     │
        └──────────────┬───────────────────────────┘
                       │ <transport, e.g. git push>
                       ▼
        ┌──────────────────────────────────────────┐
        │ Trusted: <build-pipeline>                │
        │   - <what env / secrets it sees>         │
        │   - <what artifact it produces>          │
        └──────────────┬───────────────────────────┘
                       │ deploy
                       ▼
  ┌──────────────────────┐         ┌────────────────────────────┐
  │ Untrusted: <visitor> │ ◄─────► │ <runtime-host>             │
  │ <browser | client>   │  HTTPS  │ <surface description>      │
  └──────────┬───────────┘         └──────────────┬─────────────┘
             │                                    │
             │ <client-shipped credential>        │ <server-only credential>
             ▼                                    ▼
  ┌──────────────────────┐         ┌────────────────────────────┐
  │ <data-store>         │ ◄─────► │ <third-party-service>      │
  │ <table list / KV>    │         │ <vendor>                   │
  └──────────────────────┘         └────────────────────────────┘
```

> Replace boxes / arrows with the actual project shape. The point of the diagram
> is to make the trust boundaries explicit so every finding can be located on
> one of them. Keep it small enough to read at a glance.

### Data assets

- **<asset-1>.** <one paragraph: what it is, where it lives, what it would mean if leaked / mutated / deleted, value tier (High / Medium / Low).>
- **<asset-2>.** <…>
- **<…>.**

> List the SPECIFIC data the project handles. "PII" is too generic — name the
> tables, columns, files, KV keys. If "no sensitive data" is the answer, state
> it explicitly so the calibration is documented.

### Attacker shapes

| Shape | Capability | Goal | Realistic? |
|---|---|---|---|
| **Script kiddie / curiosity** | Browser dev tools, `curl`, no infra | Poke at endpoints, look at JS | <yes/no + one line> |
| **Opportunistic spammer / botter** | A few thousand requests/sec from rotating IPs | <stat-skew | quota-exhaust | spam | other> | <yes/no + one line> |
| **Targeted attacker** | Skilled adversary with patience | Exfiltrate data, gain RCE, pivot to <cloud-account> | <yes/no + one line> |
| **Insider / operator misconfig** | <Founder | operator | role> | <paste-mistake | accidental commit | other> | <yes/no + one line> |
| **<custom-shape>** | <…> | <…> | <yes/no + one line> |

> Calibrate "Realistic?" against the actual product. A targeted attacker is
> implausible against a free trivia game and very plausible against a payments
> system. Without this calibration the findings get the wrong severity.

### In-scope attack surface

1. <endpoint or surface 1, with file:line if possible>
2. <endpoint or surface 2>
3. <client-side bundle contents>
4. <build-pipeline / dependency posture>
5. <…>

## 3. Findings

Severity tiers per the role contract, calibrated against the product's actual
risk profile. Each finding carries: severity, where, exploit story,
why-it-matters-for-this-product, recommended fix, effort.

### CRITICAL

#### C-1. <one-line finding title>

- **Severity:** Critical
- **Where:** <file:line, migration name, or "absent file" with the doc that says it should exist>
- **Exploit story:** <concrete attacker walkthrough — actual command / payload / steps; what they achieve>
- **Why it matters for THIS product:** <link to the product's value prop or trust contract; explain why this is Critical here even if it would be lower elsewhere>
- **Recommended fix:**
  1. <step 1>
  2. <step 2>
  3. <…>
- **Effort:** <XS | S | M | L | XL>

### HIGH

#### H-1. <…>

- **Severity:** High
- **Where:** <…>
- **Exploit story:** <…>
- **Why it matters for THIS product:** <…>
- **Recommended fix:** <…>
- **Effort:** <…>

### MEDIUM

#### M-1. <…>

(same shape as above)

### LOW

#### L-1. <…>

(same shape as above)

### INFORMATIONAL

#### I-1. <…>

- **Where:** <…>
- **Note:** <one paragraph — not a finding, but a flag for completeness or a future-pass item>

## 4. Accept-Risk Candidates

These are real findings the <Founder | Operator> may reasonably accept-risk
given the product's stage, scope, and audience. Each carries the rationale for
why an accept-risk decision is defensible AND triggers that should reopen it.

- **AR-1. <finding-id> (<short-title>) accepted <permanently | for the launch window | until <milestone>>.** <one-paragraph rationale>
  - **Triggers to revisit:** <concrete observable signals — traffic spike, scope expansion, feature add, etc.>

- **AR-2. <finding-id> accepted <…>.** <…>
  - **Triggers to revisit:** <…>

> Accept-Risk is a deliberate decision, not a forgotten finding. State the
> accept-risk reasoning explicitly so a future reader (or auditor) can tell
> "this was considered" from "this was missed."

## 5. Hardening Recommendations Beyond Findings

Defense-in-depth and product-quality items not tied to any specific finding above.

- **H-1. <recommendation>.** <one paragraph — what + why + effort estimate>
- **H-2. <…>**
- **H-…**

## 6. Dependencies

### Root manifest (`<package.json | pyproject.toml | Cargo.toml | …>`)

`<npm audit | pnpm audit | pip-audit | cargo audit>` summary, run <YYYY-MM-DD>:

```
total: <N>
  critical: <n>
  high:     <n>
  moderate: <n>
  low:      <n>
  info:     <n>

<one line per finding: package, version range, severity, advisory id, one-line description>
```

<Plain-language paragraph: which findings reach production runtime vs. dev-only;
what the realistic exploit window is for each; the recommended fix path
(`pnpm up …`, `npm audit fix`, semver-major upgrade, etc.).>

### Production-runtime dependencies

<list the production-runtime deps and their audit status — clean or which
findings apply. Make explicit what does NOT reach production (dev-tool chains
that show up in audit but never ship).>

## 7. Out-of-Scope Notes

These were noticed during the walk but are outside the agreed scope. Documenting
so they are not lost.

- **OoS-1.** <one paragraph: what was noticed, why it's out of scope, what the operator should do about it later>
- **OoS-2.** <…>
- **OoS-…**

---

**End of report.**
