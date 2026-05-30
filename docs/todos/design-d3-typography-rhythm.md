# Design D3 Typography and Reading Rhythm TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d0-blog-compatibility-audit.md`
- `docs/todos/design-d1-embed-footprint.md`
- `docs/todos/design-d2-skin-adaptive-surface.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Design Goal

Make public iframe question, choice, feedback, and result text feel more natural inside blog prose while preserving quiz clarity and accessibility.

## Scope

- Tune public iframe typography and reading rhythm only.
- Adjust font size, font weight, line height, paragraph rhythm, label scale, and rich text spacing.
- Preserve D1 footprint and D2 skin-adaptive surfaces.
- Preserve Markdown/KaTeX rendering and transparent public iframe body background.

## Out of Scope

- Admin redesign.
- API/backend changes.
- New features or theme options.
- Changing quiz flow, scoring, or generated iframe height.
- Removing semantic state colors.

## Implementation Checklist

- [x] Review D0, D1, and D2 findings before editing CSS.
- [x] Reduce excessive question heading weight so it does not compete with blog headings.
- [x] Tune question and choice line-height for Korean long text.
- [x] Tune rich text paragraph/list/code spacing inside questions, choices, and explanations.
- [x] Tune feedback and explanation text hierarchy.
- [x] Tune result summary typography so it feels like a compact article component.
- [x] Keep choice touch targets and readable contrast.
- [x] Keep public iframe body background transparent.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify long Korean question at mobile width.
- [x] Verify long Korean choice at mobile width.
- [x] Verify Markdown list, inline code, and KaTeX at mobile width.
- [x] Verify feedback explanation spacing after answer selection.
- [x] Verify result summary text rhythm.
- [x] Verify light, dark, and system iframe routes.
- [x] Verify no horizontal overflow.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Edge D3 QA used temporary `design-d3-*` data and deleted it after verification.
- Mobile width `390px` checks passed for long Korean questions, long Korean choices, Markdown lists, inline code, and KaTeX.
- Light, dark, and system iframe routes had no horizontal overflow.
- Public iframe body background remained transparent.
- Choice touch target height remained at least `48px`.
- Observed mobile typography values included question `15.68px / 24.304px`, choice text `14.56px / 21.5488px`, feedback explanation `13.92px / 21.9936px`, and result title `17.92px / 26.5216px`.
- Cleanup check found `0` leftover `design-d3-*` Slug Groups.

## Rollback Notes

- Keep D3 as a CSS-focused commit.
- If readability worsens, rollback the D3 CSS layer without touching D1 footprint or D2 surface work.

## Handoff Notes

- D3 should make the widget read more like article content, not like a large application card.
- Do not shrink text below comfortable mobile reading size.
