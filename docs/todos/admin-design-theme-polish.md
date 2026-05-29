# Admin Design And Embed Theme Polish TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-29.md`
- User-provided compact functional UI reference image on 2026-05-29

## Branch

- Current branch: `feature/rendering-security`
- Safety checkpoint tag: `checkpoint-before-design-theme-20260529`
- PR: `https://github.com/monancho/proj01-quiz-widget/pull/6`

## Scope

Apply a compact functional UI direction inspired by the reference image, and add embed theme selection to the iframe copy modal.

## Implementation Checklist

- [x] Add a dark admin sidebar and compact main workspace layout.
- [x] Tighten admin cards, tables, toolbar, and action controls toward a functional dashboard feel.
- [x] Make the public quiz widget look more like a compact blog-content embed.
- [x] Add `light`, `dark`, and `system` theme options in the iframe utility modal.
- [x] Apply the selected theme to the live iframe preview URL.
- [x] Apply the selected theme to the copied iframe code.
- [x] Support `theme=light|dark|system` on the public embed route.
- [x] Keep actual iframe background transparent.

## Verification Checklist

- [x] Run client build.
- [x] Verify admin layout remains usable on desktop and mobile widths.
- [x] Verify iframe utility modal theme selection updates preview URL and iframe code.
- [x] Verify copied code includes the selected theme.
- [x] Verify public embed renders light, dark, and system modes without overflow.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Chrome admin QA verified dark sidebar presence, compact white topbar, four stat cards, and no desktop overflow.
- Headless Chrome utility modal QA verified `시스템`, `화이트`, `다크` controls.
- Headless Chrome utility modal QA verified theme selection updates preview URLs and generated iframe code.
- Headless Chrome clipboard QA verified copied iframe code includes the selected `theme=dark` value.
- Headless Chrome mobile embed QA verified `theme=light`, `theme=dark`, and `theme=system` render without horizontal overflow.
- Headless Chrome embed QA verified `.embed-shell` remains transparent while panel colors change by theme.

## Handoff Notes

- The checkpoint tag `checkpoint-before-design-theme-20260529` can be used to compare or restore the state before this design/theme work.
- This is a visual and embed-code polish pass; backend behavior should not change.
