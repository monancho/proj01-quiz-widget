# Agent Operation Guide

## 1. 이 문서의 목적

이 문서는 루트의 `AGENTS.md`에 무엇이 적혀 있는지 사람이 이해할 수 있도록 풀어쓴 한국어 설명서입니다.

역할은 다음처럼 분리합니다.

| 문서 | 대상 | 역할 |
| --- | --- | --- |
| `AGENTS.md` | AI / Codex | 매 세션 따라야 할 고정 작업 규칙 |
| `docs/05-agent-operation-guide.md` | 사람 | `AGENTS.md` 내용을 이해하기 위한 한국어 설명 |
| `docs/00-project-status.md` | 사람 + AI | 현재 프로젝트 상태판 |
| `docs/worklog/YYYY-MM-DD.md` | 사람 + AI | 날짜별 작업 일지 |
| `docs/03-task-breakdown.md` | 사람 + AI | 전체 Phase 기준 작업 목록 |

## 2. AGENTS.md에 적어둔 핵심 내용

`AGENTS.md`에는 Codex가 새 세션을 시작할 때 먼저 읽고 따라야 하는 규칙을 적어두었습니다.

### 항상 먼저 읽을 문서

Codex는 작업 전에 아래 순서로 문서를 확인해야 합니다.

1. `docs/00-project-status.md`
2. 최신 `docs/worklog/YYYY-MM-DD.md`
3. `docs/03-task-breakdown.md`
4. 제품 동작이 애매하면 `docs/01-requirements.md`
5. 구현 구조가 애매하면 `docs/02-implementation-plan.md`

이렇게 하면 새 대화를 시작해도 이전 작업 상태를 다시 파악할 수 있습니다.

### 브랜치 전략

`AGENTS.md`에는 다음 브랜치 전략을 고정했습니다.

| 브랜치 | 역할 |
| --- | --- |
| `develop` | 통합 브랜치 |
| `feature/project-scaffold` | Phase 0 + Phase 1 |
| `feature/server-api-mvp` | Phase 2 + Phase 3 + Phase 4 |
| `feature/client-embed-mvp` | Phase 5 |
| `feature/admin-mvp` | Phase 6 |
| `feature/docker-deploy` | Phase 8 |

### 작업 방식

Codex는 한 번에 너무 큰 범위를 처리하지 않고, `docs/03-task-breakdown.md`의 Phase 순서대로 작게 진행해야 합니다.

중요한 진행이 있을 때는:

- `docs/00-project-status.md` 갱신
- 최신 worklog 갱신
- 검증 명령 실행
- 커밋 생성
- 최종 응답에 커밋 해시 요약

이 흐름을 지키도록 했습니다.

## 3. 이 프로젝트에서 Codex가 지켜야 할 구현 규칙

`AGENTS.md`에는 MVP에서 특히 흔들리면 안 되는 규칙을 적어두었습니다.

- MVP 범위는 `docs/01-requirements.md`를 기준으로 유지합니다.
- 로컬 MVP가 동작하기 전에는 외부 서비스 연동을 앞당기지 않습니다.
- `post_slug`는 Slug Group 단위에서만 관리합니다.
- 문제 생성/수정 요청에서는 `post_slug`를 받지 않습니다.
- Slug Group은 문제 3개가 있어야 `published`로 전환할 수 있습니다.
- 공개 iframe API는 문제 객체 배열만 반환합니다.
- Windows PowerShell에서 `npm`이 막히면 `npm.cmd`를 사용합니다.

## 4. 새 Codex 세션을 시작할 때 사용할 문장

새 대화에서 이어서 작업할 때는 이렇게 요청하면 됩니다.

```text
AGENTS.md를 먼저 읽고,
docs/00-project-status.md와 최신 worklog를 확인한 뒤,
현재 작업 상태를 요약하고 다음 Phase부터 이어서 진행해줘.
```

Phase 2를 시작할 때는 이렇게 요청하면 됩니다.

```text
AGENTS.md와 docs/00-project-status.md를 먼저 읽고,
docs/03-task-breakdown.md 기준으로 Phase 2 Slug Group API를 구현해줘.
작업 중 docs/worklog를 갱신하고, 검증 후 커밋까지 진행해줘.
```

## 5. 운영 원칙

`AGENTS.md`는 시스템 프롬프트처럼 자주 바뀌지 않는 지도입니다.

반대로 `docs/00-project-status.md`와 `docs/worklog/`는 작업 진행에 따라 계속 바뀌는 상태 기록입니다.

따라서 문서의 역할은 이렇게 기억하면 됩니다.

```text
AGENTS.md                 = 변하지 않는 작업 규칙
docs/00-project-status.md = 현재 위치
docs/worklog/             = 지나온 길
docs/03-task-breakdown.md = 앞으로 갈 길
```

