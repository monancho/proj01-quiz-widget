# Design D2 Skin-Adaptive Surface TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d0-blog-compatibility-audit.md`
- `docs/todos/design-d1-embed-footprint.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Design Goal

Make the public iframe widget surface feel less like a detached external card and more like an article-native component across white, off-white, gray, and dark blog skins.

## Scope

- Tune public iframe surface styling only.
- Rebalance panel background opacity, border, shadow, title band, question block, choice rows, feedback, result, and banner surfaces.
- Preserve transparent public iframe body background.
- Preserve current quiz behavior, theme modes, Markdown/KaTeX rendering, and D1 footprint.

## Out of Scope

- Admin redesign.
- API/backend changes.
- New theme options.
- New product features.
- Changing quiz flow, grading, or copy behavior.
- Changing generated iframe dimensions again unless verification shows a D2-specific issue.

## Implementation Checklist

- [x] Review D0 and D1 findings before editing CSS.
- [x] Reduce panel shadow so the widget reads as embedded content, not a floating card.
- [x] Tune light panel surface opacity for white, off-white, and gray blog backgrounds.
- [x] Tune dark panel surface opacity and contrast for dark blog backgrounds.
- [x] Tune title band and action area surfaces so they do not look like heavy application chrome.
- [x] Tune question block and choice row surfaces while keeping hierarchy readable.
- [x] Tune optional banner surface to blend with article backgrounds.
- [x] Keep public iframe body background transparent.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify white blog background simulation.
- [x] Verify off-white blog background simulation.
- [x] Verify gray blog background simulation.
- [x] Verify dark blog background simulation.
- [x] Verify light, dark, and system iframe routes at mobile width.
- [x] Verify no horizontal overflow.
- [x] Verify public iframe body background remains transparent.
- [x] Verify semantic correct/incorrect state colors remain visible.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- White, off-white, gray, dark, and mobile white blog background simulations had no horizontal overflow.
- Public iframe body background remained transparent.
- D1 copied iframe height stayed `620px`.
- Light mobile iframe surface values after D2:
  - panel background `rgba(255, 255, 255, 0.94)`
  - panel border `rgba(126, 135, 145, 0.24)`
  - panel shadow `0 2px 8px rgba(15, 23, 42, 0.035)`
  - title background `rgba(248, 249, 250, 0.72)`
  - choice background `rgba(255, 255, 255, 0.66)`
- Dark mobile iframe surface values after D2:
  - panel background `rgba(22, 24, 27, 0.92)`
  - panel border `rgba(171, 181, 192, 0.24)`
  - panel shadow `0 2px 10px rgba(0, 0, 0, 0.14)`
- Correct/incorrect states remained visible after a selection:
  - light correct `rgba(239, 249, 243, 0.86)`
  - light incorrect `rgba(255, 243, 245, 0.88)`
  - dark correct `rgba(45, 84, 58, 0.42)`
  - dark incorrect `rgba(93, 45, 53, 0.42)`
- Temporary `design-d2-*` QA data was deleted after verification.

## Rollback Notes

- Keep D2 as a CSS-focused commit.
- If a surface tuning makes readability worse, rollback the D2 CSS layer without touching D1 footprint changes.

## Handoff Notes

- D2 should reduce visual separation from the blog page, not make the widget invisible.
- If stronger adaptation is needed later, consider D5 QA evidence before adding any new theme API.
