# Phase 6 TODO - Admin MVP

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `docs/02-implementation-plan.md`
- `docs/todos/phase-2-slug-group-api.md`
- `docs/todos/phase-3-quiz-api.md`
- `docs/todos/phase-5-client-embed-mvp.md`

## Branch

- Current branch: `feature/admin-mvp`
- Base branch: `develop`

## Scope

Implement Phase 6 from `docs/03-task-breakdown.md`: local admin frontend MVP for managing Slug Groups and quizzes.

## Out of Scope

- Login or user account implementation
- Cloudflare Access configuration
- Markdown/LaTeX rendering
- Banner CRUD
- Tistory post management
- Deployment automation
- Production auth or permission logic

## Implementation Checklist

- [ ] T6-01: Add admin route handling for `/admin`.
- [ ] T6-02: Implement admin Slug Group list view.
- [ ] T6-03: Implement post_slug search and status filter UI.
- [ ] T6-04: Implement summary stats cards.
- [ ] T6-05: Implement Slug Group create modal.
- [ ] T6-06: Implement Slug Group edit modal with slug-change warning and duplicate check.
- [ ] T6-07: Implement Slug Group delete confirmation.
- [ ] T6-08: Implement quiz table for each Slug Group.
- [ ] T6-09: Implement quiz create form/page with read-only post_slug context and four choices.
- [ ] T6-10: Implement quiz edit form/page with existing value loading and save.
- [ ] T6-11: Implement input-based quiz preview.
- [ ] T6-12: Implement iframe preview link/open action.
- [ ] T6-13: Implement iframe code copy with clipboard fallback.

## Admin API Checklist

- [ ] `GET /api/admin/quiz-sets` is consumed with query/status filters.
- [ ] `POST /api/admin/quiz-sets` is consumed for create.
- [ ] `PATCH /api/admin/quiz-sets/:id` is consumed for edit/status changes.
- [ ] `DELETE /api/admin/quiz-sets/:id` is consumed for delete.
- [ ] `GET /api/admin/quiz-sets/check-slug` is consumed for duplicate checks.
- [ ] `GET /api/admin/quiz-sets/:setId/quizzes` is consumed for quiz list.
- [ ] `POST /api/admin/quiz-sets/:setId/quizzes` is consumed for quiz create.
- [ ] `GET /api/admin/quizzes/:id` is consumed for quiz edit loading.
- [ ] `PATCH /api/admin/quizzes/:id` is consumed for quiz update.
- [ ] `DELETE /api/admin/quizzes/:id` is consumed for quiz delete.

## Frontend Checklist

- [ ] Admin UI is quiet, work-focused, and suitable for repeated CRUD tasks.
- [ ] Dense information is scannable without nested cards inside cards.
- [ ] Form validation messages are visible before invalid API requests where practical.
- [ ] Publish attempt for incomplete Slug Group surfaces the API error clearly.
- [ ] Slug Group cards show completion state, status, and basic actions.
- [ ] Quiz form does not accept or submit `postSlug`.
- [ ] Iframe copy action provides a fallback when clipboard API is unavailable.
- [ ] Admin screens are usable on desktop and narrow widths.

## Verification Checklist

- [ ] Run `npm.cmd run build` in `client/`.
- [ ] Run server migration.
- [ ] Start API server.
- [ ] Start Vite dev server.
- [ ] Create a Slug Group from admin UI.
- [ ] Create 3 quizzes from admin UI.
- [ ] Publish the Slug Group from admin UI.
- [ ] Verify iframe preview/open action reaches `/embed/:postSlug`.
- [ ] Verify iframe code copy/fallback.
- [ ] Verify edit and delete flows.
- [ ] Run `git diff --check`.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.
- [ ] Add human checkpoint report if Phase 6 reaches verified milestone.
- [ ] Commit Phase 6 changes.

## Handoff Notes

- Phase 6 should reuse the existing API contracts without adding authentication code.
- Admin protection is a deployment concern handled later by Cloudflare Access.
- Keep this phase focused on local MVP CRUD usability before Markdown/LaTeX and deployment work.
