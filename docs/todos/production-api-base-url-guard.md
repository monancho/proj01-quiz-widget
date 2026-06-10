# Production API Base URL Guard TODO

## Source Docs

- `AGENTS.md`
- `docs/00-project-status.md`
- `docs/worklog/2026-05-30.md`
- `client/src/api/adminApi.js`
- `client/src/api/embedApi.js`
- `client/vite.config.js`

## Goal

Make production API configuration failures explicit instead of silently falling back to same-origin `/api` requests.

## Context

Local development works without `VITE_API_BASE_URL` because Vite proxies `/api` to `http://127.0.0.1:3000`. Cloudflare production does not have that proxy, so missing `VITE_API_BASE_URL` causes requests to hit the frontend origin and can return HTML, leading to `Unexpected token '<'` JSON parse errors.

## Scope

- Keep local Vite proxy behavior unchanged.
- Require `VITE_API_BASE_URL` for production builds/runtime API requests.
- Improve admin API response parsing so non-JSON responses produce a clear error.
- Improve embed API response parsing so non-JSON responses produce a clear error.
- Update docs/status/worklog.

## Out of Scope

- Adding a Cloudflare Worker proxy.
- Changing backend routes.
- Changing API domain/DNS/Caddy settings.

## Implementation Checklist

- [x] Add a shared API base URL resolver.
- [x] Update admin API client to use the resolver.
- [x] Update embed API client to use the resolver.
- [x] Improve non-JSON response errors.
- [x] Update status and worklog.

## Verification Checklist

- [x] `npm.cmd run build` passes with `VITE_API_BASE_URL` set.
- [x] Static search confirms API clients use the shared resolver.
- [x] `git status` checked before commit.

## Handoff Notes

- In local dev, no `VITE_API_BASE_URL` is required because Vite proxy remains active.
- In Cloudflare, `VITE_API_BASE_URL` must be set before deployment because Vite injects it at build time.
