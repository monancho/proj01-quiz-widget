# Backend Image Pipeline

## Goal

Build the Express API as a Docker image, push it to GitHub Container Registry, and deploy it on OCI with Docker Compose.

## Image

Default image:

```text
ghcr.io/monancho/proj01-quiz-widget-api:develop
```

The Compose file uses:

```yaml
image: ${API_IMAGE:-ghcr.io/monancho/proj01-quiz-widget-api:develop}
```

Set `API_IMAGE` on the server only if you want to pin a specific tag:

```bash
API_IMAGE=ghcr.io/monancho/proj01-quiz-widget-api:sha-<commit>
```

## GitHub Actions

Workflow:

```text
.github/workflows/backend-image.yml
```

It builds and pushes the backend image when:

- manually triggered with `workflow_dispatch`.
- code is pushed to `develop` under `server/**`, `migrations/**`, `server/Dockerfile`, or the workflow itself.

It pushes tags based on branch and commit SHA.

## SQLite

SQLite is not a separate Docker image.

The API container stores the SQLite file in the named volume:

```text
quiz-data:/data
```

The API uses:

```text
DATABASE_PATH=/data/proj01-quiz.sqlite
```

This means:

- Rebuilding or replacing the API image does not delete the DB.
- Removing the `quiz-data` volume deletes the DB.
- Back up the volume before risky deploys.

## Local Build

Use local build mode when developing:

```bash
docker compose -f infra/docker-compose.yml up -d --build
```

## OCI Deploy With Prebuilt Image

Use image pull mode on the server:

```bash
cd /opt/proj01-quiz-widget
git fetch origin
git checkout develop
git pull --ff-only origin develop
docker compose -f infra/docker-compose.yml pull
docker compose -f infra/docker-compose.yml up -d --no-build
docker compose -f infra/docker-compose.yml ps
curl -fsS http://127.0.0.1/health
```

## Rollback

Pin the previous image tag:

```bash
API_IMAGE=ghcr.io/monancho/proj01-quiz-widget-api:sha-<previous-commit> \
docker compose -f infra/docker-compose.yml up -d --no-build
```
