# Manual OCI First Deployment

## Goal

Deploy the backend on OCI manually first. GitHub Actions and GHCR image automation can be enabled later after the first server deployment is confirmed.

## What Runs in Docker

- API: built from `server/Dockerfile`.
- Reverse proxy: `caddy:2.8-alpine`.
- SQLite: not a separate image. The DB file is stored in the Docker volume `quiz-data:/data`.

## Prerequisites

On the OCI host:

- Docker Engine installed.
- Docker Compose plugin installed.
- Ports `80` and `443` open in OCI security rules.
- Git installed.
- Production env file prepared at `infra/env/api.env`.

## First Deploy

```bash
sudo mkdir -p /opt/proj01-quiz-widget
sudo chown "$USER:$USER" /opt/proj01-quiz-widget
cd /opt/proj01-quiz-widget
git clone https://github.com/monancho/proj01-quiz-widget.git .
git checkout feature/deployment-domain-config
cp infra/env/api.env.example infra/env/api.env
```

Edit `infra/env/api.env` on the server:

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=/data/proj01-quiz.sqlite
CORS_ALLOWED_ORIGINS=https://monancho.com
TISTORY_HOME_URL=https://monancho.tistory.com/
```

Start:

```bash
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml logs --tail=80 api
curl -fsS http://127.0.0.1/health
```

Public smoke test from your local machine:

```bash
curl -fsS http://YOUR_OCI_PUBLIC_IP/health
```

## Update After First Deploy

Before this branch is merged:

```bash
cd /opt/proj01-quiz-widget
git fetch origin
git checkout feature/deployment-domain-config
git pull --ff-only origin feature/deployment-domain-config
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
curl -fsS http://127.0.0.1/health
```

After this branch is merged:

```bash
cd /opt/proj01-quiz-widget
git fetch origin
git checkout develop
git pull --ff-only origin develop
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
curl -fsS http://127.0.0.1/health
```

## SQLite Backup

Back up before risky updates:

```bash
docker run --rm \
  -v infra_quiz-data:/data \
  -v "$PWD":/backup \
  alpine tar czf /backup/quiz-data-backup.tgz /data
```

## GitHub Actions Later

The backend image workflow is manual-only for now. After the first deploy is stable, you can enable GHCR image builds and switch OCI updates to:

```bash
docker compose -f infra/docker-compose.yml pull
docker compose -f infra/docker-compose.yml up -d --no-build
```
