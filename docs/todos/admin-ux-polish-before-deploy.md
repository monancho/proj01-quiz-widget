# Admin UX Polish Before Deploy TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/todos/admin-ux-before-deploy.md`
- User feedback on 2026-05-29

## Branch

- Current branch: `feature/rendering-security`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Polish pre-deployment admin UX around status display, drag ordering, embed copy behavior, and iframe background behavior.

## Implementation Checklist

- [x] Reduce status summary cards to 4 items: total, preparing, public, private.
- [x] Rename visible draft/working status to `준비중`.
- [x] Treat incomplete Slug Groups as automatically preparing instead of asking the user to choose that state.
- [x] Keep public/private unavailable until exactly 3 quizzes exist.
- [x] Fix quiz drag reordering so dragging by the handle works reliably.
- [x] Change the embed utility icon to better represent preview + iframe code.
- [x] Copy iframe code when the code field is clicked/focused, without requiring the copy button.
- [x] Remove routine success banners for successful create/update/delete/reorder/copy flows.
- [x] Keep admin previews visually framed, but make the actual iframe embed background transparent.

## Verification Checklist

- [x] Run client build.
- [x] Run backend smoke tests if backend status behavior changes.
- [x] Verify status cards and filters show the intended 4 categories.
- [x] Verify incomplete groups show automatic preparing state.
- [x] Verify drag reorder persists through API.
- [x] Verify iframe code click copies code.
- [x] Verify public embed background is transparent while admin preview remains visually framed.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Backend smoke tests were not rerun because backend behavior and schema were not changed.
- Headless Chrome QA verified status cards and filter options are `전체`, `준비중`, `공개`, `비공개`.
- Headless Chrome QA verified incomplete groups show `준비중` as a readonly automatic state.
- Headless Chrome QA verified handle-based drag reorder changes the quiz order.
- Headless Chrome QA verified clicking/focusing the iframe code textarea copies the code without a success banner.
- Headless Chrome QA verified iframe code includes transparent background attributes/styles.
- Headless Chrome QA verified public embed html/body/shell backgrounds are transparent.

## Handoff Notes

- The database can keep `draft` as the internal status value; this TODO is primarily about admin UX wording and behavior.
- Public embed visibility must remain limited to `published` groups with exactly 3 quizzes.
