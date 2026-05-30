# 한글 배포 가이드

## 현재 상태

2026-05-30 기준으로 로컬 Docker Desktop은 실행 중입니다.

확인된 내용:

- `docker ps`: Docker daemon 접근 가능
- `docker build`: 백엔드 API 이미지 빌드 성공
- 로컬 컨테이너 `/health`: 정상 응답
- `docker push`: GHCR 인증 문제로 실패, registry 응답은 `denied`

현재 로컬에 빌드된 이미지:

```text
ghcr.io/monancho/proj01-quiz-widget-api:develop
```

주의:

- 원본 서버 IP는 GitHub에 올리지 않습니다.
- 실제 서버 IP는 OCI 콘솔, DNS 설정, 로컬 메모, 서버 내부 `.env`처럼 공개 저장소 밖에서만 관리합니다.
- HTTPS 프론트엔드에서 HTTP API를 호출하면 브라우저 mixed content 정책으로 차단될 수 있습니다. 운영에서는 `https://api.monancho.com` 같은 HTTPS API 주소를 쓰는 것이 좋습니다.

## 1. 로컬 Docker 상태 확인

Windows CMD 기준:

```bat
docker ps
docker images
```

정상이라면 `docker ps`가 컨테이너 목록을 출력합니다. 컨테이너가 없어도 Docker Desktop이 실행 중이면 빈 목록이 나옵니다.

## 2. 백엔드 이미지 빌드

프로젝트 루트에서 실행합니다.

```bat
cd C:\dev_work\dev_proj01
docker build -f server/Dockerfile -t ghcr.io/monancho/proj01-quiz-widget-api:develop .
```

이미지는 Express API, 마이그레이션 스크립트, SQLite 사용 경로를 포함합니다.

SQLite는 별도 DB 이미지가 아닙니다. 운영 Docker Compose에서는 API 컨테이너가 `quiz-data:/data` Docker volume 안의 SQLite 파일을 사용합니다.

## 3. 로컬 이미지 Smoke Test

빌드한 이미지를 임시 컨테이너로 실행합니다.

```bat
docker run -d --name proj01-api-check ^
  -e NODE_ENV=production ^
  -e PORT=3000 ^
  -e DATABASE_PATH=/tmp/proj01.sqlite ^
  -e CORS_ALLOWED_ORIGINS=http://localhost:5173 ^
  -p 3101:3000 ^
  ghcr.io/monancho/proj01-quiz-widget-api:develop
```

헬스 체크:

```bat
curl http://127.0.0.1:3101/health
```

정상 예시:

```json
{"status":"ok","service":"proj01-quiz-widget-api"}
```

검증 후 임시 컨테이너를 정리합니다.

```bat
docker rm -f proj01-api-check
```

## 4. GHCR 로그인

현재 로컬 이미지 푸시는 GHCR 인증 문제로 막힌 상태입니다. 아래 절차로 로그인한 뒤 다시 푸시하면 됩니다.

GitHub에서 Personal Access Token을 만듭니다.

필요 권한:

- `write:packages`
- 필요 시 `read:packages`

Windows CMD:

```bat
docker login ghcr.io -u monancho
```

비밀번호 입력란에는 GitHub 계정 비밀번호가 아니라 PAT 값을 넣습니다.

로그인 후 푸시:

```bat
docker push ghcr.io/monancho/proj01-quiz-widget-api:develop
```

푸시가 성공하면 OCI 서버에서는 이 이미지를 pull해서 실행할 수 있습니다. 아직 GHCR 자동화는 의도적으로 보류 중입니다.

## 5. 백엔드 수동 배포

처음 배포는 GitHub Actions 없이 OCI 서버에서 직접 진행합니다.

OCI 서버에 접속한 뒤:

```bash
sudo mkdir -p /opt/proj01-quiz-widget
sudo chown "$USER:$USER" /opt/proj01-quiz-widget
cd /opt/proj01-quiz-widget
git clone https://github.com/monancho/proj01-quiz-widget.git .
git checkout feature/deployment-domain-config
cp infra/env/api.env.example infra/env/api.env
```

서버에서만 `infra/env/api.env`를 수정합니다.

```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=/data/proj01-quiz.sqlite
CORS_ALLOWED_ORIGINS=https://monancho.com
TISTORY_HOME_URL=https://monancho.tistory.com/
```

현재 권장 방식은 OCI 서버에서 직접 이미지를 빌드하지 않고 GHCR 이미지를 pull해서 실행하는 것입니다.

먼저 서버의 repo 파일을 최신화합니다. 이 단계는 Caddyfile, Compose 파일, env 예시를 받기 위해 필요합니다.

```bash
cd /opt/proj01-quiz-widget
git fetch origin
git checkout feature/deployment-domain-config
git pull --ff-only origin feature/deployment-domain-config
```

그 다음 API 이미지를 pull하고, 빌드 없이 컨테이너를 갱신합니다.

