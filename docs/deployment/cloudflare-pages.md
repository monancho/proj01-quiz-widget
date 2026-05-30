# Cloudflare Pages Frontend Deployment

## Goal

Deploy the React/Vite client as the public admin and iframe frontend.

## Build Settings

Use these Cloudflare Pages settings:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `client` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `24` |

## Environment Variables

Set these in Cloudflare Pages:

| Variable | Example | Required |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://api.monancho.com` | Yes |
| `VITE_BANNER_TEXT` | unset | No |
| `VITE_BANNER_URL` | unset | No |
| `VITE_BANNER_CTA` | unset | No |

The iframe banner is currently disabled. Do not set `VITE_BANNER_*` variables for the current deployment.

Do not set `ADMIN_API_TOKEN` in Cloudflare Pages. The admin token is entered by
the administrator in `/admin` at runtime and must stay out of frontend build
variables.

`VITE_API_BASE_URL` is required for production builds. Local development can work without it because `client/vite.config.js` proxies `/api` to the local backend, but Cloudflare does not have that local proxy.

Do not use the raw HTTP server IP for the production frontend. `https://monancho.com` should call `https://api.monancho.com` to avoid browser mixed-content blocking.

If browser Network requests go to `https://monancho.com/api/...`, the environment variable was not applied to that deployment. A correctly configured build should request `https://api.monancho.com/api/...` after the API domain is ready.

## Current Domains

| Item | Value |
| --- | --- |
| Frontend domain | `https://monancho.com` |
| API endpoint | `https://api.monancho.com` |
| Tistory blog | `https://monancho.tistory.com/` |

## HTTPS API Warning

Cloudflare Pages custom domains normally serve the frontend over HTTPS.

If `https://monancho.com` calls a raw `http://` server IP, the browser can block the request as mixed content. Keep raw server IPs out of committed docs/env examples and use an HTTPS API endpoint, for example:

```text
https://api.monancho.com
```

When that API domain is ready, update:

- Cloudflare Pages `VITE_API_BASE_URL`.
- Backend `CORS_ALLOWED_ORIGINS`.
- `docs/deployment/deployment-smoke-test.md`.

## Deploy Steps

1. Connect the GitHub repository to Cloudflare Pages.
2. Select the `develop` branch for the first MVP deployment.
3. Set the root directory to `client`.
4. Add the environment variables above.
5. Run the first deployment.
6. Open `/admin` and `/embed/{postSlug}?theme=system`.
7. Confirm the frontend can call the backend API.

## Notes

- The iframe route must be publicly reachable from Tistory.
- The backend `CORS_ALLOWED_ORIGINS` must include `https://monancho.com`.
- If a custom domain is attached later, add that domain to backend CORS too.
