# Phase 4 TODO - Public Embed API

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `docs/02-implementation-plan.md`
- `docs/todos/phase-2-slug-group-api.md`
- `docs/todos/phase-3-quiz-api.md`

## Branch

- Current branch: `feature/server-api-mvp`
- Base branch: `develop`

## Scope

Implement Phase 4 from `docs/03-task-breakdown.md`: Public Embed API.

## Out of Scope

- Frontend iframe UI
- Frontend admin UI
- Markdown/LaTeX rendering
- Static banner rendering
- Cloudflare Access configuration
- Deployment automation

## Implementation Checklist

- [x] T4-01: Implement `GET /api/embed/:slug/quizzes`.
- [x] T4-02: Return `200 OK` and `[]` for missing, private, or incomplete Slug Groups.
- [x] T4-03: Convert quiz rows into public response shape with `choices`, `answerPosition`, and `correctAnswer`.
- [x] T4-04: Add CORS configuration from `CORS_ALLOWED_ORIGINS`.

## API Checklist

- [x] Public response is a quiz object array only.
- [x] Public response does not include banner data.
- [x] Public response does not include metadata wrapper objects.
- [x] Missing Slug Group returns `200` with `[]`.
- [x] Private Slug Group returns `200` with `[]`.
- [x] Published but incomplete Slug Group returns `200` with `[]`.
- [x] Published complete Slug Group returns exactly 3 quizzes sorted by `sortOrder`.
- [x] Each quiz includes `id`, `question`, `choices`, `answerPosition`, `correctAnswer`, and `explanation`.

## Verification Checklist

- [x] Run migration with `npm.cmd run db:migrate`.
- [x] Smoke test `GET /health`.
- [x] Smoke test Phase 2 admin APIs.
- [x] Smoke test Phase 3 quiz APIs.
- [x] Smoke test missing slug returns `[]`.
- [x] Smoke test private Slug Group returns `[]`.
- [x] Smoke test incomplete published Slug Group returns `[]`.
- [x] Smoke test complete published Slug Group returns 3 quizzes.
- [x] Smoke test public response has no metadata wrapper.
- [x] Smoke test CORS allowed origin header.
- [x] Run `git diff --check`.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [x] Commit Phase 4 changes.

## Verification Results

- `npm.cmd run db:migrate`: completed, no pending migrations.
- `npm.cmd run smoke:phase2`: passed.
- `npm.cmd run smoke:phase3`: passed.
- `npm.cmd run smoke:phase4`: passed.
- Phase 4 implementation commit: `079b8a6 phase4: implement public embed api`.
- Note: smoke tests create temporary SQLite runtime files, so they may need elevated execution in this sandbox.

## Handoff Notes

- Phase 5 iframe frontend should call this API from `/embed/:postSlug`.
- MVP intentionally exposes answer position and explanation to the frontend.
- Do not add answer-checking POST endpoints in this phase.
