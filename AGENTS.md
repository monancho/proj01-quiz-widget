# AGENTS.md

This file is the persistent operating guide for Codex agents working in this repository.

## Project

This project is a Tistory iframe multiple-choice quiz widget.

The MVP uses:

- React + Vite for the frontend
- Express for the API server
- SQLite for persistence
- Cloudflare Pages for frontend deployment later
- OCI Ubuntu + Docker Compose for backend deployment later

## Always Read First

At the start of every session, read these files in order:

1. `docs/00-project-status.md`
2. the latest file in `docs/worklog/`
3. `docs/03-task-breakdown.md`
4. `docs/01-requirements.md` when product behavior is unclear
5. `docs/02-implementation-plan.md` when implementation shape is unclear

Human-facing checkpoint documents live under `docs/human/`.
Use this structure:

- `docs/human/index.html`: entry point for human-facing documents
- `docs/human/guides/`: durable guides and operating explanations
- `docs/human/reports/`: checkpoint and milestone reports
- `docs/human/decisions/`: human decision notes and tradeoff records

Do not update human-facing reports every session; update them only when the user asks for a checkpoint/report or when a meaningful milestone needs a human-readable summary.

## Workflow

- Work from `develop` using feature branches.
- Keep changes small, phase-based, and verifiable.
- Follow the phase order in `docs/03-task-breakdown.md`.
- Before starting implementation for a new phase, check whether a phase TODO file exists under `docs/todos/`.
- If the phase TODO file does not exist, create it before editing application code.
- A phase TODO file must include source docs, scope, out-of-scope items, implementation checklist, verification checklist, and handoff notes.
- Update `docs/00-project-status.md` when phase status changes.
- Update the latest `docs/worklog/YYYY-MM-DD.md` during meaningful progress.
- Keep human-facing HTML documents categorized under `docs/human/`; do not put all human-readable content into one file.
- Commit after each completed phase or coherent task group.
- Do not skip verification before committing.

## Branch Strategy

- `develop`: integration branch
- `feature/project-scaffold`: Phase 0 + Phase 1
- `feature/server-api-mvp`: Phase 2 + Phase 3 + Phase 4
- `feature/client-embed-mvp`: Phase 5
- `feature/admin-mvp`: Phase 6
- `feature/docker-deploy`: Phase 8

## Implementation Rules

- Preserve MVP scope from `docs/01-requirements.md`.
- Do not introduce external services before the local MVP works.
- Prefer simple local implementation over premature abstraction.
- Keep `post_slug` management at the Slug Group level.
- Do not accept `post_slug` from quiz create/update requests.
- Enforce the 3-quiz publish rule for Slug Groups.
- Public embed APIs must return quiz object arrays only.
- Use `npm.cmd` on Windows PowerShell when `npm` is blocked by execution policy.

## Verification

Before finalizing a task:

- run relevant install, migration, test, or smoke-check commands
- verify `git status`
- update project status and worklog
- summarize commit hashes in the final response

## Handoff Rule

Every meaningful implementation session should leave the repository in a state where a new Codex session can continue by reading:

1. `AGENTS.md`
2. `docs/00-project-status.md`
3. the latest `docs/worklog/YYYY-MM-DD.md`
