# Phase 3 TODO - Quiz API

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `docs/02-implementation-plan.md`
- `docs/todos/phase-2-slug-group-api.md`

## Branch

- Current branch: `feature/server-api-mvp`
- Base branch: `develop`

## Scope

Implement Phase 3 from `docs/03-task-breakdown.md`: Admin Quiz API.

## Out of Scope

- Phase 4 Public Embed API
- Frontend admin UI
- iframe frontend UI
- Markdown/LaTeX rendering
- Cloudflare Access configuration
- Deployment automation

## Implementation Checklist

- [ ] T3-01: Implement `GET /api/admin/quiz-sets/:setId/quizzes`.
- [ ] T3-02: Implement `POST /api/admin/quiz-sets/:setId/quizzes`.
- [ ] T3-03: Implement `GET /api/admin/quizzes/:id`.
- [ ] T3-04: Implement `PATCH /api/admin/quizzes/:id`.
- [ ] T3-05: Implement `DELETE /api/admin/quizzes/:id`.
- [ ] T3-06: Prevent more than 3 quizzes per Slug Group.
- [ ] T3-07: Prevent duplicate `sortOrder` inside the same Slug Group.

## API Checklist

- [ ] Quiz create/update requests do not accept `postSlug`.
- [ ] `setId` from the URL determines the parent Slug Group.
- [ ] `sortOrder` accepts only 1, 2, or 3.
- [ ] `question`, four choices, `correctPosition`, and `explanation` are required.
- [ ] `correctPosition` accepts only 1, 2, 3, or 4.
- [ ] Missing Slug Group returns `404`.
- [ ] Missing quiz returns `404`.
- [ ] Invalid input returns `400`.
- [ ] Exceeding 3 quizzes returns `400`.
- [ ] Duplicate `sortOrder` returns `400`.

## Verification Checklist

- [ ] Run migration with `npm.cmd run db:migrate`.
- [ ] Smoke test `GET /health`.
- [ ] Smoke test quiz create/list/detail/update/delete.
- [ ] Smoke test missing Slug Group.
- [ ] Smoke test invalid `sortOrder`.
- [ ] Smoke test invalid `correctPosition`.
- [ ] Smoke test duplicate `sortOrder`.
- [ ] Smoke test more than 3 quizzes.
- [ ] Run `git diff --check`.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.
- [ ] Commit Phase 3 changes.

## Handoff Notes

- Phase 4 Public Embed API should read completed, published Slug Groups and return quiz object arrays.
- Quiz APIs must not introduce public answer-checking behavior.
- Keep response shapes friendly for the future admin UI.

