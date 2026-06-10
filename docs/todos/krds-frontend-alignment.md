# KRDS Frontend Alignment TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/01-requirements.md`
- `docs/03-task-breakdown.md`
- KRDS official design system guidance
- Local KRDS component kit resources from `krds-uiux`

## Branch

- Current branch: `feature/rendering-security`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Align the existing frontend UI with KRDS visual conventions without adding new product features.

## Out of Scope

- New admin features
- New quiz behavior
- Backend API changes unless a frontend verification issue requires it
- Replacing the current React app with a different component framework

## Implementation Checklist

- [x] Add the KRDS component kit dependency to the client.
- [x] Load KRDS design tokens for frontend styling.
- [x] Map the app's local CSS variables to KRDS color, border, input, and button tokens.
- [x] Refresh admin shell, toolbar, stats, Slug Group list, quiz table, modal, and utility modal surfaces using KRDS token values.
- [x] Refresh iframe quiz card, choices, feedback, result, and banner surfaces using KRDS token values while keeping transparent embed backgrounds.
- [x] Restore broken Korean UI labels in the admin screen.
- [x] Preserve existing wireframe, routes, API calls, drag reorder, modals, and iframe theme behavior.

## Verification Checklist

- [x] Run `npm.cmd install` in `client/` if dependencies change.
- [x] Run `npm.cmd run build` in `client/`.
- [x] Run backend smoke tests if API-facing behavior is touched.
- [x] Verify the admin screen has no horizontal overflow on mobile and desktop.
- [x] Verify the iframe route still supports `theme=light|dark|system`.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd install krds-uiux@^1.0.5` in `client/`: completed with 0 vulnerabilities.
- `npm.cmd run build` in `client/`: passed.
- Backend smoke tests were not rerun because no backend/API behavior changed.
- Headless Chrome CDP QA verified admin desktop `1366px` and mobile `390px` render without horizontal overflow.
- Headless Chrome CDP QA verified embed `theme=light` and `theme=dark` render without horizontal overflow.
- Headless Chrome CDP QA verified KRDS token CSS is loaded and the app primary color resolves to `#256ef4`.
- Static search found no remaining known mojibake markers in `client/src`.

## Handoff Notes

- KRDS alignment should be treated as a presentation-layer refinement.
- Do not add unsupported dashboard functions while applying the KRDS visual system.
