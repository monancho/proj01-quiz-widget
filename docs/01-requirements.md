# Requirements

## 1. 프로젝트 목표

Tistory 블로그 글 본문 또는 하단에 `iframe`으로 삽입할 수 있는 개인용 4지선다 퀴즈 위젯을 만든다.

방문자는 공개된 Slug Group의 문제를 한 문제씩 풀고, 선택 즉시 정답/오답 피드백과 해설을 확인한다. 관리자는 비공개 관리자 화면에서 Slug Group을 만들고, 각 그룹에 최대 3개의 문제를 등록한다.

## 2. 핵심 개념

| 개념 | 설명 |
| --- | --- |
| Slug Group | Tistory 글 1개에 연결되는 퀴즈 묶음 |
| post_slug | `iframe` URL에 들어가는 고유 식별자 |
| post_title | 관리자 목록에서 식별하기 위한 글 제목 |
| status | Slug Group 공개 상태. `private` 또는 `published` |
| quiz | Slug Group에 속한 객관식 문제 |

`post_slug`는 문제 생성 화면에서 직접 입력하지 않는다. Slug Group 생성/수정 모달에서만 관리하고, 문제 등록/수정 화면에서는 읽기 전용으로 표시한다.

## 3. MVP 포함 범위

| 영역 | 요구사항 |
| --- | --- |
| iframe 위젯 | `/embed/:postSlug` 경로에서 공개 문제 세트를 표시한다. |
| 문제 풀이 | Slug Group당 최대 3개 문제를 한 문제씩 표시한다. |
| 정답 처리 | 보기 선택 즉시 정답/오답, 실제 정답, 해설을 표시한다. |
| 결과 화면 | 3문제 완료 후 정답 수, 총 문제 수, 정답률을 표시한다. |
| 다시 풀기 | 풀이 상태를 초기화하고 1번 문제부터 다시 시작한다. |
| 더 많은 글 보기 | 지정된 Tistory URL로 이동하는 CTA를 제공한다. |
| 정적 배너 | iframe 하단에 환경변수 기반 고정 배너를 표시한다. |
| Slug Group 관리 | 생성, 수정, 삭제, 검색, 공개 상태 필터, 통계 카드를 제공한다. |
| 문제 관리 | Slug Group 안에서 문제 생성, 수정, 삭제를 제공한다. |
| iframe 관리 | 관리자 목록에서 iframe 미리보기와 iframe 코드 복사를 제공한다. |
| Markdown/LaTeX | 문제, 보기, 해설에 Markdown/LaTeX 렌더링을 지원한다. |

## 4. MVP 제외 범위

| 영역 | 제외 항목 |
| --- | --- |
| 계정 | 회원가입, 일반 사용자 로그인, `users` 테이블 |
| 풀이 기록 | 서버 저장, 점수 통계, 랭킹 |
| 콘텐츠 관리 | Tistory 포스트 CRUD, 카테고리, 태그 |
| 배너 관리 | 배너 CRUD, 이미지 업로드, Cloudflare R2 |
| AI | LLM 기반 문제 생성 |
| 서버리스 | Cloudflare Functions, D1 |
| iframe 고도화 | `postMessage` 기반 자동 높이 조절 |

## 5. 기능 요구사항

### 공개 iframe

- 공개 경로는 `/embed/:postSlug`이다.
- API는 `GET /api/embed/:slug/quizzes`를 호출한다.
- API 응답은 문제 객체 배열만 반환한다.
- Slug Group이 없거나, `private`이거나, 문제 수가 3개 미만이면 `200 OK`와 빈 배열을 반환한다.
- 빈 배열이면 iframe 화면은 빈 상태 메시지를 표시한다.

### 관리자 목록

- post_slug 검색을 제공한다.
- 공개 상태 필터를 제공한다.
- 전체, 공개, 비공개, 완료된 글 수 통계를 표시한다.
- Slug Group 카드에는 post_slug, 상태 뱃지, 문제 완료/부족 상태, 설정 버튼, 펼침/접힘 버튼을 표시한다.
- 각 카드에서 iframe 미리보기와 iframe 코드 복사가 가능해야 한다.

### Slug Group 생성/수정

- `post_slug`, `post_title`, `status`를 입력 또는 수정한다.
- `post_slug`는 영문 소문자, 숫자, 하이픈만 허용한다.
- `post_slug`는 전체 Slug Group에서 중복될 수 없다.
- 3문제가 등록되지 않은 Slug Group은 `published`로 전환할 수 없다.
- `post_slug` 수정 시 기존 iframe URL이 무효화될 수 있다는 경고를 표시한다.

### 문제 생성/수정

- 문제 생성 요청에는 `post_slug`를 포함하지 않는다.
- 소속 그룹은 URL의 `setId`로 결정한다.
- 문제는 `sort_order` 1~3 중 하나를 가진다.
- 같은 Slug Group 안에서 `sort_order`는 중복될 수 없다.
- 문제 본문, 보기 4개, 정답 위치, 해설은 필수이다.
- 문제 등록/수정 화면 하단에 실제 iframe에 가까운 미리보기를 표시한다.

## 6. 비기능 요구사항

| 영역 | 요구사항 |
| --- | --- |
| 배포 | 프론트엔드는 Cloudflare Pages, 백엔드는 OCI Ubuntu + Docker Compose로 배포한다. |
| 데이터 | SQLite 파일은 컨테이너 내부가 아닌 호스트 마운트 경로에 저장한다. |
| 보안 | `/admin`, `/api/admin/*`는 Cloudflare Access로 보호한다. |
| CORS | API 요청 출처는 CORS로 제한한다. |
| iframe | 삽입 허용은 CSP `frame-ancestors` 정책으로 관리한다. |
| Markdown 보안 | raw HTML과 script는 차단한다. |
| 성능 | OCI 1GB RAM 제약을 고려해 최소 컨테이너 구성을 사용한다. |

## 7. 검증 규칙

| 항목 | 기준 |
| --- | --- |
| post_slug | `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| post_slug normalization | trim 후 lowercase |
| post_slug uniqueness | 프론트, API, DB UNIQUE로 중복 방어 |
| post_title | trim 후 빈 문자열 금지 |
| status | `private`, `published`만 허용 |
| published 전환 | 문제 수가 정확히 3개여야 가능 |
| sort_order | 1, 2, 3만 허용 |
| question | 필수 |
| choices | 4개 모두 필수 |
| correct_position | 1, 2, 3, 4만 허용 |
| explanation | MVP에서는 필수 |

## 8. 주요 리스크

| 리스크 | 대응 |
| --- | --- |
| OCI 메모리 부족 | 2GB Swap, 최소 컨테이너 구성, 필요 시 GHCR 이미지 pull 방식 검토 |
| SQLite 파일 유실 | host volume 저장 및 백업 정책 수립 |
| 정답 정보 프론트 노출 | MVP에서는 허용, 점수/랭킹 도입 시 서버 검증으로 전환 |
| Cloudflare Access 설정 오류 | `/admin`, `/api/admin/*` 보호 범위 QA 필수 |
| post_slug 변경 | 수정 모달에서 경고 표시 및 iframe 코드 재복사 안내 |
