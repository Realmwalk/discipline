# Deployment

Update this document when hosting, environment variables, secrets, deployment commands, CI/CD, launch checklist, or production operations change.

## Pre-Deploy Gate (Hard Requirement)

This gate **fails closed**: no phase that ships code to a public surface may proceed unless the gate passes. "Public surface" means anything reachable by users outside the dev team — production URL, staged URL with real users, public CDN-fronted artifact, public API endpoint.

**Gate condition:** a current `docs/SECURITY_AUDIT_<YYYY-MM-DD>.md` exists, **EITHER** (a) ≤90 days old, **OR** (b) covering all changes since the last audit, **whichever is stricter**. Stricter = whichever produces the more recent required-audit cutoff for this deploy.

**If the gate fails:**

- Invoke the `security-reviewer` subagent (see `templates/agents/SECURITY_REVIEWER.md`).
- Do not proceed to any phase that ships code to a public surface until the audit lands.
- The audit becomes the new `docs/SECURITY_AUDIT_<YYYY-MM-DD>.md` of record.

**Reviewer accept-risk:** only the stakeholder named in `docs/agents/STAKEHOLDER.md` (or the equivalent role contract for this project) can accept-risk a finding to unblock the gate. The acceptance is recorded in the audit's "Accept-Risk Candidates" section with explicit rationale (severity, blast radius, reason for accepting, expiry / re-evaluation date). The host does NOT have authority to accept-risk.

**This gate also applies to:**

