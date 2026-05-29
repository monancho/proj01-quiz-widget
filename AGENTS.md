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

Update human-facing docs at these times:

- When the user explicitly asks for a human-readable report, checkpoint, summary, or review artifact.
- After a milestone is completed and verified, such as Phase 0~1 foundation, Phase 2~4 API MVP, Phase 5 iframe UI, Phase 6 admin UI, or deployment readiness.
- Before a user decision is needed, add or update a decision note under `docs/human/decisions/` with options, recommendation, and tradeoffs.
- After a user makes a durable decision that affects architecture, workflow, scope, deployment, or branch strategy.
- Before handing off work across sessions when the current state is too complex for `docs/00-project-status.md` and the worklog alone.
- Before pushing or opening a PR when the user needs a non-technical checkpoint of what changed and what should be reviewed.

Do not update human-facing docs for routine code edits, small bug fixes, normal worklog entries, minor TODO checkbox updates, or commits that do not require human review.

Use the right category:

- `docs/human/guides/`: stable how-to or operating guidance.
- `docs/human/reports/`: milestone, checkpoint, PR-readiness, or review summaries.
- `docs/human/decisions/`: options, recommendations, and final decisions.
- `docs/human/index.html`: navigation only; update it when adding or moving human-facing documents.

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

## Push and PR Strategy

- Commit locally after each completed phase or coherent task group.
- Push after a phase is implemented, verified, and committed, or when the user explicitly asks for remote backup.
- Before pushing, run `git status`, confirm the branch, and make sure the worktree is clean.
- Keep `origin/develop` close to local `develop` after integration milestones.
- Push feature branches with upstream tracking, for example `git push -u origin feature/server-api-mvp`.
- Prefer PRs from feature branches into `develop`.
- Do not push directly to `main`.
- Do not force-push unless the user explicitly asks and the risk is explained.
- If `develop` has local integration commits that the feature branch depends on, push `develop` before pushing the feature branch.
- After pushing, report the pushed branches, latest commit hashes, and PR URL or PR creation link when available.

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
