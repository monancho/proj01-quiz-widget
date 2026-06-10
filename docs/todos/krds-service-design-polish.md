# KRDS Service Design Polish TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `docs/todos/krds-neutral-density-tuning.md`
- KRDS official site and developer guidance reviewed on 2026-05-30
- USWDS design token guidance reviewed on 2026-05-30
- User feedback on 2026-05-30

## Branch

- Current branch: `feature/rendering-security`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Improve the frontend visual design to a service-ready KRDS-like quality while preserving the existing MVP behavior and wireframe.

## Out of Scope

- New product features
- API or backend changes
- New admin navigation items
- New data fields or workflow changes
- Replacing existing React component behavior

## Design Direction

- Use neutral KRDS-like base surfaces as the dominant tone.
- Reserve strong colors for semantic states and rare actionable emphasis.
- Improve section hierarchy with borders, bands, spacing, and typography rather than decorative color.
- Make admin screens easier to scan by tightening table/list/control density.
- Keep iframe output visually self-contained but quiet enough to fit different Tistory skins.
- Preserve transparent public iframe backgrounds.

## Implementation Checklist

- [x] Add service-level design tokens and surface aliases.
- [x] Polish admin shell, sidebar, topbar, filters, stats, Slug Group list, quiz table, modals, and utility preview.
- [x] Polish iframe quiz panel, title band, question block, choice rows, feedback, result, and banner.
- [x] Improve focus, hover, disabled, drag, and selected states without adding behavior.
- [x] Keep responsive layouts stable at mobile and desktop widths.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify admin desktop rendering.
- [x] Verify admin mobile rendering.
- [x] Verify iframe light/dark/system rendering.
- [x] Verify no horizontal overflow.
- [x] Verify public iframe body background remains transparent.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Local API and Vite dev server were started for browser QA.
- Headless Edge CDP QA verified admin desktop `1366px` and mobile `390px` rendering without horizontal overflow.
- Headless Edge CDP QA verified iframe light, dark, and system routes at `390px` without horizontal overflow.
- Headless Edge CDP QA verified public iframe body background remains transparent.
- Headless Edge CDP QA verified neutral service styling values: admin background `#f4f5f6`, primary action `#1e2124`, panel radius `6px`, and iframe choice row min-height `52px`.
- Temporary `krds-service-*` QA data was deleted after verification.

## Handoff Notes

- This pass should feel like a production visual polish pass, not a feature expansion.
- If future work needs larger IA or workflow changes, do it separately from this design polish.
