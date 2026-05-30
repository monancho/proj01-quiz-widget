# Korean Deployment Guide and Image Push TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `docs/deployment/manual-oci-first-deploy.md`
- `docs/deployment/cloudflare-pages.md`
- `docs/deployment/backend-image-pipeline.md`
- `infra/docker-compose.yml`

## Goal

Confirm Docker Desktop is running, build and push the backend API Docker image if possible, and provide Korean deployment guidance for backend and frontend deployment.

## Scope

- Re-check local Docker daemon status.
- Build the backend API image locally.
- Smoke-test the image locally when possible.
- Push the image to GHCR when Docker registry authentication allows it.
- Add a Korean deployment guide covering backend Docker deployment and Cloudflare Pages static frontend deployment.
- Keep raw server IP values out of committed files.

## Out of Scope

- GitHub Actions automation enablement.
- Storing credentials, tokens, or raw server IPs in the repository.
- Direct SSH deployment to the OCI host.
- Cloudflare DNS changes.

## Implementation Checklist

- [x] Check Docker Desktop status.
- [x] Build `ghcr.io/monancho/proj01-quiz-widget-api:develop`.
- [x] Smoke-test the built image locally.
- [x] Attempt image push to GHCR.
- [x] Document GHCR authentication fallback if push is blocked.
- [x] Add Korean backend/frontend deployment guide.
- [x] Update project status and worklog.

## Verification Checklist

- [x] `docker ps` confirms the daemon is reachable.
- [x] `docker build` completes or the blocker is documented.
- [x] Local container `/health` check passes or the blocker is documented.
- [x] `docker push` succeeds or the authentication blocker is documented.
- [x] `git status` is checked before commit.

## Handoff Notes

- The backend SQLite database is stored in the Docker volume `quiz-data:/data`; it is not a separate image.
- If GHCR push fails, the next user action is to log in with a GitHub PAT that has `write:packages`.
- Production frontend should call an HTTPS API endpoint to avoid browser mixed-content blocking.
