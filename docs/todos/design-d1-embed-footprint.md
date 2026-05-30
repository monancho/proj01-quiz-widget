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

- [ ] Review D0 audit findings before editing CSS.
- [ ] Tune `.embed-shell` padding and spacing.
- [ ] Tune `.embed-panel` min-height, border, shadow, and surface strength.
- [ ] Tune `.quiz-card` min-height and internal spacing.
- [ ] Tune title band height and visual weight.
- [ ] Tune question block padding and emphasis.
- [ ] Tune choice row height while keeping touch targets usable.
- [ ] Tune action area spacing.
- [ ] Keep public iframe body background transparent.

## Verification Checklist

- [ ] Run `npm.cmd run build` in `client/`.
- [ ] Verify iframe light route at desktop and mobile width.
- [ ] Verify iframe dark route at desktop and mobile width.
- [ ] Verify iframe system route at mobile width.
- [ ] Verify no horizontal overflow.
- [ ] Verify long question and long choice text still fit.
- [ ] Verify Markdown and KaTeX still render.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.

## Rollback Notes

- Keep the implementation as one coherent CSS-focused commit.
- Avoid touching React behavior so rollback remains visually scoped.

## Handoff Notes

- D1 should make the widget quieter, not smaller at the cost of readability.
- If D1 makes touch targets too small, prefer keeping usability over reducing height.
