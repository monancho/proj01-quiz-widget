# proj01-quiz-widget

Tistory posts can embed this multiple-choice quiz widget through an iframe. The MVP provides a React frontend, an Express API, and SQLite storage for Slug Groups and quizzes.

## Current Scope

The project is being built from the planning documents in `docs/`.

- Phase 0: project baseline
- Phase 1: backend foundation
- Phase 2~4: Slug Group, Quiz, and Public Embed APIs
- Phase 5: public iframe frontend

## Repository Layout

```text
client/       Frontend app
server/       Express API
migrations/   SQLite migration SQL
infra/        Deployment and reverse proxy files
docs/         Requirements, implementation plan, task breakdown, work logs
```

## Backend Commands

Run these commands from `server/`.

```bash
npm install
npm run db:migrate
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

## Frontend Commands

Run these commands from `client/`.

```bash
npm install
npm run dev
npm run build
```

Local iframe URL:

```bash
http://localhost:5173/embed/{postSlug}
```

## Deployment Prep

Phase 8 deployment artifacts are prepared under:

- `server/Dockerfile`
- `infra/docker-compose.yml`
- `infra/caddy/Caddyfile`
- `infra/env/api.env.example`
- `docs/deployment/cloudflare-pages.md`
- `docs/deployment/oci-backend.md`
- `docs/deployment/deployment-smoke-test.md`
- `docs/deployment/manual-oci-first-deploy.md`
- `docs/deployment/backend-image-pipeline.md`
- `docs/deployment/ko-deployment-guide.md`
- `.github/workflows/backend-deploy.example.yml`
- `.github/workflows/backend-image.yml`

Backend local Docker Compose entry point:

```bash
cp infra/env/api.env.example infra/env/api.env
docker compose -f infra/docker-compose.yml up -d --build
curl http://localhost/health
```

First backend deploy should be manual on the OCI host:

```bash
docker compose -f infra/docker-compose.yml up -d --build
curl http://localhost/health
```

Backend image pipeline for later:

```text
ghcr.io/monancho/proj01-quiz-widget-api:develop
```

SQLite is stored as a Docker volume, not as a separate database container.

Cloudflare Pages should use `client` as the root directory, `npm run build` as the build command, and `dist` as the output directory.

## Environment

Copy `server/.env.example` to `server/.env` for local overrides.

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | Express API port |
| `DATABASE_PATH` | `../data/proj01-quiz.sqlite` | SQLite database path when running from `server/` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Frontend origins allowed later by CORS |
| `TISTORY_HOME_URL` | `https://your-blog.tistory.com` | Result CTA target |
| `ADMIN_API_TOKEN` | unset | Admin API token. Optional for local dev, required in production |

Client-side optional variables:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | same origin | API base URL for the iframe frontend |
| `VITE_BANNER_TEXT` | unset | Banner is currently disabled |
| `VITE_BANNER_URL` | unset | Banner is currently disabled |
| `VITE_BANNER_CTA` | unset | Banner is currently disabled |

Do not put `ADMIN_API_TOKEN` in frontend build variables. Enter it in `/admin`
at runtime and keep the real value only in private deployment secrets.

## Work Tracking

Start each new session by reading:

- `docs/00-project-status.md`
- the latest file in `docs/worklog/`

