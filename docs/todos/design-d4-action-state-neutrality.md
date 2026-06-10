# Design D4 Action and State Neutrality TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d1-embed-footprint.md`
- `docs/todos/design-d2-skin-adaptive-surface.md`
- `docs/todos/design-d3-typography-rhythm.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Design Goal

Keep iframe actions and answer states clear and accessible without making buttons, hover states, or correct/incorrect feedback visually dominate surrounding blog content.

## Scope

- Tune public iframe action button visual weight.
- Tune choice hover, focus-visible, selected, muted, correct, and incorrect states.
- Tune feedback state surfaces for semantic clarity with softer visual weight.
- Tune result retry action so it remains clear but compact.
- Preserve D1 footprint, D2 surfaces, D3 typography, theme modes, and transparent public iframe backgrounds.

## Out of Scope

- Admin design changes.
- API/backend changes.
- New states, interactions, animations, or product features.
- Changing scoring, answer flow, generated iframe height, or iframe theme options.
- Removing visible keyboard focus affordances.

## Implementation Checklist

- [x] Review D1, D2, and D3 findings before editing CSS.
- [x] Reduce primary action visual dominance while keeping it visibly clickable.
- [x] Tune disabled action state so it is quiet but readable.
- [x] Tune choice hover and selected states to avoid strong brand-color emphasis.
- [x] Tune focus-visible rings for keyboard accessibility.
- [x] Tune correct/incorrect states to be semantic but less harsh.
- [x] Tune feedback success/error surfaces and borders.
- [x] Preserve transparent public iframe body background.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify keyboard focus visibility on choices and primary action.
- [x] Verify disabled primary action state.
- [x] Verify correct and incorrect choice states in light theme.
- [x] Verify correct and incorrect choice states in dark theme.
- [x] Verify feedback box state styling.
- [x] Verify result and retry action.
- [x] Verify light, dark, and system iframe routes.
- [x] Verify no horizontal overflow at mobile width.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Edge D4 QA used temporary `design-d4-*` data and deleted it after verification.
- Mobile width `390px` checks passed for light, dark, and system iframe routes.
- Public iframe body background remained transparent.
- Keyboard focus remained visible on choice rows and the result retry action.
- Disabled primary action rendered as a quiet neutral surface.
- Light and dark correct/incorrect states remained recognizable with softer surfaces.
- Feedback correct/incorrect boxes used quieter semantic borders and backgrounds.
- Result summary and retry action rendered without horizontal overflow.
- A transition-aware follow-up check verified light-theme correct state `rgba(240, 248, 243, 0.74)` and incorrect state `rgba(255, 244, 246, 0.76)` after state transition completed.
- Cleanup checks found `0` leftover `design-d4-*` Slug Groups.

## Rollback Notes

- Keep D4 as a CSS-focused commit.
- If action clarity or accessibility worsens, rollback the D4 CSS layer without touching D1, D2, or D3.

## Handoff Notes

- D4 should make the widget calmer, not less understandable.
- Semantic correct/incorrect states must remain recognizable after answer selection.
