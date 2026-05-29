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

- [ ] T7-01: Add Markdown rendering for question, choices, and explanation text.
- [ ] T7-02: Add LaTeX rendering for inline and block math.
- [ ] T7-03: Add sanitizing so raw HTML/script payloads cannot execute.
- [ ] T7-04: Share the same rendering behavior between public iframe and admin preview.
- [ ] Add rendering helper module under `client/src/lib/` or a matching local pattern.
- [ ] Replace plain text rendering in public quiz components.
- [ ] Replace plain text rendering in admin live preview.
- [ ] Keep choice buttons accessible after rendered content is inserted.
- [ ] Preserve current immediate grading, feedback, retry, and result behavior.

## Security Checklist

- [ ] Raw `<script>` input must render harmlessly or be removed.
- [ ] Event-handler attributes such as `onclick` must not execute.
- [ ] Unsafe URLs such as `javascript:` must not execute.
- [ ] Sanitizing must be applied after Markdown/LaTeX rendering and before DOM insertion.
- [ ] Admin preview and public iframe must use the same safe renderer.

## Verification Checklist

- [ ] Run `npm.cmd install` in `client/` if new dependencies are added.
- [ ] Run `npm.cmd run build` in `client/`.
- [ ] Verify public iframe renders Markdown formatting.
- [ ] Verify public iframe renders inline and block LaTeX.
- [ ] Verify admin preview renders Markdown/LaTeX the same way.
- [ ] Verify malicious HTML/script test input is sanitized.
- [ ] Verify narrow iframe width has no horizontal overflow.
- [ ] Update `docs/00-project-status.md`.
- [ ] Update latest worklog.
- [ ] Commit Phase 7 changes.

## Handoff Notes

- Prefer a small, shared frontend renderer over duplicating Markdown/LaTeX logic in each component.
- Rendering should not require backend schema changes because quiz text already stores plain strings.
- Keep the implementation local-first and MVP-focused; a rich editor can be deferred.
- If PR #4 is not merged yet, keep Phase 7 commits on `feature/rendering-security` and avoid pushing it as a `develop` PR until the base is ready.
