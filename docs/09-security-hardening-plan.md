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

### S1. Admin Frontend Access Boundary

Do not place admin secrets in the frontend. The `/admin` UI should call only the
Quiz backend and should not ask users to paste backend secrets into the browser.

Expected output:

- No admin token input screen in the frontend.
- No admin token in browser session storage.
- No admin token in frontend API request headers.
- Optional edge protection, such as Cloudflare Access, can guard `/admin*`.

### S2. Deployment Secret Handling

Document how to set production secrets without committing them.

Expected output:

- Env examples use placeholders only.
- OCI server gets the real `ADMIN_API_TOKEN` in its local env file.
- Cloudflare Pages does not need the admin token as a build variable.
- Frontend code and browser storage do not carry the admin token.

### S3. Optional Cloudflare Access Layer

Add a second gate at the edge for `/admin*`.

Expected output:

- Cloudflare Access protects `https://monancho.com/admin*`.
- Public `https://monancho.com/embed/*` stays open.
- Backend-side API protection remains server-controlled and must not require
  pasting secrets into the frontend.

### S4. Verification

Verify protected and public paths separately.

Expected output:

- Unauthenticated `/api/admin/*` returns `401`.
- Authenticated `/api/admin/*` works.
- `/api/embed/*` still works without a token.
- `/admin` can load without a token input screen and call the configured API.

## Current First Pass

S1 was revised after frontend testing: the Admin frontend must not collect or
store backend secrets. S2 documentation should keep secrets server-side only.
S3 is a separate Cloudflare console task and should not block app-level security.
