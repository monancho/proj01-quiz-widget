# KRDS Neutral Density Tuning TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/todos/krds-ui-redesign-pass.md`
- User feedback on 2026-05-30

## Branch

- Current branch: `feature/rendering-security`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Tune the KRDS visual redesign so it feels neutral and widget-friendly across different blog skins.

## Out of Scope

- New features
- Backend changes
- Route or API changes
- New theme settings beyond the existing iframe theme modes

## Implementation Checklist

- [x] Reduce strong blue accent usage and shift the default visual emphasis to neutral KRDS gray/black.
- [x] Tune backgrounds so admin is structured but quiet, and iframe remains transparent outside the widget panel.
- [x] Adjust font sizes for denser admin scanning and comfortable iframe reading.
- [x] Improve section separation with line, header band, and spacing hierarchy instead of strong color blocks.
- [x] Increase information density in admin tables, lists, stats, and controls.
- [x] Keep success/error/warning colors available only for semantic states.
- [x] Fix CSS generated text so Korean labels are not stored as mojibake.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify admin desktop and mobile rendering.
- [x] Verify iframe light and dark rendering.
- [x] Verify no horizontal overflow.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Chrome CDP QA verified admin desktop and mobile rendering without horizontal overflow.
- Headless Chrome CDP QA verified embed light and dark rendering without horizontal overflow.
- Headless Chrome CDP QA verified the app primary variable resolves to neutral `#131416` instead of strong KRDS blue.
- Headless Chrome CDP QA verified admin active navigation and masthead accents use neutral gray/black surfaces.
- Headless Chrome CDP QA verified iframe body remains transparent and the widget panel remains self-contained.
- Temporary KRDS neutral QA data was deleted after verification.

## Handoff Notes

- The widget should not look heavily branded by one dominant color.
- Blue can remain as a subtle focus/link system color but should not dominate the page.
