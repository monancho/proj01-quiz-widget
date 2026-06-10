# Deployment Smoke Test

## Backend

Run from any machine that can reach the API domain:

```bash
curl -fsS https://api.monancho.com/health
curl -fsS https://api.monancho.com/api/embed/{postSlug}/quizzes
```

Expected:

- `/health` returns `status: ok`.
- Published complete Slug Groups return 3 public quizzes.
- Private, preparing, missing, or incomplete Slug Groups return `[]`.

## Frontend

Open:

```text
https://monancho.com/admin
https://monancho.com/embed/{postSlug}?theme=system
https://monancho.com/embed/{postSlug}?theme=light
https://monancho.com/embed/{postSlug}?theme=dark
```

Check:

- Admin route loads.
- Slug Groups load from the API.
- iframe route loads 3 quizzes for a published complete Slug Group.
- Initial, correct, incorrect, next, and final result states work.
- Public iframe body background remains transparent.

## Mixed Content Check

If `https://monancho.com` fails to load data from the API, check the browser console for mixed-content or CORS errors.

Fix by moving the API behind HTTPS, for example:

```text
https://api.monancho.com
```

## Tistory iframe

Use the iframe code from the admin utility modal.

Check in a real Tistory post:

- Desktop article layout.
- Mobile article layout.
- Light blog skin.
- Dark or image-heavy blog skin if applicable.
- iframe height does not dominate the article.
- Links and buttons are tappable on mobile.

## Rollback

Backend rollback:

```bash
cd /opt/proj01-quiz-widget
git log --oneline -5
git checkout <known-good-commit>
docker compose -f infra/docker-compose.yml up -d --build
curl -fsS http://127.0.0.1/health
```

Frontend rollback:

- Use Cloudflare Pages deployment history.
- Promote the previous successful deployment.
