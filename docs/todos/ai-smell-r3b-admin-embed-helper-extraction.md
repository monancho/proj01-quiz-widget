# AI Smell R3b Admin Embed Helper Extraction TODO

## Goal

Continue reducing oversized admin page smell by extracting pure iframe utility helpers and shared admin option constants.

## Source Documents

- `docs/08-ai-smell-review-plan.md`
- `docs/todos/ai-smell-r1-analysis.md`
- `docs/todos/ai-smell-r2-remediation-plan.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Scope

- Extract embed theme options from `AdminQuizManagerPage.jsx`.
- Extract iframe URL and iframe code builders from `AdminQuizManagerPage.jsx`.
- Keep admin modal behavior and iframe output unchanged.
- Add helper-level checks for URL/code generation.

## Out of Scope

- CSS splitting.
- Admin component decomposition.
- Backend/API changes.
- Changing generated iframe height or attributes.
- Changing theme labels or user-facing workflow.

## Implementation Checklist

- [x] Create an admin constants module for status and embed theme options.
- [x] Create an embed tools utility module.
- [x] Import the constants/helpers in `AdminQuizManagerPage.jsx`.
- [x] Remove inline iframe builder functions from the page.
- [x] Preserve generated iframe URL and code behavior.

## Verification Checklist

- [x] Run helper-level embed URL/code checks.
- [x] Run `npm.cmd run build` in `client/`.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [x] Commit and push after verification.

## Verification Results

- Helper-level checks verified encoded post slugs, dark theme URLs, invalid theme fallback to `system`, iframe height `620`, `allowtransparency`, and transparent iframe styling.
- `npm.cmd run build` in `client/`: passed.
- Generated iframe behavior remains unchanged.

## Rollback Notes

- If behavior changes unexpectedly, move the helper functions back into `AdminQuizManagerPage.jsx`.
- This change should be a behavior-preserving extraction only.
