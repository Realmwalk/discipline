# API Reference

Update this document when endpoints, request/response shapes, auth behavior, rate limits, or external integrations change.

## Conventions

- **Base URL / path prefix:** `https://api.example.com` (or `/api`)
- **Versioning:** versioned via path (`/v1/...`), header (`X-API-Version`), or unversioned. Note the strategy.
- **Content type:** `application/json` by default; note exceptions (streaming, multipart, non-JSON) per endpoint.
- **Authentication:** e.g. `Authorization: Bearer <token>`, session cookie, API key header. State the format once here; per-endpoint sections only flag deviations.

Adjust headings for non-REST surfaces (GraphQL → "Schema", "Operations", "Subscriptions"; tRPC → "Routers", "Procedures").

## Rate Limiting

If the API enforces rate limits, document the matrix once here so per-endpoint sections only flag deviations.

| Route group | Limit | Window | 429 response shape |
|---|---|---|---|
| Auth (login, register, reset) | 10 | 15 min | `{ "error": "rate_limited", "retry_after": <seconds> }` |
| Public reads | 60 | 1 min | (same) |

Delete this section if the API has no rate limiting.

## Public Endpoints

(Endpoints that do not require authentication.)

### `METHOD /path`

Purpose:

Auth required: no

Request:

```json
{}
```

Response on success:

```json
{}
```

Errors:

| Status | Code | Meaning |
|---|---|---|
| 400 | `invalid_input` | request body failed validation |
| 404 | `not_found` | resource does not exist |

Validation:

- `field`: rule (e.g. min length 3, regex, allowed values).

Privacy / never-returned fields:

- Fields the response intentionally omits even though they exist on the underlying entity.

## Authenticated Endpoints

(Endpoints that require auth. State the auth method once at the top of this group if it differs from the global Conventions.)

### `METHOD /path`

Purpose:

Auth required: yes

Request:

```json
{}
```

Response on success:

```json
{}
```

Response on conflict / locked / partial state (if applicable, show distinct shapes):

```json
{}
```

Errors:

| Status | Code | Meaning |
|---|---|---|
| 401 | `unauthorized` | missing or invalid token |
| 403 | `forbidden` | authenticated but not allowed |
| 409 | `conflict` | state conflict (e.g. already claimed) |

Validation:

- `field`: rule.

Privacy / never-returned fields:

- (list, or "none — see Conventions")

Rate limit (if endpoint-specific): see Rate Limiting table above, or override here.

## Streaming / Non-JSON Endpoints (optional)

For endpoints returning bytes, server-sent events, multipart, or other non-JSON shapes. Document content-type, framing, and termination behavior per endpoint.

### `METHOD /path`

Content-Type:

Stream framing / terminator:

Auth required:

Failure behavior (mid-stream errors):

## External Integrations

For each third-party API, queue, mail provider, etc.:

- Service:
- Purpose:
- Env vars:
- Retry / timeout behavior:
- Data leaving the system (what fields are sent out):
- Failure behavior (what the user sees if the integration is down):
