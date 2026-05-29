# Task Breakdown

## Phase 0. 프로젝트 기준선

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T0-01 | 저장소 구조 생성 | `client`, `server`, `migrations`, `infra` | P0 |
| T0-02 | 공통 README 초안 작성 | 실행 방법, 환경변수 개요 | P1 |
| T0-03 | `.gitignore` 구성 | Node, env, SQLite 파일 제외 | P0 |

## Phase 1. 백엔드 기초

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T1-01 | Express 서버 생성 | `server/src/app.js` | P0 |
| T1-02 | `/health` 구현 | `GET /health` | P0 |
| T1-03 | 환경변수 로딩 | `.env.example` | P0 |
| T1-04 | SQLite 연결 | DB connection helper | P0 |
| T1-05 | migration 작성 | `0001_init_quiz_sets_and_quizzes.sql` | P0 |
| T1-06 | migration 실행 스크립트 | `npm run db:migrate` | P0 |

## Phase 2. Slug Group API

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T2-01 | post_slug 정규화/검증 유틸 | `normalizePostSlug`, `validatePostSlug` | P0 |
| T2-02 | Slug Group 목록 API | `GET /api/admin/quiz-sets` | P0 |
| T2-03 | 통계 계산 | total/published/private/completed | P0 |
| T2-04 | Slug Group 생성 API | `POST /api/admin/quiz-sets` | P0 |
| T2-05 | Slug Group 상세 API | `GET /api/admin/quiz-sets/:id` | P1 |
| T2-06 | Slug Group 수정 API | `PATCH /api/admin/quiz-sets/:id` | P0 |
| T2-07 | Slug Group 삭제 API | `DELETE /api/admin/quiz-sets/:id` | P0 |
| T2-08 | post_slug 중복 확인 API | `GET /api/admin/quiz-sets/check-slug` | P0 |
| T2-09 | published 전환 방어 | 문제 3개 미만이면 400 | P0 |

## Phase 3. Quiz API

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T3-01 | 그룹별 문제 목록 API | `GET /api/admin/quiz-sets/:setId/quizzes` | P0 |
| T3-02 | 문제 생성 API | `POST /api/admin/quiz-sets/:setId/quizzes` | P0 |
| T3-03 | 문제 상세 API | `GET /api/admin/quizzes/:id` | P1 |
| T3-04 | 문제 수정 API | `PATCH /api/admin/quizzes/:id` | P0 |
| T3-05 | 문제 삭제 API | `DELETE /api/admin/quizzes/:id` | P0 |
| T3-06 | 세트당 최대 3개 방어 | 3개 초과 생성 시 400 | P0 |
| T3-07 | sort_order 중복 방어 | 같은 그룹 내 중복 시 400 | P0 |

## Phase 4. Public Embed API

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T4-01 | 공개 문제 조회 API | `GET /api/embed/:slug/quizzes` | P0 |
| T4-02 | 비공개/미완성 빈 배열 처리 | `[]` 반환 | P0 |
| T4-03 | 공개 응답 shape 변환 | `choices`, `answerPosition`, `correctAnswer` | P0 |
| T4-04 | CORS 설정 | 허용 origin 환경변수 | P1 |

## Phase 5. 공개 iframe 프론트

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T5-01 | React/Vite/Tailwind 구성 | `client` 앱 | P0 |
| T5-02 | 라우팅 구성 | `/embed/:postSlug` | P0 |
| T5-03 | API client 작성 | 공개/관리자 API helper | P0 |
| T5-04 | EmbedQuizPage 구현 | 로딩/빈/오류/풀이 상태 | P0 |
| T5-05 | QuizCard 구현 | 문제와 보기 표시 | P0 |
| T5-06 | 선택 즉시 채점 | 정답/오답 상태 표시 | P0 |
| T5-07 | 다음 문제/완료 흐름 | 1~3번 진행 | P0 |
| T5-08 | ResultSummary 구현 | 정답 수, 정답률, 다시 풀기 | P0 |
| T5-09 | StaticBanner 구현 | 환경변수 기반 배너 | P1 |
| T5-10 | iframe 고정 높이 대응 | 720px 기준 내부 레이아웃 | P1 |

## Phase 6. 관리자 프론트

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T6-01 | 관리자 라우팅 구성 | `/admin` | P0 |
| T6-02 | 관리자 목록 화면 | Slug Group 카드 목록 | P0 |
| T6-03 | 검색/필터 UI | post_slug 검색, status 필터 | P0 |
| T6-04 | 통계 카드 | 전체/공개/비공개/완료 | P1 |
| T6-05 | Slug Group 생성 모달 | post_slug/post_title/status | P0 |
| T6-06 | Slug Group 수정 모달 | 경고, 중복 확인, 저장 | P0 |
| T6-07 | Slug Group 삭제 | 확인 후 삭제 | P1 |
| T6-08 | 문제 테이블 | 순서, 미리보기, 수정/삭제 | P0 |
| T6-09 | 문제 등록 화면 | 읽기 전용 post_slug, 보기 4개, 정답 라디오 | P0 |
| T6-10 | 문제 수정 화면 | 기존 값 로딩과 저장 | P0 |
| T6-11 | 입력값 기반 미리보기 | 사용자 노출 화면 유사 미리보기 | P1 |
| T6-12 | iframe 미리보기 | `/embed/:postSlug` 열기 | P1 |
| T6-13 | iframe 코드 복사 | 클립보드 복사와 fallback | P1 |

## Phase 7. 렌더링/보안

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T7-01 | Markdown 렌더링 | 문제/보기/해설 | P1 |
| T7-02 | LaTeX 렌더링 | inline/block 수식 | P1 |
| T7-03 | sanitizing 적용 | raw HTML/script 차단 | P0 |
| T7-04 | 관리자/iframe 렌더러 공유 | 동일 정책 적용 | P1 |

## Phase 8. 배포/운영

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T8-01 | 서버 Dockerfile | Express API 이미지 | P2 |
| T8-02 | docker-compose 작성 | api, proxy | P2 |
| T8-03 | reverse proxy 구성 | Caddy 또는 Nginx | P2 |
| T8-04 | Cloudflare Pages 설정 문서화 | client build/deploy | P2 |
| T8-05 | OCI 배포 체크리스트 | SSH, swap, port, health check | P2 |
| T8-06 | GitHub Actions 초안 | backend deploy | P2 |

## Phase 9. 테스트

| ID | 작업 | 산출물 | 우선순위 |
| --- | --- | --- | --- |
| T9-01 | API 단위 테스트 또는 smoke script | 주요 CRUD 검증 | P1 |
| T9-02 | Postman 컬렉션 구조 작성 | Public/Admin/Validation | P1 |
| T9-03 | 프론트 수동 QA | iframe, 관리자 화면 | P1 |
| T9-04 | 배포 후 smoke test | `/health`, 공개 API, iframe | P2 |

## 권장 첫 구현 묶음

첫 구현은 다음 순서로 진행한다.

1. Phase 0
2. Phase 1
3. Phase 2의 P0
4. Phase 3의 P0
5. Phase 4
6. Phase 5의 P0

이 묶음이 끝나면 로컬에서 공개 iframe 퀴즈와 기본 관리자 CRUD가 동작한다.
