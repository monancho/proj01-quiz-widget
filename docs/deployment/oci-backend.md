# OCI Backend Deployment Checklist

## Goal

Run the Express API and SQLite database on an OCI Ubuntu host through Docker Compose.

## Server Prerequisites

- Ubuntu host with SSH access.
- Docker Engine installed.
- Docker Compose plugin installed.
- Ports `80` and `443` open in OCI security rules.
- A DNS record pointing the API domain to the OCI public IP.
- Optional swap configured for small instances.

## First-Time Setup

```bash
sudo mkdir -p /opt/proj01-quiz-widget
sudo chown "$USER:$USER" /opt/proj01-quiz-widget
cd /opt/proj01-quiz-widget
git clone https://github.com/monancho/proj01-quiz-widget.git .
git checkout develop
cp infra/env/api.env.example infra/env/api.env
```

Edit `infra/env/api.env`:

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=/data/proj01-quiz.sqlite
CORS_ALLOWED_ORIGINS=https://your-project.pages.dev
TISTORY_HOME_URL=https://your-blog.tistory.com
```

## Start

```bash
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
curl -fsS http://127.0.0.1/health
```

## Update

```bash
cd /opt/proj01-quiz-widget
git fetch origin
git checkout develop
git pull --ff-only origin develop
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
curl -fsS http://127.0.0.1/health
```

## SQLite Data

The Compose stack stores SQLite data in the named Docker volume `quiz-data`.

Back up the volume before risky deploys:

```bash
docker run --rm -v proj01-quiz-widget_quiz-data:/data -v "$PWD":/backup alpine tar czf /backup/quiz-data-backup.tgz /data
```

## Proxy

The default Caddyfile listens on `:80` and proxies to the API service.

For direct HTTPS on a real API domain, update `infra/caddy/Caddyfile` from:

```caddy
:80
```

to:

```caddy
api.example.com
```

Then restart:

```bash
docker compose -f infra/docker-compose.yml up -d
```
