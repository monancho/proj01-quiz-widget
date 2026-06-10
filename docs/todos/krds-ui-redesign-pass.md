# KRDS UI Redesign Pass TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/todos/krds-frontend-alignment.md`
- KRDS component kit resources from `krds-uiux`

## Branch

- Current branch: `feature/rendering-security`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Make the existing frontend visibly closer to KRDS public-service UI patterns, beyond token-only alignment.

## Out of Scope

- New product features
- Backend API changes
- Route changes
- Changing the established admin information architecture

## Implementation Checklist

- [x] Make the admin shell more KRDS-like with a white navigation rail, structured masthead, flat section panels, and official blue primary actions.
- [x] Make filters, stats, Slug Group list, quiz table, and modals visually denser and more form/table oriented.
- [x] Make the iframe quiz widget more KRDS-like with a section title band, question block, progress badge, structured answer choices, and official state colors.
- [x] Preserve transparent iframe backgrounds and existing `theme=light|dark|system` behavior.
- [x] Preserve drag reorder, modals, preview/copy utility, and current API calls.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify admin desktop and mobile rendering.
- [x] Verify iframe light and dark theme rendering.
- [x] Verify no horizontal overflow on mobile.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Chrome CDP QA verified admin desktop `1366px` renders with a `244px` white navigation rail, a flat KRDS-like masthead, and no horizontal overflow.
- Headless Chrome CDP QA verified admin mobile rendering has no horizontal overflow.
- Headless Chrome CDP QA verified embed light and dark routes render with the `퀴즈로 확인하기` section band, `4px` question accent border, square panel radius, transparent body background, and no horizontal overflow.
- Temporary KRDS redesign QA data was deleted after verification.

## Handoff Notes

- This pass is intentionally visual and should not introduce unsupported dashboard functions.
