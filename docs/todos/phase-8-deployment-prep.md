# Phase 8 Deployment Prep TODO

## Source Documents

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/03-task-breakdown.md`
- `docs/02-implementation-plan.md`
- Current `client/`, `server/`, `migrations/`, and `infra/` implementation

## Branch

- Base branch: `develop`
- Working branch: `feature/docker-deploy`

## Goal

Prepare deployment artifacts for the MVP without performing a live production deployment.

## Scope

- Backend Dockerfile for the Express API.
- Docker Compose stack for API + reverse proxy.
- Reverse proxy configuration.
- Production environment examples.
- Cloudflare Pages deployment guide for the frontend.
- OCI backend deployment checklist.
- GitHub Actions backend deploy draft.
- Deployment smoke test guide.

## Out of Scope

- Actually provisioning OCI resources.
- Actually deploying to Cloudflare Pages.
- Adding authentication.
- Changing API behavior.
- Changing database schema.
- Migrating from SQLite to another database.

## Implementation Checklist

- [x] Add server Dockerfile.
- [x] Add Docker context ignore rules.
- [x] Add Docker Compose stack under `infra/`.
- [x] Add reverse proxy configuration under `infra/`.
- [x] Add production API env example.
- [x] Add client env example for Cloudflare Pages.
- [x] Add deployment docs under `docs/deployment/`.
- [x] Add GitHub Actions backend deploy draft.
- [x] Update root README with deployment entry points.
- [x] Update project status and worklog.

## Verification Checklist

- [x] Run server smoke tests.
- [x] Run client build.
- [x] Validate deployment files can be read and referenced by docs.
- [x] Run final `git status`.
- [ ] Commit and push `feature/docker-deploy`.

## Verification Results

- `npm.cmd run smoke:phase2` in `server/`: passed after rerun outside sandbox because sandbox blocked temporary SQLite smoke DB creation.
- `npm.cmd run smoke:phase3` in `server/`: passed after rerun outside sandbox because sandbox blocked temporary SQLite smoke DB creation.
- `npm.cmd run smoke:phase4` in `server/`: passed after rerun outside sandbox because sandbox blocked temporary SQLite smoke DB creation.
- `npm.cmd run build` in `client/`: passed.
- `docker compose -f infra/docker-compose.yml config`: passed.
- Full Docker image build was not run because the local Docker daemon was not running.

## Rollback Notes

This phase should be rollback-safe because it adds deployment files and docs only. No runtime app behavior should change.

## Handoff Notes

After this phase, the next human step is choosing real production domains:

- Cloudflare Pages frontend domain.
- Backend API domain on OCI.
- Tistory blog origin for CORS.
