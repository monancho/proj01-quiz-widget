# Phase 5 TODO - Client Embed MVP

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `docs/02-implementation-plan.md`
- `docs/todos/phase-4-public-embed-api.md`

## Branch

- Current branch: `feature/client-embed-mvp`
- Base branch: `feature/server-api-mvp` until PR #1 is merged into `develop`
- Target branch after PR #1 merge: `develop`

## Scope

Implement Phase 5 from `docs/03-task-breakdown.md`: public iframe frontend MVP.

## Out of Scope

- Admin frontend screens
- Slug Group CRUD UI
- Quiz CRUD UI
- Markdown/LaTeX rendering
- Server-side answer validation
- Deployment automation
- Production Cloudflare Pages configuration

## Implementation Checklist

- [ ] T5-01: Configure React/Vite/Tailwind under `client`.
- [ ] T5-02: Add route handling for `/embed/:postSlug`.
- [ ] T5-03: Add API client helper for `GET /api/embed/:slug/quizzes`.
- [ ] T5-04: Implement `EmbedQuizPage` with loading, empty, error, active, and completed states.
- [ ] T5-05: Implement `QuizCard` to show question and four choices.
- [ ] T5-06: Grade immediately after choice selection and show correct/incorrect feedback.
- [ ] T5-07: Add next-question and completion flow for up to 3 quizzes.
- [ ] T5-08: Implement `ResultSummary` with correct count and retry action.
- [ ] T5-09: Implement static banner area driven by environment variables.
- [ ] T5-10: Keep layout stable inside a fixed iframe-friendly height around 720px.

## Frontend Checklist

- [ ] Public route works when opened directly at `/embed/:postSlug`.
- [ ] Empty API response shows a useful empty state.
- [ ] API/network failure shows a useful error state.
- [ ] Choice buttons keep stable dimensions after selection.
- [ ] Correct choice is clearly distinguished from incorrect choice.
- [ ] Explanation is visible after answering.
- [ ] Result screen shows after the final quiz.
- [ ] Retry resets the local quiz state.
- [ ] Static banner does not overlap quiz content.
- [ ] Mobile and desktop iframe widths are usable.

## Verification Checklist

- [ ] Install frontend dependencies.
- [ ] Run frontend lint/build command if configured.
- [ ] Start the API server.
- [ ] Seed or create a published Slug Group with 3 quizzes.
- [ ] Start the Vite dev server.
- [ ] Verify `/embed/:postSlug` in a browser.
- [ ] Verify loading, empty, error, answer, next, result, and retry states.
- [ ] Run `git diff --check`.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.
- [ ] Commit Phase 5 changes.

## Handoff Notes

- Phase 5 should consume the Phase 4 public API response array directly.
- The frontend may expose answers because the MVP intentionally performs immediate client-side grading.
- Keep the first frontend pass focused on iframe usability before admin UI or rendering enhancements.
- Because PR #1 is still open, keep this branch local or stacked until the API MVP lands in `develop`.
