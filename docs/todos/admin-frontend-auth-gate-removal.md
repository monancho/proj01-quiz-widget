# Admin Frontend Auth Gate Removal TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-06-10.md`
- `docs/todos/security-s0-s1-admin-auth.md`

## Scope

- Remove the Admin frontend token input gate.
- Stop the Admin frontend from reading, storing, or sending an admin token.
- Keep Admin frontend API calls pointed only at the Quiz backend.
- Preserve existing Admin CRUD and AI generation UI workflows.

## Out Of Scope

- Exposing `ADMIN_API_TOKEN` or `AI_SERVER_API_KEY` to frontend code.
- Adding Doodle or image moderation integration.
- Changing AI Server backend secret handling.
- Deployment, push, or PR creation.

## Implementation Checklist

- [x] Remove Admin token session storage usage from the Admin API client.
- [x] Remove `/admin` token gate UI from the Admin page.
- [x] Remove token-specific logout behavior from the Admin page.
- [x] Delete unused Admin session utility if no references remain.

## Verification Checklist

- [x] Search frontend code for admin token session usage.
- [x] Run frontend build.
- [x] Run relevant backend smoke tests.
- [x] Run `git status`.

## Handoff Notes

- If the backend is configured with `ADMIN_API_TOKEN`, tokenless browser calls will still be rejected by the backend.
- Do not solve this by placing secrets in frontend env, source code, logs, or UI.
