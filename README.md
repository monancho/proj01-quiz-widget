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

## Environment

Copy `server/.env.example` to `server/.env` for local overrides.

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | Express API port |
| `DATABASE_PATH` | `../data/proj01-quiz.sqlite` | SQLite database path when running from `server/` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Frontend origins allowed later by CORS |
| `TISTORY_HOME_URL` | `https://your-blog.tistory.com` | Result CTA target |

Client-side optional variables:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | same origin | API base URL for the iframe frontend |
| `VITE_BANNER_TEXT` | `관련 글 더 보기` | Static banner text |
| `VITE_BANNER_URL` | empty | Static banner link URL |
| `VITE_BANNER_CTA` | `열기` | Static banner CTA label |

## Work Tracking

Start each new session by reading:

- `docs/00-project-status.md`
- the latest file in `docs/worklog/`

