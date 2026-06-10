# UI/UX Component Review TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/06-blog-embed-design-strategy.md`
- Current frontend implementation under `client/src/`

## Goal

Review the current UI/UX component by component without adding new product features. The review should separate admin, modal, public iframe, state, responsive, and accessibility concerns so future fixes can be planned safely.

## Scope

- Admin shell and navigation.
- Admin toolbar, filters, status strip, and stats.
- Slug Group list and selected detail flow.
- Quiz table, row actions, and drag reorder affordance.
- Slug Group modal.
- Quiz create/edit modal, Markdown authoring, and widget preview.
- iframe utility modal, theme selection, code copy, and preview.
- Public iframe shell.
- Public quiz card, choice buttons, feedback, and result summary.
- Static banner, rich text rendering, loading/empty/error states.
- Desktop/mobile responsiveness and dark/light/system theme behavior.

## Out of Scope

- New product features.
- Backend API behavior changes.
- Database schema changes.
- Major visual redesign before the review is complete.

## Review Checklist

- [x] Inspect current component boundaries and CSS selectors.
- [x] Check admin desktop layout.
- [x] Check admin mobile layout.
- [x] Check Slug Group list and selected detail interaction.
- [x] Check quiz table and drag reorder affordance.
- [x] Check Slug Group modal.
- [x] Check quiz modal and Markdown authoring UX.
- [x] Check iframe utility modal.
- [x] Check public iframe initial quiz state.
- [x] Check public iframe answer selected, correct, incorrect, next, and final result states.
- [x] Check public iframe light, dark, and system theme behavior.
- [x] Check loading, empty, error, and banner states.
- [x] Record component-by-component findings with severity and recommended next actions.
- [x] Create or update a human-facing review report.
- [x] Update project status and worklog.

## Verification Checklist

- [x] Run a client build if review findings require confidence in current frontend integrity.
- [x] Use browser or headless browser checks for representative admin and iframe routes when local servers are available.
- [x] Confirm no application code was changed unless explicitly planned in a follow-up TODO.
- [x] Confirm git status before handoff.

## Review Result

- Human report: `docs/human/reports/2026-05-30-uiux-component-review.html`.
- Admin desktop and mobile had no horizontal overflow.
- Public iframe light and dark mobile states had no horizontal overflow and kept transparent body backgrounds.
- Public iframe answer flow was checked across initial, incorrect, correct, next, and final result states.
- Main follow-up risks: quiz modal density, iframe utility modal density, admin mobile information density, and over-layered CSS structure.

## Rollback Notes

This is expected to be a documentation and review pass only. Rollback should only require reverting the review TODO/report/status/worklog commit.

## Handoff Notes

Follow-up implementation work should be split by component or concern, with a separate TODO before editing application code.
