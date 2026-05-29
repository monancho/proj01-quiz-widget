# Phase 7 TODO - Rendering and Security

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/01-requirements.md`
- `docs/02-implementation-plan.md`
- `docs/todos/phase-5-client-embed-mvp.md`
- `docs/todos/phase-6-admin-mvp.md`

## Branch

- Current branch: `feature/rendering-security`
- Base branch: stacked on `feature/admin-mvp` until PR #4 is merged into `develop`
- Target integration branch after PR #4 merge: `develop`

## Scope

Implement Phase 7 from `docs/03-task-breakdown.md`: safe Markdown/LaTeX rendering for quiz question text, choices, and explanations in both public iframe and admin preview surfaces.

## Out of Scope

- Changing quiz CRUD API contracts
- Adding rich text editor UI
- Banner CRUD
- Admin authentication
- Deployment configuration
- Scoring API or server-side answer submission

## Implementation Checklist

- [x] T7-01: Add Markdown rendering for question, choices, and explanation text.
- [x] T7-02: Add LaTeX rendering for inline and block math.
- [x] T7-03: Add sanitizing so raw HTML/script payloads cannot execute.
- [x] T7-04: Share the same rendering behavior between public iframe and admin preview.
- [x] Add rendering helper module under `client/src/lib/` or a matching local pattern.
- [x] Replace plain text rendering in public quiz components.
- [x] Replace plain text rendering in admin live preview.
- [x] Keep choice buttons accessible after rendered content is inserted.
- [x] Preserve current immediate grading, feedback, retry, and result behavior.

## Security Checklist

- [x] Raw `<script>` input must render harmlessly or be removed.
- [x] Event-handler attributes such as `onclick` must not execute.
- [x] Unsafe URLs such as `javascript:` must not execute.
- [x] Sanitizing must be applied before DOM insertion.
- [x] Admin preview and public iframe must use the same safe renderer.

## Verification Checklist

- [x] Run `npm.cmd install` in `client/` if new dependencies are added.
- [x] Run `npm.cmd run build` in `client/`.
- [x] Verify public iframe renders Markdown formatting.
- [x] Verify public iframe renders inline and block LaTeX.
- [x] Verify admin preview renders Markdown/LaTeX the same way.
- [x] Verify malicious HTML/script test input is sanitized.
- [x] Verify narrow iframe width has no horizontal overflow.
- [x] Update `docs/00-project-status.md`.
- [x] Update latest worklog.
- [x] Commit Phase 7 changes.

## Verification Results

- `npm.cmd install react-markdown remark-gfm remark-math rehype-katex katex`: completed with 0 vulnerabilities.
- `npm.cmd run build` in `client/`: passed.
- Public iframe QA rendered Markdown bold and KaTeX math for `phase-7-render-check`.
- Public iframe QA confirmed no script tags inside quiz content, no `onerror`, no `javascript:` URL, and no mobile horizontal overflow at 390px width.
- Admin table QA rendered Markdown and KaTeX content through the shared renderer.
- Admin table QA confirmed no script tags inside quiz table content and no `javascript:` URL.

## Handoff Notes

- Prefer a small, shared frontend renderer over duplicating Markdown/LaTeX logic in each component.
- Rendering should not require backend schema changes because quiz text already stores plain strings.
- Keep the implementation local-first and MVP-focused; a rich editor can be deferred.
- If PR #4 is not merged yet, keep Phase 7 commits on `feature/rendering-security` and avoid pushing it as a `develop` PR until the base is ready.
