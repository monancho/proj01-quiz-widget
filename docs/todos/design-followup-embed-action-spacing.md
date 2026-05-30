# Design Follow-up Embed Action Spacing TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d3-typography-rhythm.md`
- `docs/todos/design-d4-action-state-neutrality.md`
- `docs/todos/design-d5-blog-skin-qa-matrix.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Design Goal

Make the public iframe quiz flow feel more natural around answer selection, feedback, and the next/result action button.

## Scope

- Inspect spacing before answer selection, after incorrect answer selection, after correct answer selection, and before final result.
- Tune public iframe action area spacing and button position if needed.
- Preserve current quiz behavior, scoring, theme modes, iframe height, and transparent public iframe background.
- Keep choice and action touch targets usable.

## Out of Scope

- New product features.
- API/backend changes.
- Admin redesign.
- Changing quiz flow, scoring, or generated iframe height.
- Changing copy text or adding instructional UI.

## Implementation Checklist

- [x] Inspect current spacing between choices, feedback, and action button.
- [x] Identify whether the unnatural gap comes from quiz-card height, feedback placement, or action area margin.
- [x] Tune only the public iframe layout CSS needed for action rhythm.
- [x] Keep button reachable and visually connected to the current answer state.
- [x] Preserve D1-D5 blog compatibility constraints.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify pre-answer disabled next button position.
- [x] Verify incorrect answer feedback to next button spacing.
- [x] Verify correct answer feedback to next button spacing.
- [x] Verify final question to result button spacing.
- [x] Verify result screen still renders correctly.
- [x] Verify light, dark, and system iframe routes.
- [x] Verify no horizontal overflow at mobile width.
- [x] Verify public iframe body remains transparent.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Edge spacing QA used temporary `design-spacing-*` and `design-spacing-system-*` data and deleted it after verification.
- Before the fix, mobile light route had about `97px` between the choice grid and disabled next button.
- After the fix, pre-answer choice-to-action gap is `0px`.
- After incorrect answer selection, feedback-to-action gap is `0px`.
- After correct answer selection, feedback-to-action gap is `0px`.
- Final question feedback-to-result-button gap is `0px`.
- Next/result action button is centered in the iframe panel at mobile width.
- Light, dark, and system iframe routes had no horizontal overflow.
- Public iframe body background remained transparent.
- Result screen still rendered correctly.
- Cleanup checks found `0` leftover spacing QA Slug Groups.

## Rollback Notes

- Keep this as a small CSS-focused follow-up.
- If spacing worsens, rollback the follow-up CSS layer without touching D1-D5 design work.

## Handoff Notes

- The expected result is a more coherent vertical rhythm during quiz solving, especially after an answer is clicked and before the next button is used.
