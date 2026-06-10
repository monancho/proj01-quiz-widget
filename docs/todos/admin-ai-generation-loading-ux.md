# Admin AI Generation Loading UX TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-06-10.md`
- `docs/todos/ai-quiz-generation-admin-ui.md`

## Goal

Improve the waiting experience while Admin AI quiz generation is running.

## Scope

- Add a clear in-modal loading state during AI generation.
- Explain that generation may take several seconds.
- Prevent duplicate submission while loading.
- Keep the existing Admin tone: quiet, compact, and work-tool-like.

## Out Of Scope

- Fake progress percentages.
- Doodle or image moderation integration.
- Frontend secrets or direct AI Server calls.
- Backend API behavior changes.

## Implementation Checklist

- [x] Add source-type-specific loading copy.
- [x] Add an accessible loading panel inside the AI generation modal.
- [x] Make submit button text clearly switch to generating state.
- [x] Add scoped CSS for the loading panel.

## Verification Checklist

- [x] Run frontend build.
- [x] Run `git status`.

## Handoff Notes

- The loading UI is intentionally indeterminate because the backend does not stream progress.
