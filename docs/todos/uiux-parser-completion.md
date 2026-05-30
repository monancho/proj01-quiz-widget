# UI/UX Parser Completion TODO

## Source Docs

- `docs/todos/uiux-component-review.md`
- `docs/human/reports/2026-05-30-uiux-component-review.html`
- `docs/08-ai-smell-review-plan.md`
- `client/src/pages/AdminQuizManagerPage.jsx`
- `client/src/styles.css`

## Goal

Complete the remaining UI/UX follow-up parsers from the component review without adding product features.

## Scope

- Modal density pass for the quiz modal and iframe utility modal.
- Admin mobile density pass for the current dashboard, Slug Group, and Quiz table views.
- CSS structure pass that keeps the final overrides in a separate, named CSS file.
- Verification pass across admin and public iframe states.

## Out of Scope

- Backend API changes.
- Database changes.
- New admin features.
- New public widget features.
- Broad rewrite of the existing `styles.css`.

## Implementation Checklist

- [x] Add a dedicated CSS file for final UI/UX parser completion overrides.
- [x] Import the dedicated CSS file after the existing base styles.
- [x] Reduce quiz modal visual height and keep preview available.
- [x] Reduce iframe utility modal visual height and preview footprint.
- [x] Improve mobile admin density without hiding primary actions.
- [x] Keep public iframe behavior and transparent background unchanged.
- [x] Update project status and worklog.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify admin desktop has no horizontal overflow.
- [x] Verify admin mobile has no horizontal overflow.
- [x] Verify quiz modal is smaller and still usable.
- [x] Verify iframe utility modal is smaller and still usable.
- [x] Verify public iframe initial, answer, feedback, next, result, light, and dark states still work.
- [x] Commit and push after verification.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Admin desktop `1366px`: no horizontal overflow.
- Admin mobile `390px`: no horizontal overflow.
- Quiz modal desktop height reduced to about `667px`; preview remains visible.
- iframe utility modal desktop height measured about `756px`; theme buttons, code textarea, and preview remain available.
- Public iframe light mobile checked across initial, incorrect, correct, next, and final result states.
- Public iframe dark mobile checked with transparent body background and no horizontal overflow.

## Rollback Notes

The main code rollback point is the new imported CSS file and its import in `client/src/main.jsx`.

## Handoff Notes

If deeper CSS cleanup is needed later, split the legacy stylesheet by domain after this PR is merged.
