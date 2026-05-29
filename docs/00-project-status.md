# Project Status

## Current

| Item | Value |
| --- | --- |
| Date | 2026-05-29 |
| Base branch | `develop` |
| Current branch | `feature/server-api-mvp` |
| Active scope | Phase 2 kickoff |
| Status | Phase TODO rule added; Phase 2 TODO prepared |

## Completed

- Git repository initialized.
- GitHub remote connected: `https://github.com/monancho/proj01-quiz-widget.git`.
- `develop` branch pushed to `origin/develop`.
- Planning documents committed under `docs/`.
- Phase 0 + Phase 1 implementation committed.
- Agent operating guide added in `AGENTS.md`.
- Human-facing docs categorized under `docs/human/index.html`, `guides/`, `reports/`, and `decisions/`.
- Phase 0 + Phase 1 branch fast-forwarded into local `develop`.
- `feature/server-api-mvp` branch created for Phase 2+ backend API work.
- Phase TODO convention added to `AGENTS.md`.
- Phase 2 TODO file added under `docs/todos/`.

## Phase 0 TODO

- [x] T0-01: Create project structure: `client`, `server`, `migrations`, `infra`.
- [x] T0-02: Draft root `README.md` with run commands and environment overview.
- [x] T0-03: Review and update `.gitignore` for Node, env files, SQLite files, and build outputs.

## Phase 1 TODO

- [x] T1-01: Create Express server base.
- [x] T1-02: Implement `GET /health`.
- [x] T1-03: Add environment variable loading and `.env.example`.
- [x] T1-04: Add SQLite connection helper.
- [x] T1-05: Add initial migration SQL for `quiz_sets` and `quizzes`.
- [x] T1-06: Add migration execution script exposed as `npm run db:migrate`.

## Verification TODO

- [x] Install backend dependencies.
- [x] Run migration script.
- [x] Start API server.
- [x] Verify `GET /health` returns `200`.
- [x] Run final `git status`.
- [x] Commit Phase 0 + Phase 1 implementation.

## Last Verification

- `npm.cmd install`: completed, 0 vulnerabilities.
- `npm.cmd run db:migrate`: applied `0001_init_quiz_sets_and_quizzes.sql`.
- `/health` smoke test: returned `200`.
- Implementation commit: `6a62601 phase0-1: scaffold backend foundation`.
- Agent guide commit: `45a44d2 docs: add agent operating guide`.
- Human docs restructure commit: `f5fb96f docs: separate human-facing reports`.
- Human docs category commit: `9d0ddda docs: categorize human documentation`.
- Phase TODO rule commit: pending.
- Note: Node 24 reports `node:sqlite` as experimental.

## Next

- Implement Phase 2: Slug Group API.
- Start from `docs/todos/phase-2-slug-group-api.md`.
- Implement `post_slug` normalization and validation first.
