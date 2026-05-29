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

- [ ] T4-01: Implement `GET /api/embed/:slug/quizzes`.
- [ ] T4-02: Return `200 OK` and `[]` for missing, private, or incomplete Slug Groups.
- [ ] T4-03: Convert quiz rows into public response shape with `choices`, `answerPosition`, and `correctAnswer`.
- [ ] T4-04: Add CORS configuration from `CORS_ALLOWED_ORIGINS`.

## API Checklist

- [ ] Public response is a quiz object array only.
- [ ] Public response does not include banner data.
- [ ] Public response does not include metadata wrapper objects.
- [ ] Missing Slug Group returns `200` with `[]`.
- [ ] Private Slug Group returns `200` with `[]`.
- [ ] Published but incomplete Slug Group returns `200` with `[]`.
- [ ] Published complete Slug Group returns exactly 3 quizzes sorted by `sortOrder`.
- [ ] Each quiz includes `id`, `question`, `choices`, `answerPosition`, `correctAnswer`, and `explanation`.

## Verification Checklist

- [ ] Run migration with `npm.cmd run db:migrate`.
- [ ] Smoke test `GET /health`.
- [ ] Smoke test Phase 2 admin APIs.
- [ ] Smoke test Phase 3 quiz APIs.
- [ ] Smoke test missing slug returns `[]`.
- [ ] Smoke test private Slug Group returns `[]`.
- [ ] Smoke test incomplete published Slug Group returns `[]`.
- [ ] Smoke test complete published Slug Group returns 3 quizzes.
- [ ] Smoke test public response has no metadata wrapper.
- [ ] Smoke test CORS allowed origin header.
- [ ] Run `git diff --check`.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.
- [ ] Commit Phase 4 changes.

## Handoff Notes

- Phase 5 iframe frontend should call this API from `/embed/:postSlug`.
- MVP intentionally exposes answer position and explanation to the frontend.
- Do not add answer-checking POST endpoints in this phase.

