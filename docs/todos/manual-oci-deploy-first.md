# Manual OCI Deploy First TODO

## Goal

Prioritize a first manual OCI deployment before introducing GitHub Actions based image/deploy automation.

## Context

- User wants to deploy first and use GitHub Actions later.
- Current backend can be built directly on the OCI host with Docker Compose.
- SQLite should remain a Docker volume, not a separate image.

## Scope

- Disable automatic backend image workflow trigger.
- Document first manual OCI deployment path.
- Clarify SQLite volume behavior.
- Keep GHCR image pipeline as a later/manual option.
- Update status and worklog.

## Out of Scope

- Actually SSHing to the OCI host without credentials.
- Actually changing DNS or Cloudflare settings.
- Removing GitHub Actions drafts entirely.

## Checklist

- [x] Make backend image workflow manual-only.
- [x] Add first manual OCI deployment guide.
- [x] Update image pipeline docs to mark GitHub Actions as later/manual.
- [x] Update OCI guide to prioritize `up -d --build`.
- [x] Run lightweight validation.
- [x] Commit and push.

## Verification Results

- `docker compose -f infra/docker-compose.yml config`: passed.
- Backend image workflow now has `workflow_dispatch` only; it will not run automatically on `develop` pushes.
- Manual first deployment guide added at `docs/deployment/manual-oci-first-deploy.md`.
- No raw server IP was committed.
