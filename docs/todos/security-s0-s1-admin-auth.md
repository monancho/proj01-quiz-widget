# Security S0-S1 Admin Auth TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/09-security-hardening-plan.md`
- Current deployed frontend/API behavior confirmed by the user

## Scope

- Add app-level admin API token authentication.
- Keep public iframe APIs open.
- Add an admin frontend token gate for `/admin`.
- Store the admin token only in `sessionStorage`.
- Document production secret handling for OCI deployment.

## Out Of Scope

- Full user accounts, roles, password reset, or database-backed sessions.
- Cloudflare Access setup automation.
- Tistory iframe access restriction.
- Changing public quiz behavior or the admin CRUD workflow.

## Implementation Checklist

- [x] Add `ADMIN_API_TOKEN` support to server env config.
- [x] Add admin auth middleware for `/api/admin/*`.
- [x] Keep auth disabled only when no token is configured in local development.
- [x] Return clear JSON errors for missing or invalid admin tokens.
- [x] Add frontend admin auth state and session storage handling.
- [x] Send `Authorization: Bearer <token>` with admin API requests.
- [x] Add a logout control in the admin screen.
- [x] Update env examples and deployment docs with placeholder-only secret guidance.
- [x] Update project status and worklog.

## Verification Checklist

- [x] Backend smoke check: admin API without token returns `401` when token is configured.
- [x] Backend smoke check: admin API with token succeeds.
- [x] Backend smoke check: public embed API remains unauthenticated.
- [x] Client build passes.
- [x] Git status reviewed before commit.

## Rollback Notes

- The backend auth change is isolated to the admin route middleware and env config.
- The frontend gate is isolated to the admin page/API client path.
- Removing `ADMIN_API_TOKEN` in local development keeps the old local behavior.

## Handoff Notes

- Before deploying the updated backend image, set `ADMIN_API_TOKEN` in the OCI API env file.
- The admin token is a secret and must not be committed.
- Cloudflare Access can be added later as an extra edge-level gate for `/admin*`.
