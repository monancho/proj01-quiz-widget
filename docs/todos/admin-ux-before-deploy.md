# Admin UX Before Deploy TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/todos/phase-6-admin-mvp.md`
- `docs/todos/phase-7-rendering-security.md`

## Branch

- Current branch: `feature/rendering-security`
- Base branch: stacked on `feature/admin-mvp`

## Scope

Refine admin UX before deployment based on local testing feedback.

## Implementation Checklist

- [x] Show quiz create/edit in a modal instead of an inline lower panel.
- [x] Show iframe preview in a modal.
- [x] Show iframe code in a modal textarea/input with a copy action.
- [x] Combine iframe preview and iframe code copy into one utility modal.
- [x] Show the current quiz form as a finished widget-style preview inside the quiz modal.
- [x] Remove manual sort order selection from quiz create/edit.
- [x] Create new quizzes in creation order.
- [x] Support drag-and-drop quiz reordering.
- [x] Add a `draft` Slug Group status for incomplete groups.
- [x] Prevent incomplete groups from selecting `private` or `published`.
- [x] Keep public embed visibility limited to `published` groups with exactly 3 quizzes.

## Backend Checklist

- [x] Add migration for `draft` status.
- [x] Relax quiz sort order persistence so reordering can update all rows safely.
- [x] Add admin quiz reorder API.
- [x] Keep create/update validations compatible with existing smoke tests.

## Verification Checklist

- [x] Run DB migration.
- [x] Run backend smoke tests.
- [x] Run client build.
- [x] Manually verify admin modal flows.
- [x] Manually verify drag reorder.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run db:migrate` on a temporary QA database applied migrations `0001` and `0002`.
- `npm.cmd run smoke:phase2`: passed.
- `npm.cmd run smoke:phase3`: passed, including reorder API coverage.
- `npm.cmd run smoke:phase4`: passed.
- `npm.cmd run build` in `client/`: passed.
- Headless Chrome QA verified iframe code modal, iframe preview modal, quiz edit modal, no `sort_order` control in quiz modal, and drag reorder.
- Headless Chrome QA verified incomplete Slug Groups show the draft-only warning and disable `private`/`published` options.
- Follow-up `npm.cmd run build` after unified preview changes: passed.
- Follow-up headless Chrome QA verified one combined iframe modal contains both iframe code and live preview, and the quiz modal preview uses the actual widget card with selectable feedback.

## Handoff Notes

- This is a pre-deployment UX refinement, not a new product phase.
- PR #5 is already stacked on PR #4, so this work should remain on `feature/rendering-security` unless the branch stack is reorganized.
