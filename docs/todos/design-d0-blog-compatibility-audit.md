# Design D0 Blog Compatibility Audit TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `docs/06-blog-embed-design-strategy.md`
- Current frontend files under `client/src/`
- User feedback: the widget must fit many blog layouts and atmospheres

## Design Goal

Evaluate the current iframe widget design against representative blog contexts before making more CSS changes.

## Scope

- Review current iframe visual footprint.
- Review panel, border, shadow, title band, question block, choice rows, action area, feedback, result, and banner.
- Define blog-context acceptance criteria.
- Identify D1 implementation candidates.

## Out of Scope

- Application code changes.
- API/backend changes.
- New features.
- New theme options.
- Admin workflow changes.

## Blog Context Matrix

- [x] Minimal white article layout.
- [x] Off-white editorial article layout.
- [x] Dense text-heavy article layout.
- [x] Image-heavy magazine article layout.
- [x] Dark article layout.
- [x] Narrow mobile article layout.

## Audit Checklist

- [x] Check whether widget height interrupts reading flow.
- [x] Check whether panel shadow/border feels too external.
- [x] Check whether title band feels too formal or too heavy.
- [x] Check whether question block competes with article headings.
- [x] Check whether primary button feels too strong.
- [x] Check whether semantic state colors are clear but not harsh.
- [x] Check whether optional banner blends with the article.
- [x] Check whether light/dark/system modes are enough for current needs.

## Verification Checklist

- [x] Run or reuse current build verification if no code changes are made.
- [x] If browser QA is needed, check iframe at desktop and mobile widths.
- [x] Confirm public iframe body background remains transparent.
- [x] Record D1 recommendations in the worklog.

## Audit Results

- No horizontal overflow was found in the simulated blog contexts.
- Public iframe body background stayed transparent in direct light, dark, and system checks.
- The current iframe copy height of `720px` is the largest blog-compatibility issue.
- Desktop article contexts produced iframe-height-to-article-width ratios from `0.86` to `1.06`.
- Narrow mobile produced an iframe-height-to-article-width ratio of `1.99`, which is too dominant for a blog post body.
- Current internal mobile values: shell padding `8px`, panel min-height `520px`, title band `42px`, choice row min-height `52px`.
- The panel border and shadow are acceptable in neutral blogs but still make the widget feel like an inserted external card in editorial and dense text layouts.
- The title band is usable but should be slightly quieter during D1.
- The question block is clear but can be less heavy by reducing padding, min-height pressure, and visual surface contrast.
- The primary action is not too strong before answering because it is disabled, but D1 should preserve a neutral action style.

## D1 Recommendations

- Reduce generated iframe code height from `720px` to a smaller safe default.
- Lower public embed shell and panel min-height.
- Reduce panel shadow strength.
- Tighten title band, question block, choice rows, and action area spacing.
- Keep choice rows large enough for touch use.
- Preserve light, dark, and system modes.
- Preserve transparent public iframe body backgrounds.

## Rollback Notes

- D0 should not change application code.
- If accidental code changes happen during D0, review and revert them before proceeding.

## Handoff Notes

- D0 must finish with a clear decision: proceed to D1, revise the sub-phase plan, or pause for user review.
- D1 TODO must be created before any footprint-reduction CSS work starts.
