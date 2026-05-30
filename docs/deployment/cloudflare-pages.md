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
| `VITE_API_BASE_URL` | `http://168.110.121.222` | Yes |
| `VITE_BANNER_TEXT` | `관련 글 더 보기` | No |
| `VITE_BANNER_URL` | `https://monancho.tistory.com/` | No |
| `VITE_BANNER_CTA` | `열기` | No |

## Current Domains

| Item | Value |
| --- | --- |
| Frontend domain | `https://monancho.com` |
| Current OCI API endpoint | `http://168.110.121.222` |
| Tistory blog | `https://monancho.tistory.com/` |

## HTTPS API Warning

Cloudflare Pages custom domains normally serve the frontend over HTTPS.

If `https://monancho.com` calls `http://168.110.121.222`, the browser can block the request as mixed content. Use the IP endpoint for backend smoke testing, but production should use an HTTPS API endpoint, for example:

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
