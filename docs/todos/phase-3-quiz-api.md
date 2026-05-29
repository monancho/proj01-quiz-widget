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

- [x] T3-01: Implement `GET /api/admin/quiz-sets/:setId/quizzes`.
- [x] T3-02: Implement `POST /api/admin/quiz-sets/:setId/quizzes`.
- [x] T3-03: Implement `GET /api/admin/quizzes/:id`.
- [x] T3-04: Implement `PATCH /api/admin/quizzes/:id`.
- [x] T3-05: Implement `DELETE /api/admin/quizzes/:id`.
- [x] T3-06: Prevent more than 3 quizzes per Slug Group.
- [x] T3-07: Prevent duplicate `sortOrder` inside the same Slug Group.

## API Checklist

- [x] Quiz create/update requests do not accept `postSlug`.
- [x] `setId` from the URL determines the parent Slug Group.
- [x] `sortOrder` accepts only 1, 2, or 3.
- [x] `question`, four choices, `correctPosition`, and `explanation` are required.
- [x] `correctPosition` accepts only 1, 2, 3, or 4.
- [x] Missing Slug Group returns `404`.
- [x] Missing quiz returns `404`.
- [x] Invalid input returns `400`.
- [x] Exceeding 3 quizzes returns `400`.
- [x] Duplicate `sortOrder` returns `400`.

## Verification Checklist

- [x] Run migration with `npm.cmd run db:migrate`.
- [x] Smoke test `GET /health`.
- [x] Smoke test quiz create/list/detail/update/delete.
- [x] Smoke test missing Slug Group.
- [x] Smoke test invalid `sortOrder`.
- [x] Smoke test invalid `correctPosition`.
- [x] Smoke test duplicate `sortOrder`.
- [x] Smoke test more than 3 quizzes.
- [x] Run `git diff --check`.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [x] Commit Phase 3 changes.

## Verification Results

- `npm.cmd run db:migrate`: completed, no pending migrations.
- `npm.cmd run smoke:phase2`: passed.
- `npm.cmd run smoke:phase3`: passed.
- Phase 3 implementation commit: `ebef1cc phase3: implement admin quiz api`.
- Note: smoke tests create temporary SQLite runtime files, so they may need elevated execution in this sandbox.

## Handoff Notes

- Phase 4 Public Embed API should read completed, published Slug Groups and return quiz object arrays.
- Quiz APIs must not introduce public answer-checking behavior.
- Keep response shapes friendly for the future admin UI.
