# iframe Integration Guide

## 1. 기본 삽입 코드

관리자 목록의 iframe 코드 복사 버튼은 Slug Group의 `post_slug`를 사용해 아래 형식의 코드를 생성한다.

```html
<iframe
  src="https://proj01.monancho.com/embed/{postSlug}?theme=system"
  width="100%"
  height="720"
  title="관련 퀴즈"
  loading="lazy"
  style="border:0; width:100%; max-width:100%; background:transparent;"
></iframe>
```

예시:

```html
<iframe
  src="https://proj01.monancho.com/embed/intro-to-marketing?theme=system"
  width="100%"
  height="720"
  title="관련 퀴즈"
  loading="lazy"
  style="border:0; width:100%; max-width:100%; background:transparent;"
></iframe>
```

## 2. Tistory 삽입 절차

1. 관리자 화면에서 Slug Group을 생성한다.
2. 해당 Slug Group에 문제 3개를 등록한다.
3. Slug Group 상태를 `published`로 변경한다.
4. 관리자 목록에서 iframe 미리보기로 표시 상태를 확인한다.
5. 관리자 목록에서 iframe 코드 복사를 누른다.
6. Tistory 글 편집 화면에서 HTML 모드 또는 본문 삽입 가능한 위치에 코드를 붙여 넣는다.
7. 글 저장 후 PC/모바일 화면에서 iframe 높이와 스크롤 상태를 확인한다.

## 3. 공개 조건

iframe이 정상 문제를 표시하려면 다음 조건을 모두 만족해야 한다.

| 조건 | 기준 |
| --- | --- |
| Slug Group 존재 | `post_slug`와 URL의 slug가 일치해야 한다. |
| 공개 상태 | Slug Group `status`가 `published`여야 한다. |
| 문제 수 | 해당 Slug Group에 문제가 정확히 3개 있어야 한다. |
| API 접근 | `GET /api/embed/:slug/quizzes`가 공개 접근 가능해야 한다. |

조건을 만족하지 못하면 공개 API는 `200 OK`와 빈 배열을 반환하고, iframe은 빈 상태 메시지를 표시한다.

## 4. iframe 표시 정책

| 항목 | 기준 |
| --- | --- |
| width | `100%` |
| height | `720` |
| background | `transparent` |
| loading | `lazy` |
| border | `0` |
| 문제 수 | 3개 기준 |
| 높이 조절 | MVP에서는 고정 높이 |

MVP에서는 `postMessage` 기반 자동 높이 조절을 구현하지 않는다. 긴 해설이나 수식 때문에 내용이 길어질 경우 iframe 내부 스크롤 또는 레이아웃 압축으로 처리한다.

## 5. theme 파라미터

`theme` 파라미터는 다음 값을 고려한다.

| 값 | 의미 |
| --- | --- |
| `system` | 사용자 시스템 설정 기준 |
| `light` | 라이트 테마 |
| `dark` | 다크 테마 |

1차 MVP에서는 `system`을 기본값으로 두고, 실제 테마 처리는 프론트 구현 범위에 따라 단계적으로 적용한다.

## 6. post_slug 변경 주의사항

`post_slug`는 iframe URL의 핵심 식별자이다.

예를 들어 기존 코드가 다음과 같다면:

```html
<iframe src="https://proj01.monancho.com/embed/intro-to-marketing?theme=system"></iframe>
```

Slug Group 설정에서 `post_slug`를 `marketing-basic`으로 바꾸는 순간 기존 Tistory 글의 iframe은 더 이상 해당 문제를 찾지 못한다.

따라서 `post_slug`를 변경한 뒤에는 관리자 목록에서 iframe 코드를 다시 복사하고, 기존 Tistory 글에 삽입된 코드를 새 코드로 교체해야 한다.

## 7. 보안 정책

| 목적 | 정책 |
| --- | --- |
| 공개 iframe 접근 | `/embed/:slug`는 공개 |
| 공개 API 접근 | `/api/embed/:slug/quizzes`는 공개 |
| 관리자 화면 보호 | `/admin`은 Cloudflare Access로 보호 |
| 관리자 API 보호 | `/api/admin/*`는 Cloudflare Access로 보호 |
| API 요청 출처 제어 | CORS 설정 |
| iframe 삽입 허용 제어 | CSP `frame-ancestors` 검토 |
| Markdown 보안 | raw HTML과 script 차단 |

CORS는 API 요청 출처를 제어하고, iframe 삽입 허용 여부는 CSP `frame-ancestors`로 제어한다. 두 정책은 목적이 다르므로 별도로 검증해야 한다.

## 8. 관리자 미리보기 기준

관리자 목록의 iframe 미리보기는 실제 `/embed/:postSlug` 화면을 기준으로 확인한다.

문제 등록/수정 화면의 하단 미리보기는 입력 중인 값을 바탕으로 실제 사용자 노출 화면에 가깝게 보여준다. 단, 저장 전 데이터이므로 공개 API 결과와 완전히 동일한 데이터 소스는 아니다.

## 9. QA 체크리스트

| ID | 확인 항목 | 기대 결과 |
| --- | --- | --- |
| IF-001 | 공개 Slug Group iframe 로딩 | 문제 1번이 표시된다. |
| IF-002 | 비공개 Slug Group iframe 로딩 | 빈 상태 메시지가 표시된다. |
| IF-003 | 문제 2개인 Slug Group 로딩 | 빈 상태 메시지가 표시된다. |
| IF-004 | 정답 선택 | 정답 피드백과 해설이 표시된다. |
| IF-005 | 오답 선택 | 오답 피드백, 실제 정답, 해설이 표시된다. |
| IF-006 | 3문제 완료 | 결과 요약이 표시된다. |
| IF-007 | 다시 풀기 | 1번 문제 상태로 초기화된다. |
| IF-008 | 더 많은 글 보기 | 지정된 Tistory URL로 이동한다. |
| IF-009 | 모바일 Tistory 본문 | iframe이 본문 폭을 넘지 않는다. |
| IF-010 | 배너 이미지 실패 | 화면이 깨지지 않고 fallback 처리된다. |
