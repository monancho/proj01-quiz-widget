# Phase 2 TODO - Slug Group API

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `docs/02-implementation-plan.md`

## Branch

- Current branch: `feature/server-api-mvp`
- Base branch: `develop`

## Scope

Implement Phase 2 from `docs/03-task-breakdown.md`: Slug Group API.

## Out of Scope

- Phase 3 Quiz API
- Phase 4 Public Embed API
- Frontend admin UI
- iframe frontend UI
- Cloudflare Access configuration
- Deployment automation

## Implementation Checklist

- [x] T2-01: Add `post_slug` normalization and validation utilities.
- [x] T2-02: Implement `GET /api/admin/quiz-sets`.
- [x] T2-03: Add summary statistics: `totalSets`, `publishedSets`, `privateSets`, `completedSets`.
- [x] T2-04: Implement `POST /api/admin/quiz-sets`.
- [x] T2-05: Implement `GET /api/admin/quiz-sets/:id`.
- [x] T2-06: Implement `PATCH /api/admin/quiz-sets/:id`.
- [x] T2-07: Implement `DELETE /api/admin/quiz-sets/:id`.
- [x] T2-08: Implement `GET /api/admin/quiz-sets/check-slug`.
- [x] T2-09: Prevent publishing a Slug Group unless it has exactly 3 quizzes.

## API Checklist

- [x] `postSlug` is trimmed, lowercased, and validated by `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- [x] Duplicate `postSlug` returns `409`.
- [x] Invalid input returns `400`.
- [x] Missing Slug Group returns `404`.
- [x] List API supports `query` and `status` filters.
- [x] Delete cascades to quizzes through SQLite foreign key behavior.

## Verification Checklist

- [x] Run migration with `npm.cmd run db:migrate`.
- [x] Smoke test `GET /health`.
- [x] Smoke test Slug Group create/list/detail/update/delete.
- [x] Smoke test `check-slug` available/unavailable cases.
- [x] Smoke test invalid slug format.
- [x] Smoke test duplicate slug conflict.
- [x] Smoke test incomplete group cannot become `published`.
- [x] Run `git diff --check`.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [ ] Commit Phase 2 changes.

## Verification Results

- `npm.cmd run db:migrate`: completed, no pending migrations.
- `GET /health`: returned `200`.
- `npm.cmd run smoke:phase2`: passed.
- Note: smoke test requires runtime SQLite temp files, so it may need elevated execution in this sandbox.

## Handoff Notes

- Keep `post_slug` ownership at the Slug Group level.
- Do not accept `post_slug` in quiz APIs later.
- Phase 3 should build on the Slug Group ID returned by these endpoints.
