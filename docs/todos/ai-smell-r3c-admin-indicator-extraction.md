# AI Smell R3c Admin Indicator Extraction TODO

## Goal

Continue reducing oversized admin page smell by extracting small presentational admin indicators.

## Source Documents

- `docs/08-ai-smell-review-plan.md`
- `docs/todos/ai-smell-r1-analysis.md`
- `docs/todos/ai-smell-r2-remediation-plan.md`
- `docs/todos/ai-smell-r3b-admin-embed-helper-extraction.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Scope

- Extract `LoadingRows`.
- Extract `StatusBadge`.
- Extract `CompletionBadge`.
- Keep CSS classes and rendered markup unchanged.
- Keep admin page behavior unchanged.

## Out of Scope

- Full admin page decomposition.
- CSS splitting.
- Backend/API changes.
- Changing Korean labels or admin workflow.
- Changing status logic.

## Implementation Checklist

- [x] Create a small admin indicator component module.
- [x] Move `LoadingRows`, `StatusBadge`, and `CompletionBadge`.
- [x] Import the indicators in `AdminQuizManagerPage.jsx`.
- [x] Remove the inline indicator components from the page.
- [x] Preserve the existing CSS class names.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify no app behavior changes beyond component extraction.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [x] Commit and push after verification.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Extracted indicators preserve the existing `loading-block`, `status-badge`, and `completion-badge` class names.
- No backend/API behavior was changed.

## Rollback Notes

- If the extraction causes rendering issues, move these small components back into `AdminQuizManagerPage.jsx`.
- This should remain a behavior-preserving refactor only.
