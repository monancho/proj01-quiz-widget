# Admin Runtime Token Auth Restore TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-06-10.md`
- `docs/todos/admin-frontend-auth-gate-removal.md`
- `docs/todos/security-s0-s1-admin-auth.md`

## Scope

- Restore runtime Admin token entry for the Admin frontend.
- Store the entered token only in browser `sessionStorage`.
- Attach the token to Quiz backend Admin API requests as a bearer token.
- Keep `ADMIN_API_TOKEN` out of frontend build variables, source constants, logs, and UI examples.
- Preserve existing manual quiz CRUD and AI generation workflows.

## Out Of Scope

- Changing AI Server backend secret handling.
- Adding Doodle or image moderation integration.
- Storing Admin secrets in Cloudflare Pages build variables.
- Deployment, push, or PR creation.

## Implementation Checklist

- [x] Add a small Admin session storage helper.
- [x] Attach the stored token in the Admin API client.
- [x] Restore an Admin runtime token gate UI.
- [x] Restore logout behavior that clears the token and local Admin view state.

## Verification Checklist

- [x] Run frontend build.
- [x] Run backend security smoke test.
- [x] Search frontend code for accidental frontend env secret usage or source logging.
- [x] Run `git status`.

## Handoff Notes

- In production, set the real token only in the backend/OCI env file.
- The frontend should receive the token only from the human admin at runtime.
