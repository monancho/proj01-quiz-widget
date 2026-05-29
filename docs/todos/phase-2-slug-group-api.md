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

- [ ] T2-01: Add `post_slug` normalization and validation utilities.
- [ ] T2-02: Implement `GET /api/admin/quiz-sets`.
- [ ] T2-03: Add summary statistics: `totalSets`, `publishedSets`, `privateSets`, `completedSets`.
- [ ] T2-04: Implement `POST /api/admin/quiz-sets`.
- [ ] T2-05: Implement `GET /api/admin/quiz-sets/:id`.
- [ ] T2-06: Implement `PATCH /api/admin/quiz-sets/:id`.
- [ ] T2-07: Implement `DELETE /api/admin/quiz-sets/:id`.
- [ ] T2-08: Implement `GET /api/admin/quiz-sets/check-slug`.
- [ ] T2-09: Prevent publishing a Slug Group unless it has exactly 3 quizzes.

## API Checklist

- [ ] `postSlug` is trimmed, lowercased, and validated by `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- [ ] Duplicate `postSlug` returns `409`.
- [ ] Invalid input returns `400`.
- [ ] Missing Slug Group returns `404`.
- [ ] List API supports `query` and `status` filters.
- [ ] Delete cascades to quizzes through SQLite foreign key behavior.

## Verification Checklist

- [ ] Run migration with `npm.cmd run db:migrate`.
- [ ] Smoke test `GET /health`.
- [ ] Smoke test Slug Group create/list/detail/update/delete.
- [ ] Smoke test `check-slug` available/unavailable cases.
- [ ] Smoke test invalid slug format.
- [ ] Smoke test duplicate slug conflict.
- [ ] Smoke test incomplete group cannot become `published`.
- [ ] Run `git diff --check`.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.
- [ ] Commit Phase 2 changes.

## Handoff Notes

- Keep `post_slug` ownership at the Slug Group level.
- Do not accept `post_slug` in quiz APIs later.
- Phase 3 should build on the Slug Group ID returned by these endpoints.

