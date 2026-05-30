# Design Follow-up Dark Mode and Result Density TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d4-action-state-neutrality.md`
- `docs/todos/design-d5-blog-skin-qa-matrix.md`
- `docs/todos/design-followup-embed-action-spacing.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Design Goal

Check and tune the public iframe dark mode colors and reduce unnecessary height in the final result state without changing quiz behavior.

## Scope

- Review dark mode panel, title band, question, choice, feedback, action, and result colors.
- Keep dark mode neutral enough for dark blog skins while preserving answer-state clarity.
- Reduce final result screen vertical footprint because it has fewer elements than the quiz-solving state.
- Preserve transparent public iframe body backgrounds.
- Preserve current routes, API behavior, scoring, retry behavior, and theme modes.

## Out of Scope

- New product features.
- Backend/API changes.
- Admin redesign.
- Text copy changes.
- Generated iframe height changes.
- Changing answer selection or result calculation behavior.

## Implementation Checklist

- [x] Inspect current dark mode and result layout values.
- [x] Tune dark mode colors only where contrast or visual weight feels off.
- [x] Reduce result summary padding/gaps/min-height in the public iframe.
- [x] Keep retry action reachable and centered.
- [x] Preserve light mode and system mode behavior.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify dark iframe answer click, correct, incorrect, and final result states.
- [x] Verify system dark route behavior.
- [x] Verify result screen is shorter than the quiz-solving state where appropriate.
- [x] Verify no mobile horizontal overflow.
- [x] Verify public iframe body remains transparent.
- [x] Clean up temporary QA data.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Edge dark/result QA used temporary `design-dark-result-*` data and deleted it after verification.
- Dark route mobile `390px` verified disabled answer state, incorrect answer state, correct answer state, final result state, and centered retry action.
- System dark route mobile `390px` verified the same interaction flow under `prefers-color-scheme: dark`.
- Dark result panel height measured `219px`, down from `456px` in the initial quiz-solving state.
- System dark result panel height measured `219px`, down from `456px` in the initial quiz-solving state.
- Dark and system dark routes had no horizontal overflow.
- Public iframe body background remained transparent.
- Dark correct state used `rgba(42, 76, 54, 0.32)` and incorrect state used `rgba(82, 40, 48, 0.32)`, keeping semantic states visible but quieter.

## Rollback Notes

- Keep the implementation in a final CSS layer so it can be reverted independently from D1-D5 and earlier follow-up CSS.
- If dark mode contrast becomes worse, rollback this CSS layer and keep the previous D4/D5 state colors.

## Handoff Notes

- This is a presentation-only follow-up for the public iframe widget.
- The expected result is a calmer dark mode and a less tall final result state.
