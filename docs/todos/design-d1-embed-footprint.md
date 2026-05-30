# Design D1 Embed Footprint TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d0-blog-compatibility-audit.md`
- D0 audit results, once completed

## Design Goal

Reduce the public iframe widget's visual and vertical footprint so it blends into blog articles more naturally.

## Scope

- Tune public iframe layout only.
- Reduce unnecessary vertical height and visual weight.
- Preserve current quiz behavior, theme modes, Markdown/KaTeX rendering, and transparent iframe body.

## Out of Scope

- Admin redesign.
- API/backend changes.
- New product features.
- New theme option UI.
- Changing quiz flow or grading behavior.

## Implementation Checklist

- [x] Review D0 audit findings before editing CSS.
- [x] Tune `.embed-shell` padding and spacing.
- [x] Tune `.embed-panel` min-height, border, shadow, and surface strength.
- [x] Tune `.quiz-card` min-height and internal spacing.
- [x] Tune title band height and visual weight.
- [x] Tune question block padding and emphasis.
- [x] Tune choice row height while keeping touch targets usable.
- [x] Tune action area spacing.
- [x] Keep public iframe body background transparent.

## D0 Findings To Address

- The copied iframe height is currently `720px`.
- Desktop simulated article ratios ranged from `0.86` to `1.06`.
- Narrow mobile ratio was `1.99`, which is too dominant.
- Current mobile panel min-height is `520px`, title band is `42px`, and choice rows are `52px`.
- D1 should reduce visual footprint without making touch targets uncomfortable.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify iframe light route at desktop and mobile width.
- [x] Verify iframe dark route at desktop and mobile width.
- [x] Verify iframe system route at mobile width.
- [x] Verify no horizontal overflow.
- [x] Verify long question and long choice text still fit.
- [x] Verify Markdown and KaTeX still render.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Copied iframe default height changed from `720px` to `620px`.
- Blog context QA with `620px` iframe height found no horizontal overflow.
- Desktop simulated article ratios improved from `0.86~1.06` to `0.74~0.91`.
- Narrow mobile ratio improved from `1.99` to `1.71`.
- Direct iframe checks verified light, dark, and system themes at `390px` without overflow.
- Public iframe body background remained transparent.
- Mobile internal values after D1: shell padding `6px`, panel min-height `456px`, title band `36px`, choice row min-height `48px`.
- Markdown and KaTeX QA verified `.katex` and `strong` output still render without horizontal overflow.
- Temporary `design-d1-*` QA data was deleted after verification.

## Rollback Notes

- Keep the implementation as one coherent CSS-focused commit.
- Avoid touching React behavior so rollback remains visually scoped.

## Handoff Notes

- D1 should make the widget quieter, not smaller at the cost of readability.
- If D1 makes touch targets too small, prefer keeping usability over reducing height.
