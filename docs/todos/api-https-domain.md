# API HTTPS Domain TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `infra/caddy/Caddyfile`
- `infra/docker-compose.yml`
- `docs/deployment/oci-backend.md`
- `docs/deployment/cloudflare-pages.md`
- `docs/deployment/ko-deployment-guide.md`

## Goal

Move the production API endpoint from the temporary HTTP server IP to `https://api.monancho.com`.

## Scope

- Update Caddy to serve the API on `api.monancho.com` with automatic HTTPS.
- Document the required Cloudflare DNS, OCI port, server restart, and frontend env steps.
- Keep the frontend API base URL as `https://api.monancho.com`.
- Keep raw server IP values out of committed files.

## Out of Scope

- Directly changing Cloudflare DNS from this repository.
- Directly SSHing to the OCI server from this session.
- Adding GitHub Actions automation.

## Implementation Checklist

- [x] Update `infra/caddy/Caddyfile` to use `api.monancho.com`.
- [x] Keep production env example aligned with the current disabled banner decision.
- [x] Update deployment docs with DNS and server restart steps.
- [x] Update project status and worklog.

## Verification Checklist

- [x] `docker compose -f infra/docker-compose.yml config` passes locally.
- [x] Caddyfile syntax is simple and documented for server-side validation.
- [x] `git status` checked before commit.

## Handoff Notes

- In Cloudflare DNS, create `A api -> OCI public IP`.
- Start with DNS-only mode until `https://api.monancho.com/health` works.
- After the API domain works, set Cloudflare Pages `VITE_API_BASE_URL=https://api.monancho.com` and redeploy.
