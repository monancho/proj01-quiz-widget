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
| `VITE_API_BASE_URL` | `https://api.example.com` | Yes |
| `VITE_BANNER_TEXT` | `관련 글 더 보기` | No |
| `VITE_BANNER_URL` | `https://your-blog.tistory.com` | No |
| `VITE_BANNER_CTA` | `열기` | No |

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
- The backend `CORS_ALLOWED_ORIGINS` must include the final Cloudflare Pages domain.
- If a custom domain is attached later, add that domain to backend CORS too.
