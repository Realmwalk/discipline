# Data Model

Update this document when tables/collections/fields change, persistence moves between layers, sensitive data classification changes, or import/export/migration behavior changes.

## Persistence Overview

Describe where state lives in production and local development. One short paragraph; reserve detail for the per-entity sections below.

**Canonical schema / source-of-truth file:** `path/to/schema.sql` (or Prisma file, ORM models, OpenAPI spec, "n/a — ephemeral state").

## Production Data Stores

- Store/service:
- Purpose:
- Backup/migration notes:

## Local Development Data

- File/database/cache:
- Reset process:

## Tables / Collections / Entities

### Entity Name

Purpose:

Important fields:

- `field`: Description.

Constraints / uniqueness:

- E.g. unique on `(handle)`, foreign key on `parent_id`, NOT NULL on `created_at`.

Relationships:

- Relationship description.

Never expose / server-only:

- Fields that must not appear in client responses, logs, or exports (`password_hash`, `reset_token`, internal IDs, etc.). Empty list = explicitly nothing.

## Sensitive Data

- Data type:
- Storage rule (encryption, hashing, never-stored):
- Exposure rule (which API responses include / exclude):
- Logging rule (redaction, what shows up in error logs):

## Import / Export / Seed / Migration Notes

Describe any CSV imports, schema migrations, seed data, generated files, or export tooling. For each:

- Trigger / when it runs.
- Expected columns/keys (or pointer to the source spec).
- What it produces / where it writes.

## State Change Map (optional — delete if N/A)

For projects with backends, queues, or background jobs, list each operation/endpoint/job and the entities it reads/writes. Useful when state can be touched by multiple paths.

| Operation | Reads | Writes |
|---|---|---|
| `POST /example` | `users` | `users`, `audit_log` |

Skip this section for libraries, CLI tools, or apps with no persistent operations.

## Concurrency & Atomicity (optional — delete if N/A)

For projects with contended writes, document:

- Locking strategy (DB transactions, application-level mutexes, optimistic concurrency).
- Idempotency keys / replay protection.
- Transaction boundaries (what is and is not atomic).
- Race conditions known about and how they are handled.

Skip for projects without concurrent writes.

## Derived / Computed State (optional — delete if N/A)

For state derived from other state rather than stored:

- Derivation rule.
- Where it is computed (SQL view, application code, per-request).
- What invalidates it.

Skip for projects without derived state.
