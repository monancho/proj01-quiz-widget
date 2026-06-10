# AI Quiz Generation Admin UI TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-06-10.md`
- `docs/03-task-breakdown.md`
- `docs/todos/ai-quiz-generation-backend.md`

## Scope

- Add Admin frontend API helpers for AI text, web URL, and YouTube quiz generation.
- Add an AI generation entry point to the Admin Slug Group detail quiz header.
- Allow AI generation only when the selected Slug Group has no quizzes.
- Add an Admin modal for source type, difficulty, source input, loading, and friendly error messages.
- Refresh the existing quiz list after successful generation.
- Show source warnings from successful generation in the Admin detail view.

## Out Of Scope

- Doodle integration.
- Image moderation UI or API exposure.
- Any frontend exposure of `AI_SERVER_API_KEY`.
- Changes to existing manual quiz create, edit, delete, reorder, iframe preview, or copy workflows.
- Deployment, push, or PR creation.

## Implementation Checklist

- [x] Add `generateTextQuizzes(setId, payload)` to `client/src/api/adminApi.js`.
- [x] Add `generateWebQuizzes(setId, payload)` to `client/src/api/adminApi.js`.
- [x] Add `generateYoutubeQuizzes(setId, payload)` to `client/src/api/adminApi.js`.
- [x] Add `AI 생성` button to the Slug Group detail quiz header.
- [x] Disable `AI 생성` when the Slug Group already has quizzes.
- [x] Add AI generation modal with source type, difficulty, input, submit, cancel, loading, and errors.
- [x] Map backend/AI error codes to user-facing Korean messages.
- [x] Show successful `source.warning` messages without keeping the modal open.
- [x] Refresh quizzes and Slug Group summary after successful generation.

## Verification Checklist

- [x] Run frontend build.
- [x] Run relevant backend smoke test if needed.
- [ ] Verify empty Slug Group shows enabled AI generation entry.
- [ ] Verify non-empty Slug Group blocks AI generation entry.
- [ ] Verify short text error shows `SOURCE_TEXT_TOO_SHORT` friendly message.
- [x] Run `git status`.

Browser UI verification was attempted, but the in-app browser runtime could not start in this Windows sandbox session.

## Handoff Notes

- The frontend must call only Quiz backend Admin APIs.
- Secrets remain backend-only and must not appear in code, logs, UI, or env examples.
- AI generation saves exactly 3 quizzes through backend validation.
