# AI Quiz Generation Backend TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `C:/dev_work/ocl_ai_server_01/docs/API_SPECIFICATION.md`
- `C:/dev_work/ocl_ai_server_01/docs/BACKEND_INTEGRATION_GUIDE.md`
- `C:/dev_work/ocl_ai_server_01/docs/development/API_RESPONSE_SAMPLES.md`
- `C:/dev_work/ocl_ai_server_01/docs/development/BACKEND_CLIENT_EXAMPLES.md`

## Scope

- Add a Quiz backend AI Server client that calls the Dockerized AI Server.
- Load `AI_SERVER_BASE_URL`, `AI_SERVER_API_KEY`, and `AI_SERVER_TIMEOUT_SECONDS`.
- Use `X-Internal-Api-Key` for AI Server requests.
- Add admin-authenticated health/ready proxy checks.
- Add admin-authenticated text, web, and YouTube quiz generation endpoints.
- Store generated 3-question results in the existing `quizzes` table.
- Preserve existing Slug Group, quiz, admin auth, and public embed behavior.

## Out Of Scope

- Frontend AI generation UI.
- User accounts, billing, quota, or per-user usage tracking.
- Database schema changes.
- Exposing AI Server or `AI_SERVER_API_KEY` to the frontend.
- Adding `OPENAI_API_KEY` to the Quiz backend.
- Production deployment, GitHub push, or PR creation.
- Public image moderation endpoints in this Quiz backend.

## Implementation Checklist

- [x] Add AI Server env values to backend config.
- [x] Add AI Server env examples for local and OCI usage.
- [x] Add common AI Server client with JSON wrapper parsing.
- [x] Add multipart image moderation client method scaffold.
- [x] Map AI Server errors to backend `AppError` responses.
- [x] Add AI quiz generation service with 3-question validation.
- [x] Add admin AI health/ready route.
- [x] Add admin text/web/youtube generation routes under Slug Group quiz routes.
- [x] Reject AI generation when the Slug Group already has quizzes.
- [x] Persist generated questions with `answer_index: 0` as `correctPosition: 1`.
- [x] Return `source.warning`, `usage`, and AI request id metadata where available.

## Verification Checklist

- [x] AI Server health/ready client calls are covered.
- [x] Invalid AI key maps to `INVALID_API_KEY`.
- [x] Timeout/network/non-2xx handling is covered.
- [x] Mock text generation stores exactly 3 quizzes.
- [x] Invalid generated question shapes are rejected and not saved.
- [x] Short text and invalid difficulty behavior is covered.
- [x] Existing phase smoke tests still pass.
- [x] Final `git status` is checked.

## Rollback Notes

- Remove AI route registrations from `server/src/app.js`.
- Remove AI client/service/route files under `server/src`.
- Remove AI env entries from examples and config.
- Remove AI smoke script and package script.
- No DB rollback should be required because no migration is planned.

## Handoff Notes

- Local AI Server default: `http://localhost:8000`.
- OCI Docker Compose AI Server default: `http://ai-server:8000`.
- The real `AI_SERVER_API_KEY` must stay server-side only.
