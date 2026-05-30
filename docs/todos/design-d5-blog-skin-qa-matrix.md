# Design D5 Blog Skin QA Matrix TODO

## Source Documents

- `AGENTS.md`
- `docs/06-blog-embed-design-strategy.md`
- `docs/todos/design-d0-blog-compatibility-audit.md`
- `docs/todos/design-d1-embed-footprint.md`
- `docs/todos/design-d2-skin-adaptive-surface.md`
- `docs/todos/design-d3-typography-rhythm.md`
- `docs/todos/design-d4-action-state-neutrality.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Design Goal

Verify the final D1-D4 public iframe design against representative blog contexts before deployment work, with the priority on blog compatibility rather than brand visibility.

## Scope

- Test the public iframe widget inside simulated blog article layouts.
- Cover minimal white, off-white editorial, dense text, image-heavy magazine, dark article, and narrow mobile contexts.
- Verify light, dark, and system iframe theme routes.
- Verify parent article overflow, iframe footprint ratio, public iframe transparent body, and readable state rendering.
- Verify the embedded iframe interaction flow: answer click, incorrect state, correct state, and final result after all quizzes are answered.
- Record QA findings in project status and worklog.

## Out of Scope

- New design changes unless QA finds a blocking issue.
- Admin UX redesign.
- API/backend changes.
- New product features, iframe options, or workflow changes.
- Human-facing HTML report unless explicitly requested.

## Implementation Checklist

- [x] Confirm D1-D4 implementation and verification notes.
- [x] Prepare temporary published QA Slug Group with 3 quizzes.
- [x] Build client before final QA.
- [x] Run blog skin matrix against six representative contexts.
- [x] Run direct iframe route checks for light, dark, and system themes.
- [x] Run embedded parent-page iframe interaction checks.
- [x] Delete temporary QA data.
- [x] Record results without changing application behavior unless a blocker is found.

## Verification Checklist

- [x] `npm.cmd run build` in `client/` passes.
- [x] Minimal white article context has no horizontal overflow.
- [x] Off-white editorial context has no horizontal overflow.
- [x] Dense text blog context has no horizontal overflow.
- [x] Image-heavy magazine context has no horizontal overflow.
- [x] Dark article skin context has no horizontal overflow.
- [x] Narrow mobile article context has no horizontal overflow.
- [x] Public iframe body remains transparent.
- [x] Light, dark, and system iframe routes have no internal horizontal overflow.
- [x] Embedded iframe answer click shows incorrect state when an incorrect answer is selected.
- [x] Embedded iframe answer click shows correct state when the correct answer is selected.
- [x] Embedded iframe final result appears after all 3 quizzes are answered.
- [x] iframe footprint ratios remain within expected D1 post-reduction range.
- [x] Temporary QA data is deleted.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Edge D5 QA used temporary `design-d5-*` data and deleted it after verification.
- Parent blog context checks passed with no horizontal overflow:
  - Minimal white article: ratio `0.82`.
  - Off-white editorial article: ratio `0.91`.
  - Dense text blog: ratio `0.97`.
  - Image-heavy magazine article: ratio `0.82`.
  - Dark article skin: ratio `0.91`.
  - Narrow mobile article: ratio `1.71`.
- Direct iframe checks passed for light, dark, and system routes at mobile width `390px`.
- Public iframe body background remained transparent.
- Direct iframe routes had no internal horizontal overflow.
- Markdown, bold text, and KaTeX rendered in the direct iframe check.
- Light and dark correct/incorrect states and result views rendered during direct route interaction checks.
- Embedded parent-page iframe interaction checks passed for:
  - Light desktop parent context.
  - Dark desktop parent context.
  - System mobile parent context.
- Embedded iframe interaction checks verified answer click, incorrect state, correct state, all-quiz final result, no parent horizontal overflow, no iframe internal horizontal overflow, and transparent iframe body background.
- Cleanup check found `0` leftover `design-d5-*` Slug Groups.
- Cleanup check found `0` leftover `design-d5-embedded-*` Slug Groups.

## Rollback Notes

- D5 should be documentation and QA-focused.
- If a blocker is found, make a small follow-up CSS fix and verify it separately before committing.

## Handoff Notes

- D5 is the final blog-compatibility design gate before returning to PR review/merge or deployment planning.
- If D5 passes without application changes, the next likely work is reviewing PR #6 or preparing Phase 8 deployment TODO.
