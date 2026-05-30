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

- [ ] Minimal white article layout.
- [ ] Off-white editorial article layout.
- [ ] Dense text-heavy article layout.
- [ ] Image-heavy magazine article layout.
- [ ] Dark article layout.
- [ ] Narrow mobile article layout.

## Audit Checklist

- [ ] Check whether widget height interrupts reading flow.
- [ ] Check whether panel shadow/border feels too external.
- [ ] Check whether title band feels too formal or too heavy.
- [ ] Check whether question block competes with article headings.
- [ ] Check whether primary button feels too strong.
- [ ] Check whether semantic state colors are clear but not harsh.
- [ ] Check whether optional banner blends with the article.
- [ ] Check whether light/dark/system modes are enough for current needs.

## Verification Checklist

- [ ] Run or reuse current build verification if no code changes are made.
- [ ] If browser QA is needed, check iframe at desktop and mobile widths.
- [ ] Confirm public iframe body background remains transparent.
- [ ] Record D1 recommendations in the worklog.

## Rollback Notes

- D0 should not change application code.
- If accidental code changes happen during D0, review and revert them before proceeding.

## Handoff Notes

- D0 must finish with a clear decision: proceed to D1, revise the sub-phase plan, or pause for user review.
- D1 TODO must be created before any footprint-reduction CSS work starts.