- Schema migrations on production data — even if the migration is shipped via a separate tool from the standard deploy flow.
- Secrets rotation that touches the deploy pipeline (rotating the deploy provider's API key, rotating the production database credential, etc.).
- Any change to the auth surface — auth provider swap, session-handling change, token issuance/verification change — even if those don't ship via the standard deploy phases.

In other words: anywhere a change crosses the trust boundary between dev and production, the gate applies.

## Phased Rollout

Non-trivial deployments rarely happen in one shot — they unfold across phases that gate each other (DNS before TLS, schema before service, secrets before first traffic). Capture that explicitly so the operator can resume at any green-light state and know exactly what's been verified and what hasn't.

### Dependency graph

A short ASCII or bulleted graph showing which phases block which. Each arrow is a hard gate: the next phase cannot start until the previous one's exit criteria are green. Parallel phases are allowed when they share no inputs.

```
Phase A (source on <git-host>) ──► Phase B (<frontend-host> project)
                                            │
                                            ▼
                                   Phase C (<backend-or-worker>)
                                            │
                                            ▼
                  Phase D (wire frontend ↔ backend env vars) ──► Phase E (custom domain + TLS)
                                            │                              │
                                            ▼                              ▼
                                   Phase F (<email-routing>)      Phase G (analytics, parallel to F)
                                            │
                                            ▼
                                   Phase H (<feature-flag-flip>)
                                            │
                                            ▼
                                   Phase I (<asset-or-OG-pass>)
                                            │
                                            ▼
                                   Phase J (<optional-extension>)
```

Even a tiny graph like `Phase A → Phase B → Phase C, Phase D (parallel to B)` is enough to seed the pattern. Replace with the real shape of this project's deploy.

### Phase outline

For each phase: a 1-line goal, the steps, **exit criteria** (testable conditions that must hold before the next phase begins), and a **rollback path** (what reverting this phase looks like, or a callout that it's not safely reversible).

#### Phase A — <source-on-git-host> (~5 min)

Goal: get the canonical source on the git host that the deploy provider authorizes.

Exit criteria:
- [ ] Repo created at `<git-host>/<org>/<repo>`.
- [ ] `main` branch pushed; remote tracking confirmed (`git remote -v`).
- [ ] `<deploy-provider>` can read the repo (test via OAuth flow or `gh repo view`).

Rollback: trivial — delete or unlink the remote. No production impact yet.

#### Phase B — <frontend-host> first deploy (~10 min)

> **Pre-Deploy Gate must pass before this phase** — see "Pre-Deploy Gate (Hard Requirement)" above. This is the first phase that puts code on a public-reachable URL.

Goal: build artifact lands at the provider's default URL (`<project>.<provider>.app`) with no env vars wired.

Exit criteria:
- [ ] First build succeeds in the provider dashboard.
- [ ] Default URL serves the app; degraded features (those needing env vars) gracefully no-op.
- [ ] Build command and output directory captured in the dashboard config.

Rollback: delete the project, or roll back to "no deployments" state. Reversible.

#### Phase C — <backend-or-worker> deploy (~15 min)

> **Pre-Deploy Gate must pass before this phase** — see "Pre-Deploy Gate (Hard Requirement)" above. Backend ships code to a public-reachable URL.

Goal: backend service is live and reachable; smoke-test endpoint returns expected shape.

Exit criteria:
- [ ] Service deployed (`<provider> deploy` or equivalent prints a live URL).
- [ ] Health-check endpoint returns 200 with expected JSON.
- [ ] Persistent stores (KV / DB / cache) bound to the service.

Rollback: redeploy from the previous git commit (`<provider> rollback` or checkout-and-redeploy). Reversible.

#### Phase D — wire frontend ↔ backend (~5 min)

Goal: frontend env vars point at the backend URL from Phase C; rebuild bakes them in.

Exit criteria:
- [ ] `<FRONTEND_API_URL>` set in frontend host's production env.
- [ ] Triggered rebuild has the new env baked in.
- [ ] End-to-end smoke flow (load → action → write → read) works in production.

Rollback: clear the env var and redeploy — frontend reverts to "degraded but functional" state from Phase B. Reversible.

#### Phase E — custom domain + TLS (~10 min)

Goal: `<custom-domain>` resolves to the frontend with a valid certificate.

Exit criteria:
- [ ] Apex (`<custom-domain>`) and `www.<custom-domain>` both routed.
- [ ] SSL/TLS certificate active (provider dashboard shows green).
- [ ] Curl from external network confirms 200 + valid cert.
- [ ] Backend CORS allowlist tightened to the new origin and redeployed.

Rollback: **partially reversible.** Removing the custom domain in the dashboard reverts traffic to the default URL within minutes. **DNS nameserver changes (if any) are not instantly reversible** — TTL-bounded propagation, up to 48h. Document the previous nameservers before changing them.

#### Phase F — <email-routing> (~5 min, parallel to G)

Goal: `<address>@<custom-domain>` routes to operator inbox.

Exit criteria:
- [ ] Routing rule created.
- [ ] Destination address verified (verification link clicked).
- [ ] Test email round-trips end-to-end.

Rollback: disable the routing rule. Reversible.

#### Phase G — analytics (~3 min, parallel to F)

Goal: traffic visibility from minute one of public launch.

Exit criteria:
- [ ] Snippet or first-party endpoint live.
- [ ] First test pageview shows in the analytics dashboard.

Rollback: remove the snippet, redeploy. Reversible.

#### Phase H — <feature-flag-flip> (when ready)

Goal: turn on a gated feature (donation link, premium tier, beta surface) once its operational prerequisites land.

Exit criteria:
- [ ] Prerequisites listed under this phase are all green (e.g. payment account exists, legal copy reviewed).
- [ ] Feature env var set in production scope.
- [ ] Feature renders in production smoke test.

Rollback: clear the env var and redeploy. Reversible.

#### Phase I — <asset-or-OG-pass> (queued)

Goal: production polish — share images, favicons, manifest, accessibility metadata.

Exit criteria:
- [ ] Asset(s) committed at `<asset-paths>`.
- [ ] Meta tags present in `<entry-html>`.
- [ ] Validated via `<og-checker>` or similar.

Rollback: revert the commit. Reversible.

#### Phase J — <optional-extension> (deferred)

Goal: a follow-on capability funded as a later shape (account sync, additional platform target, paid tier wiring). Has its own internal sub-phases.

Exit criteria:
- [ ] Sub-phase J.1 … J.N each green (define inline).
- [ ] End-to-end smoke for the new capability passes.

Rollback: feature is gated behind env vars / secrets — clearing them disables the capability without code rollback. Reversible by config; data written during the phase persists unless explicitly cleaned up.

### Rollback summary

| Phase | Reversible? | Notes |
|---|---|---|
| A | Yes | Remove remote / delete repo. |
| B | Yes | Delete project / promote previous deploy. |
| C | Yes | Redeploy previous git commit. |
| D | Yes | Clear env var, redeploy. |
| E | **Partial** | Domain unlink is fast; nameserver changes are TTL-bounded (up to 48h). |
| F | Yes | Disable routing rule. |
| G | Yes | Remove snippet, redeploy. |
| H | Yes | Clear feature env var, redeploy. |
| I | Yes | Revert asset commit. |
| J | Config-reversible | Clearing secrets disables capability; persisted data may need explicit cleanup. |

Call out any phase that performs an **irreversible** action (e.g. destructive schema migration, billing-account creation, third-party data deletion) directly in that phase's rollback line.

## Stack

| Layer | Service | Cost / Tier | Notes |
|---|---|---|---|
| Frontend | (e.g. GitHub Pages, Vercel, Netlify) | | |
| Backend | (e.g. Railway, Fly.io, self-hosted) | | |
| Database | (e.g. Supabase, RDS, SQLite file) | | |
| Email / notifications | (e.g. Resend, Postmark) | | |
| Storage / CDN | | | |
| Other services | | | |

For non-cloud deployments (CLI tool, Docker artifact, distributed binary), repurpose the table to capture distribution channel, build target, and signing/release service.

## Environment Variables

### Public config (safe to commit, e.g. `.env.example`)

```text
VARIABLE_NAME=description
```

### Secrets (server-only, NEVER committed)

```text
SECRET_NAME=how to generate it
```

Note: secrets must come from a secrets manager (Railway / Vercel / Fly env, Doppler, 1Password, etc.) — never checked into the repo and never logged. Add a `.env.example` with placeholder values; gitignore the real `.env`.

## Local Setup

```bash
# install
# copy .env.example -> .env, fill in values
# run dev server
# run tests
```

## Production Setup

Numbered steps to bring the project up from scratch. Group by tier where applicable (database → backend → frontend → email → automation):

1. Step one.
2. Step two.
3. Step three.

## Data / Seed Setup

For the one-time bootstrap distinct from code deploy: schema migrations, seed data, asset uploads, code/voucher imports, etc.

1. Step.
2. Step.

Skip if the project has no persistent state to seed.

## Custom Domain / Distribution (optional)

For web apps: DNS configuration, certificate setup, custom domain mapping.
For CLI tools / libraries: package registry publishing (npm, PyPI, crates.io), binary distribution, signing.
For Docker: image registry, tag conventions.

Skip if the project ships only at a default URL or has no distribution channel.

## CI/CD

- **Trigger:** when does CI run (push to main, PR, tag, manual)?
- **Required checks:** what must pass before merge / deploy?
- **Deploy target:** what gets deployed where on success?
- **Secrets source:** where does CI get production secrets from?
- **Rollback hook:** how to abort a bad deploy mid-flight if possible.

## Launch Checklist

Group by category so nothing slips. Tick everything before declaring launch.

### Infrastructure
- [ ] Hosting provider provisioned.
- [ ] DNS / custom domain pointed.
- [ ] HTTPS / TLS verified.
- [ ] Monitoring / logging hooked up.

### Code
- [ ] Production env vars set.
- [ ] Tests pass on the deploy branch.
- [ ] Build artifact verified (no debug flags, no test data).

### Data
- [ ] Schema migrations applied.
- [ ] Seed data imported.
- [ ] Backups configured.

### Verification
- [ ] Smoke test core user flows.
- [ ] Health-check / version endpoint responding.
- [ ] Rollback plan documented (see below).

## Post-Deploy Verification

After every deploy (initial or subsequent):

- Hit the health-check / version endpoint.
- Smoke test the critical user flow.
- Check logs for unexpected errors in the first 5 minutes.
- Confirm no regression in monitoring metrics.

## Day-2 Operations / Updating

For routine updates after launch (distinct from initial deploy):

1. Step (e.g. push to main → CI deploys → verify).
2. Step.

Schema changes, secret rotation, and dependency updates each get their own short procedure — link or fold them in here.

## Rollback

Three rollback surfaces, each with their own procedure:

- **Code rollback:** how to revert to the previous deploy (Git tag, hosting provider's previous deployment, container image swap).
- **Schema / data rollback:** how to revert a migration or restore a backup. Note schema changes that are NOT safely reversible.
- **Configuration / secrets rollback:** how to revert env-var or feature-flag changes.

## Cost & Scaling (optional)

For deployments where cost-per-tier matters or scaling thresholds will eventually trigger:

- Current tier cost / monthly burn.
- Free-tier or starter-tier limits (request count, storage, bandwidth).
- Triggers that would warrant an upgrade.
- Largest cost levers if costs spike.

Skip if the project is self-hosted on owned hardware, runs at fixed cost, or is too small to care.

### Cost summary

One row per phase that incurs cost, with the provider, tier, and monthly cost at MVP scale. Use placeholders until real numbers are known.

| Phase | Provider | Tier | Monthly cost |
|---|---|---|---|
| B — <frontend-host> | `<provider>` | `<free / hobby / pro>` | `$<n>` |
| C — <backend-or-worker> | `<provider>` | `<free / hobby / pro>` | `$<n>` |
| C — datastore (KV / DB) | `<provider>` | `<tier>` | `$<n>` |
| E — domain registration | `<registrar>` | n/a | `$<n>/yr` (~`$<n>/mo`) |
| F — <email-routing> | `<provider>` | `<tier>` | `$<n>` |
| G — analytics | `<provider>` | `<tier>` | `$<n>` |
| H — <feature-flag-flip> | `<provider>` | `<tier>` | `$<n>` |
| J — <optional-extension> | `<provider>` | `<tier>` | `$<n>` |
| **Total at MVP scale** | | | **`$<n>/mo`** |

Note any line item that's `$0` only while under a free-tier ceiling, with the trigger that would push it to paid (e.g. *"$0/mo while under 100k requests/day; $5/mo if exceeded"*).
