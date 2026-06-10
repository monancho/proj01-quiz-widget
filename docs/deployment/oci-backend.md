# OCI Backend Deployment Checklist

## Goal

Run the Express API and SQLite database on an OCI Ubuntu host through Docker Compose.

For the current deployment, prefer pulling the prebuilt GHCR image and running Compose with `--no-build`. The repository is still pulled on the server so the latest Caddyfile, Compose file, and env examples are available.

## Server Prerequisites

- Ubuntu host with SSH access.
- Docker Engine installed.
- Docker Compose plugin installed.
- Ports `80` and `443` open in OCI security rules.
- A DNS record pointing the API domain to the OCI public IP.
- Optional swap configured for small instances.

## Current Endpoint Values

| Item | Value |
| --- | --- |
| OCI public API endpoint | Keep in local/server env only |
| Frontend origin | `https://monancho.com` |
| Tistory blog | `https://monancho.tistory.com/` |

Do not commit raw server IPs. Keep the IP in local notes, DNS, OCI console, or the production server's private `infra/env/api.env`. The production frontend should call an HTTPS API endpoint to avoid browser mixed-content blocking.

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
ADMIN_API_TOKEN=replace-with-long-random-admin-token
```

For the current deployment values:

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=/data/proj01-quiz.sqlite
CORS_ALLOWED_ORIGINS=https://monancho.com
TISTORY_HOME_URL=https://monancho.tistory.com/
ADMIN_API_TOKEN=replace-with-long-random-admin-token
```

`ADMIN_API_TOKEN` is required for production admin API access. Generate a long
random value and keep the real token only in the OCI server's local
`infra/env/api.env` file or another private secret store. Do not commit it.

## Start

```bash
docker compose -f infra/docker-compose.yml pull api
docker compose -f infra/docker-compose.yml up -d --no-build
docker compose -f infra/docker-compose.yml ps
curl -fsS https://api.monancho.com/health
```

If the OCI host cannot pull from GHCR, log in with a GitHub PAT that can read packages:

```bash
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u monancho --password-stdin
```

## Update

```bash
cd /opt/proj01-quiz-widget
git fetch origin
git checkout feature/deployment-domain-config
git pull --ff-only origin feature/deployment-domain-config
docker compose -f infra/docker-compose.yml pull api
docker compose -f infra/docker-compose.yml up -d --no-build
docker compose -f infra/docker-compose.yml ps
curl -fsS https://api.monancho.com/health
```

If you intentionally need to build on the server as a fallback:

```bash
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

## Proxy and HTTPS API Domain

The production Caddyfile serves the API through:

```text
https://api.monancho.com
```

Before restarting Caddy on the OCI host, create a Cloudflare DNS record:

```text
Type: A
Name: api
Target: YOUR_OCI_PUBLIC_IP
Proxy status: DNS only
```

Keep OCI ingress ports `80` and `443` open. Caddy uses port `80` for certificate validation and port `443` for HTTPS traffic.

After DNS is in place, restart the stack:

```bash
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml logs --tail=80 proxy
curl -fsS https://api.monancho.com/health
```

When this succeeds, set Cloudflare Pages `VITE_API_BASE_URL` to:

```text
https://api.monancho.com
```

Then redeploy the frontend.
