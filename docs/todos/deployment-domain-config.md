# Deployment Domain Config TODO

## Source

- User-provided deployment values on 2026-05-30.
- `docs/deployment/cloudflare-pages.md`
- `docs/deployment/oci-backend.md`
- `infra/env/api.env.example`
- `client/.env.example`

## Provided Values

| Item | Value |
| --- | --- |
| OCI API endpoint | `http://168.110.121.222/` |
| Cloudflare Pages frontend | `monancho.com` |
| Tistory blog | `https://monancho.tistory.com/` |

## Goal

Reflect the real deployment endpoints in deployment docs and environment examples.

## Important Risk

`https://monancho.com` calling `http://168.110.121.222` can be blocked by browser mixed-content policy. The HTTP IP endpoint can be used for backend smoke testing, but production frontend calls should move to an HTTPS API endpoint such as `https://api.monancho.com`.

## Scope

- Update frontend env examples.
- Update backend env examples.
- Update Cloudflare Pages guide.
- Update OCI backend guide.
- Update deployment smoke test guide.
- Update project status and worklog.

## Out of Scope

- Actually changing DNS.
- Actually deploying Cloudflare Pages.
- Actually deploying OCI.
- Creating certificates.
- Changing application code.

## Checklist

- [x] Update `client/.env.example`.
- [x] Update `infra/env/api.env.example`.
- [x] Update deployment docs with provided domains.
- [x] Document mixed-content risk and HTTPS API recommendation.
- [x] Run lightweight validation.
- [x] Commit and push.

## Verification Results

- `docker compose -f infra/docker-compose.yml config`: passed.
- `http://168.110.121.222/health` check timed out from the local environment, so the API endpoint is not currently verified as reachable.
- No application runtime code was changed.
