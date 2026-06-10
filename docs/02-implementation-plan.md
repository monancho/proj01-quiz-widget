# Implementation Plan

## 1. 추천 기술 스택

| 영역 | 기술 |
| --- | --- |
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Backend | Node.js + Express |
| Database | SQLite |
| Deployment | Cloudflare Pages, OCI Ubuntu, Docker Compose |
| Admin Auth | Cloudflare Access |
| API Test | Postman |

프론트와 백엔드를 한 저장소에서 관리하는 모노레포 구조로 시작한다. MVP에서는 복잡한 상태 관리 라이브러리 없이 React 로컬 상태와 API helper 중심으로 구현한다.

## 2. 권장 폴더 구조

```text
proj01-quiz/
+-- client/
|   +-- src/
|   |   +-- pages/
|   |   |   +-- EmbedQuizPage.jsx
|   |   |   +-- AdminQuizManagerPage.jsx
|   |   |   +-- QuizFormPage.jsx
|   |   +-- components/
|   |   |   +-- quiz/
|   |   |   +-- admin/
|   |   +-- api/
|   |   +-- lib/
|   |   +-- main.jsx
|   +-- package.json
|   +-- vite.config.js
+-- server/
|   +-- src/
|   |   +-- app.js
|   |   +-- routes/
|   |   +-- controllers/
|   |   +-- db/
|   |   +-- utils/
|   +-- Dockerfile
|   +-- package.json
|   +-- .env.example
+-- migrations/
|   +-- 0001_init_quiz_sets_and_quizzes.sql
+-- infra/
|   +-- Caddyfile
|   +-- deploy.sh
+-- docker-compose.yml
+-- docs/
```

## 3. 데이터베이스 설계

### quiz_sets

```sql
CREATE TABLE quiz_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  post_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'private'
    CHECK (status IN ('private', 'published')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### quizzes

```sql
CREATE TABLE quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_set_id INTEGER NOT NULL,
  sort_order INTEGER NOT NULL CHECK (sort_order BETWEEN 1 AND 3),
  question TEXT NOT NULL,
  choice_1 TEXT NOT NULL,
  choice_2 TEXT NOT NULL,
  choice_3 TEXT NOT NULL,
  choice_4 TEXT NOT NULL,
  correct_position INTEGER NOT NULL CHECK (correct_position BETWEEN 1 AND 4),
  explanation TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (quiz_set_id) REFERENCES quiz_sets(id) ON DELETE CASCADE,
  UNIQUE (quiz_set_id, sort_order)
);
```

## 4. API 설계

### Public

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/embed/:slug/quizzes` | iframe용 공개 문제 배열 조회 |

공개 API는 문제 배열만 반환한다. 배너 정보, 메타데이터, 설정 객체는 포함하지 않는다.

### Admin Slug Group

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/admin/quiz-sets` | 목록, 검색, 필터, 통계 조회 |
| POST | `/api/admin/quiz-sets` | Slug Group 생성 |
| GET | `/api/admin/quiz-sets/:id` | Slug Group 상세 조회 |
| PATCH | `/api/admin/quiz-sets/:id` | Slug Group 수정 |
| DELETE | `/api/admin/quiz-sets/:id` | Slug Group 삭제 |
| GET | `/api/admin/quiz-sets/check-slug` | post_slug 중복 확인 |

### Admin Quiz

| Method | Endpoint | 설명 |
| --- | --- | --- |
| GET | `/api/admin/quiz-sets/:setId/quizzes` | 그룹별 문제 목록 |
| POST | `/api/admin/quiz-sets/:setId/quizzes` | 그룹에 문제 생성 |
| GET | `/api/admin/quizzes/:id` | 문제 상세 |
| PATCH | `/api/admin/quizzes/:id` | 문제 수정 |
| DELETE | `/api/admin/quizzes/:id` | 문제 삭제 |

## 5. 프론트엔드 설계

### 공개 iframe 화면

| 컴포넌트 | 역할 |
| --- | --- |
| EmbedQuizPage | API 호출, 풀이 상태, 완료 상태 관리 |
| QuizCard | 문제 본문과 보기 렌더링 |
| ChoiceButton | 선택 상태와 정답/오답 강조 |
| FeedbackBox | 정답/오답 메시지와 실제 정답 표시 |
| ExplanationBox | 해설 표시 |
| ResultSummary | 완료 후 정답 수와 정답률 표시 |
| StaticBanner | 고정 배너 표시 |

### 관리자 화면

| 컴포넌트 | 역할 |
| --- | --- |
| AdminQuizManagerPage | 관리자 목록 메인 |
| QuizSetSearchFilter | 검색/필터 |
| QuizSetStats | 통계 카드 |
| QuizSetAccordion | Slug Group 펼침/접힘 |
| SlugGroupSettingsModal | 그룹 생성/수정 |
| QuizSetQuizTable | 그룹 내부 문제 목록 |
| QuizFormPage | 문제 생성/수정 |
| QuizLivePreview | 입력값 기반 미리보기 |
| IframeCodeCopyButton | iframe 코드 복사 |

## 6. 백엔드 설계

서버는 다음 계층으로 나눈다.

| 계층 | 역할 |
| --- | --- |
| routes | URL과 controller 연결 |
| controllers | 요청/응답 처리 |
| db | SQLite 연결, migration, query helper |
| validators | 입력값 검증 |
| utils | slug 정규화, 날짜, 에러 변환 |

초기 구현에서는 ORM 없이 SQLite driver와 명시적 SQL로 시작하는 편이 단순하다. 데이터 모델이 작고 쿼리 조건이 명확하기 때문이다.

## 7. 구현 순서

1. 저장소 기본 구조 생성
2. Express 서버와 `/health` 구현
3. SQLite 연결과 migration 작성
4. Slug Group API 구현
5. 문제 CRUD API 구현
6. 공개 iframe API 구현
7. React/Vite 프론트 구성
8. 공개 iframe 풀이 화면 구현
9. 관리자 목록 화면 구현
10. Slug Group 생성/수정 모달 구현
11. 문제 등록/수정 화면 구현
12. iframe 미리보기와 코드 복사 구현
13. Markdown/LaTeX 렌더링과 sanitizing 적용
14. 정적 배너 적용
15. Docker Compose와 reverse proxy 구성
16. Cloudflare Pages/OCI 배포 문서화
17. Postman 테스트와 QA 체크리스트 실행

## 8. 1차 MVP 기준

1차 구현은 배포 자동화까지 한 번에 욕심내기보다 로컬에서 제품 기능이 완성되는 것을 목표로 한다.

| 우선순위 | 범위 |
| --- | --- |
| P0 | DB, API, 공개 iframe 문제 풀이 |
| P0 | Slug Group 생성/수정/삭제 |
| P0 | 그룹별 문제 생성/수정/삭제 |
| P1 | 관리자 검색/필터/통계 |
| P1 | iframe 미리보기/코드 복사 |
| P1 | Markdown/LaTeX 렌더링 |
| P2 | Docker, 배포, CI/CD |

## 9. 구현 결정 사항

- 공개 API에는 정답 위치와 해설을 포함한다.
- 정답 확인용 별도 POST API는 만들지 않는다.
- 공개 여부는 문제 단위가 아니라 Slug Group 단위로 관리한다.
- 3문제 미만 그룹은 공개할 수 없다.
- 3문제 미만 공개 API 조회는 에러가 아니라 빈 배열이다.
- 문제 생성 화면에서 `post_slug`는 입력하지 않는다.
- 관리자 인증은 앱 코드가 아니라 Cloudflare Access 정책으로 처리한다.
