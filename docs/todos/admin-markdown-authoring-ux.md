# Admin Markdown Authoring UX TODO

## Source Documents

- `AGENTS.md`
- `docs/03-task-breakdown.md`
- `docs/todos/phase-7-rendering-security.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`

## Goal

Improve and verify the admin authoring flow for Markdown and LaTeX content without changing quiz behavior or backend APIs.

## Scope

- Add lightweight Markdown textarea convenience for question and explanation fields.
- Continue unordered lists when pressing Enter after `- item`, `* item`, or `+ item`.
- Continue numbered lists when pressing Enter after `1. item` or `1) item`.
- Continue blockquotes when pressing Enter after `> item`.
- Exit empty Markdown continuation lines cleanly.
- Verify rendering scenarios with mixed Markdown and LaTeX in question, choices, and explanation.
- Preserve current live widget preview and public iframe rendering behavior.

## Out of Scope

- Full Markdown editor toolbar.
- WYSIWYG editing.
- Backend/API changes.
- Database schema changes.
- New Markdown syntax beyond the renderer already supports.
- Changing quiz scoring, reorder, status, or iframe copy behavior.

## Implementation Checklist

- [x] Add a small Markdown continuation helper for admin textareas.
- [x] Wire the helper to `question` and `explanation` textareas.
- [x] Preserve controlled React form updates and caret position after auto insertion.
- [x] Keep normal Enter behavior when no supported Markdown prefix is present.
- [x] Keep Shift/Ctrl/Alt/Meta Enter behavior unchanged.

## Verification Checklist

- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify unordered list auto-continuation.
- [x] Verify numbered list auto-continuation.
- [x] Verify blockquote auto-continuation.
- [x] Verify empty continuation line exits the list/blockquote.
- [x] Verify question preview renders Markdown and LaTeX.
- [x] Verify public iframe renders Markdown and LaTeX for question, choices, and explanation.
- [x] Verify no horizontal overflow at mobile width.
- [x] Clean up temporary QA data.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.

## Verification Results

- `npm.cmd run build` in `client/`: passed.
- Headless Edge admin authoring QA used temporary `markdown-ux-*` data and deleted it after verification.
- Unordered list continuation produced `- alpha\n- `.
- Empty unordered continuation line exited to `- alpha\n`.
- Numbered list continuation produced `1. alpha\n2. `.
- Blockquote continuation produced `> quote\n> `.
- Empty blockquote continuation line exited to `> quote\n`.
- Admin widget preview rendered Markdown strong text, list items, and KaTeX.
- Public iframe mobile `390px` rendered Markdown strong text, list items, inline code, inline math, block math, and blockquote across question, choices, and explanation.
- Public iframe mobile check had no horizontal overflow and kept the body background transparent.

## Rollback Notes

- The authoring helper should stay local to the admin frontend.
- If it causes unexpected input behavior, remove the textarea `onKeyDown` wiring and helper without touching the renderer.

## Handoff Notes

- The expected result is a smoother authoring experience for common Markdown blocks and better QA coverage for rich quiz content.
