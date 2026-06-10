# Deployment Image Pipeline TODO

## Source

- User request on 2026-05-30: prepare Docker image push/deploy groundwork.
- `infra/docker-compose.yml`
- `server/Dockerfile`
- `.github/workflows/backend-deploy.example.yml`

## Goal

Prepare the backend API to be built as a Docker image, pushed to GitHub Container Registry, and deployed on OCI by pulling the image. Keep SQLite as a persistent Docker volume, not a separate database image.

## Important Architecture Note

SQLite does not run as a separate server container. The API container opens a SQLite file stored in the `quiz-data` Docker volume at `/data/proj01-quiz.sqlite`.

## Scope

- Add GitHub Actions workflow for building and pushing the API image to GHCR.
- Update Compose so the API service has a stable image name.
- Add deploy workflow guidance that pulls the prebuilt image instead of always building on the server.
- Add image pipeline docs.
- Update status/worklog.

## Out of Scope

- Actually pushing an image from this local machine.
- Running a live deployment on OCI.
- Adding a separate SQLite server image.
- Replacing Cloudflare Pages with a frontend container.

## Checklist

- [x] Add image build/push GitHub Actions workflow.
- [x] Add stable API image name to Docker Compose.
- [x] Update backend deploy draft to pull images on OCI.
- [x] Document SQLite volume behavior.
- [x] Document local build vs registry image deployment commands.
- [x] Run lightweight validation.
- [x] Commit and push.

## Verification Results

- `docker compose -f infra/docker-compose.yml config`: passed.
- Compose resolves the API image to `ghcr.io/monancho/proj01-quiz-widget-api:develop`.
- A full local image build/push was not run because this session does not have a running Docker daemon.
- SQLite remains a Docker volume at `quiz-data:/data`, not a separate image.
