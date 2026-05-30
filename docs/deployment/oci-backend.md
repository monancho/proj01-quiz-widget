# OCI Backend Deployment Checklist

## Goal

Run the Express API and SQLite database on an OCI Ubuntu host through Docker Compose.

For the first deployment, prefer the manual server build flow in `docs/deployment/manual-oci-first-deploy.md`. GitHub Actions and GHCR image pulls can be enabled after the first deployment is stable.

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
```

For the current deployment values:

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=/data/proj01-quiz.sqlite
CORS_ALLOWED_ORIGINS=https://monancho.com
TISTORY_HOME_URL=https://monancho.tistory.com/
```

## Start

```bash
docker compose -f infra/docker-compose.yml up -d --build
docker compose -f infra/docker-compose.yml ps
curl -fsS http://127.0.0.1/health
curl -fsS http://YOUR_OCI_PUBLIC_IP/health
```

If the backend image has already been pushed to GHCR later, you can pull the image instead of building on the server:

```bash
docker compose -f infra/docker-compose.yml pull
docker compose -f infra/docker-compose.yml up -d --no-build
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

Image-based update after GHCR image automation is enabled:

```bash
docker compose -f infra/docker-compose.yml pull
docker compose -f infra/docker-compose.yml up -d --no-build
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
