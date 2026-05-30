# Security Hardening Plan

## Goal

Protect the deployed quiz widget without breaking the public iframe embed flow.

The public widget must remain readable from Tistory and blog visitors. Admin-only
management routes and APIs must require explicit authorization.

## Security Parsers

### S0. Admin API Access Control

Protect `POST`, `PATCH`, `DELETE`, and read access under `/api/admin/*` with an
admin token.

Expected output:

- Backend middleware for `/api/admin/*`.
- `ADMIN_API_TOKEN` environment variable.
- Public `/health` and `/api/embed/*` remain unauthenticated.

### S1. Admin Frontend Session Gate

Add a lightweight admin token gate to `/admin`.

Expected output:

- Admin token input screen.
- Token stored only in browser session storage.
- Admin API requests include the token.
- Logout clears the token.

### S2. Deployment Secret Handling

Document how to set production secrets without committing them.

Expected output:

- Env examples use placeholders only.
- OCI server gets the real `ADMIN_API_TOKEN` in its local env file.
- Cloudflare Pages does not need the admin token as a build variable.

### S3. Optional Cloudflare Access Layer

Add a second gate at the edge for `/admin*`.

Expected output:

- Cloudflare Access protects `https://monancho.com/admin*`.
- Public `https://monancho.com/embed/*` stays open.
- API-level token remains the source of truth for admin API protection.

### S4. Verification

Verify protected and public paths separately.

Expected output:

- Unauthenticated `/api/admin/*` returns `401`.
- Authenticated `/api/admin/*` works.
- `/api/embed/*` still works without a token.
- `/admin` can load, accept a token, and call the API.

## Current First Pass

Implement S0 and S1 first. S2 documentation should be updated in the same pass
because deployment needs the new env variable before the updated image is used.
S3 is a separate Cloudflare console task and should not block app-level security.