```bash
docker compose -f infra/docker-compose.yml pull api
docker compose -f infra/docker-compose.yml up -d --no-build
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml logs --tail=80 api
docker compose -f infra/docker-compose.yml logs --tail=80 proxy
curl -fsS https://api.monancho.com/health
```

만약 OCI 서버에서 GHCR pull이 권한 문제로 실패하면 GitHub PAT로 로그인합니다.

```bash
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u monancho --password-stdin
```

PAT에는 package read 권한이 필요합니다.

서버 외부에서 확인할 때는 공개 IP를 직접 문서에 남기지 말고, 로컬 메모에 있는 실제 주소로 확인합니다.

```bash
curl -fsS http://YOUR_OCI_PUBLIC_IP/health
```

## 6. GHCR 이미지 기반 배포로 전환할 때

GHCR 푸시가 성공한 이후에는 OCI 서버에서 빌드하지 않고 이미지를 pull할 수 있습니다.

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

중요:

- `docker compose down -v`는 SQLite volume까지 삭제할 수 있으므로 운영 서버에서 실수로 실행하지 않습니다.
- 일반 재배포는 `pull`, `up -d --no-build` 또는 첫 수동 배포 시 `up -d --build`만 사용합니다.

## 7. SQLite 백업

위험한 업데이트 전에는 volume을 백업합니다.

```bash
docker run --rm \
  -v infra_quiz-data:/data \
  -v "$PWD":/backup \
  alpine tar czf /backup/quiz-data-backup.tgz /data
```

## 8. 프론트엔드 정적 사이트 배포

Cloudflare Pages에서 GitHub 저장소를 연결합니다.

권장 설정:

| 항목 | 값 |
| --- | --- |
| Framework preset | Vite |
| Root directory | `client` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `24` |
| Production branch | `develop` |

Cloudflare Pages 환경 변수:

| 변수 | 값 |
| --- | --- |
| `VITE_API_BASE_URL` | `https://api.monancho.com` |

현재 iframe 배너는 사용하지 않습니다. Cloudflare Pages에는 `VITE_BANNER_TEXT`, `VITE_BANNER_URL`, `VITE_BANNER_CTA`를 설정하지 않습니다.

`VITE_API_BASE_URL`은 운영 빌드에서 필수입니다. 로컬 개발에서는 `client/vite.config.js`의 proxy가 `/api`를 로컬 백엔드로 넘겨주기 때문에 값이 없어도 동작할 수 있지만, Cloudflare 배포 환경에는 이 proxy가 없습니다.

브라우저 Network에서 요청이 `https://monancho.com/api/...`로 보이면 환경 변수가 해당 배포에 적용되지 않은 것입니다. API 도메인이 준비된 뒤에는 `https://api.monancho.com/api/...`로 요청되어야 정상입니다.

운영 프론트엔드에서는 원본 HTTP 서버 IP를 API 주소로 쓰지 않습니다. `https://monancho.com`에서 `http://...` API를 호출하면 브라우저 mixed content 정책으로 막힐 수 있으므로 `VITE_API_BASE_URL=https://api.monancho.com`을 사용합니다.

`api.monancho.com` 준비 순서:

1. Cloudflare DNS에서 `A api -> OCI 공개 IP`를 추가합니다.
2. 처음에는 Proxy status를 `DNS only`로 둡니다.
3. OCI 보안 규칙에서 `80`, `443` TCP 인바운드를 열어둡니다.
4. OCI 서버에서 `docker compose -f infra/docker-compose.yml up -d`를 실행합니다.
5. `curl -fsS https://api.monancho.com/health`가 성공하는지 확인합니다.
6. Cloudflare Pages 환경 변수 `VITE_API_BASE_URL=https://api.monancho.com`을 저장하고 프론트엔드를 다시 배포합니다.

배포 후 확인:

```text
https://monancho.com/admin
https://monancho.com/embed/{postSlug}?theme=system
```

## 9. Tistory iframe 확인

관리자 화면에서 iframe 태그를 복사한 뒤 Tistory 본문 HTML에 붙여넣습니다.

확인할 항목:

- iframe이 글 폭을 넘지 않는지
- 문제 선택 전 화면이 자연스러운지
- 정답 선택 후 피드백이 보이는지
- 오답 선택 후 정답/해설이 보이는지
- 모든 문제 풀이 후 결과 화면이 보이는지
- 라이트, 다크, 시스템 모드가 블로그 스킨에 어색하지 않은지

## 10. 배포 순서 추천

1. OCI 백엔드를 먼저 수동 배포합니다.
2. `/health`가 정상인지 확인합니다.
3. HTTPS API 도메인을 준비합니다.
4. Cloudflare Pages 환경 변수 `VITE_API_BASE_URL`을 HTTPS API 주소로 설정합니다.
5. Cloudflare Pages를 배포합니다.
6. `/admin`에서 Slug Group과 Quiz를 확인합니다.
7. iframe 태그를 Tistory에 붙여넣고 실제 글에서 확인합니다.
8. 안정화 후 GHCR 이미지 pull 방식이나 GitHub Actions 자동화를 도입합니다.
