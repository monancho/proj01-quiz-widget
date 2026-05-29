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

- [x] T6-01: Add admin route handling for `/admin`.
- [x] T6-02: Implement admin Slug Group list view.
- [x] T6-03: Implement post_slug search and status filter UI.
- [x] T6-04: Implement summary stats cards.
- [x] T6-05: Implement Slug Group create modal.
- [x] T6-06: Implement Slug Group edit modal with slug-change warning and duplicate check.
- [x] T6-07: Implement Slug Group delete confirmation.
- [x] T6-08: Implement quiz table for each Slug Group.
- [x] T6-09: Implement quiz create form/page with read-only post_slug context and four choices.
- [x] T6-10: Implement quiz edit form/page with existing value loading and save.
- [x] T6-11: Implement input-based quiz preview.
- [x] T6-12: Implement iframe preview link/open action.
- [x] T6-13: Implement iframe code copy with clipboard fallback.

## Admin API Checklist

- [x] `GET /api/admin/quiz-sets` is consumed with query/status filters.
- [x] `POST /api/admin/quiz-sets` is consumed for create.
- [x] `PATCH /api/admin/quiz-sets/:id` is consumed for edit/status changes.
- [x] `DELETE /api/admin/quiz-sets/:id` is consumed for delete.
- [x] `GET /api/admin/quiz-sets/check-slug` is consumed for duplicate checks.
- [x] `GET /api/admin/quiz-sets/:setId/quizzes` is consumed for quiz list.
- [x] `POST /api/admin/quiz-sets/:setId/quizzes` is consumed for quiz create.
- [x] `GET /api/admin/quizzes/:id` is consumed for quiz edit loading.
- [x] `PATCH /api/admin/quizzes/:id` is consumed for quiz update.
- [x] `DELETE /api/admin/quizzes/:id` is consumed for quiz delete.

## Frontend Checklist

- [x] Admin UI is quiet, work-focused, and suitable for repeated CRUD tasks.
- [x] Dense information is scannable without nested cards inside cards.
- [x] Form validation messages are visible before invalid API requests where practical.
- [x] Publish attempt for incomplete Slug Group surfaces the API error clearly.
- [x] Slug Group cards show completion state, status, and basic actions.
- [x] Quiz form does not accept or submit `postSlug`.
- [x] Iframe copy action provides a fallback when clipboard API is unavailable.
- [x] Admin screens are usable on desktop and narrow widths.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Run server migration.
- [x] Start API server.
- [x] Start Vite dev server.
- [x] Create a Slug Group from admin UI.
- [x] Create 3 quizzes from admin UI.
- [x] Publish the Slug Group from admin UI.
- [x] Verify iframe preview/open action reaches `/embed/:postSlug`.
- [x] Verify iframe code copy/fallback.
- [x] Verify edit and delete flows.
- [x] Run `git diff --check`.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [x] Add human checkpoint report if Phase 6 reaches verified milestone.
- [x] Commit Phase 6 changes.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- `npm.cmd run db:migrate` in `server/`: completed with 0 pending migrations.
- Verification API server: `/health` returned `200`.
- Verification Vite route: `/admin` returned `200`.
- Headless Chrome CDP admin QA created Slug Group `phase-6-admin-759869`.
- Headless Chrome CDP admin QA created 3 quizzes, published the group, verified iframe preview URL and copy fallback.
- Headless Chrome CDP edit/delete QA updated quiz 1, deleted and recreated quiz 3, and verified final `3/3` state.
- Headless Chrome CDP Slug Group delete QA created and deleted a throwaway group.
- Desktop and mobile QA reported no horizontal overflow.

## Handoff Notes

- Phase 6 should reuse the existing API contracts without adding authentication code.
- Admin protection is a deployment concern handled later by Cloudflare Access.
- Keep this phase focused on local MVP CRUD usability before Markdown/LaTeX and deployment work.
