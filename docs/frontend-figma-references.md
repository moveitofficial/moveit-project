# Frontend Figma References

> **다루는 범위**: apps/web · apps/admin 디자인의 Figma 노드 매핑.
> **목적**: 새 화면 구현 시 어떤 Figma 노드를 봐야 할지 빠르게 찾기 위한 카탈로그.
> **Figma 파일**: https://www.figma.com/design/3uzog2W35ZwbSb9zlhQx84/moveIt
> **최종 수정**: 2026-05-19

---

## 사용 방법

1. 구현 작업 시작 시 이 표에서 **nodeId** 확인
2. Figma MCP (`get_design_context` 등) 호출은 **가능하면 1회만** — 결과는 해당 feature 폴더의 `_design-notes.md` 등에 남겨 팀원 재호출 줄이기
3. 새 화면 받으면 표에 한 줄 추가 + **연관 mock/코드** 칸 같이 채우기
4. 구현 완료된 항목은 **상태** 칼럼을 `구현 완료`로 갱신

> ⚠️ **Figma MCP 호출은 토큰 비용이 크다**. Max 사용자가 1차 fetch + 구현까지 끝내고 머지하면, 이후 수정 작업하는 Pro 사용자(Cursor/Claude Pro) 팀원은 코드만 보면 되므로 전체 토큰 부담이 줄어든다.

---

## apps/web

### 메인 페이지

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| MOVIT 인기 게시글 | `50:5278` | 미구현 (mock 준비됨) | [mockCommunityPosts](../apps/web/src/mocks/community.ts) post-001~003 |

### 커뮤니티

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 자유게시판 화면 | `205:75686` | 미구현 | [community.ts](../apps/web/src/mocks/community.ts) `FREE` 카테고리 (post-004) — 메인 인기 게시글(`50:5278`) "전체보기" 링크 도착지일 가능성 |

### 카테고리 페이지

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 카테고리 페이지(들) | `129:14600` | 미구현 | 복수 카테고리 변형 포함 — 구현 시 분기 확인 |

### 서비스 상세 페이지

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 서비스 상세 | `131:14973` | 미구현 | [apps/web/src/mocks/services.ts](../apps/web/src/mocks/services.ts) |

### 전문가(판매자) 상세 페이지

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 전문가 상세 | `140:20083` | 미구현 | [apps/web/src/mocks/experts.ts](../apps/web/src/mocks/experts.ts) (+ [portfolios.ts](../apps/web/src/mocks/portfolios.ts), [reviews.ts](../apps/web/src/mocks/reviews.ts) 가능) |

### 메세지 / 채팅

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 메세지 화면 | `151:27882` | 미구현 | [apps/web/src/mocks/chat.ts](../apps/web/src/mocks/chat.ts) |

### 마이페이지

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 의뢰인(CLIENT) 마이페이지 | `154:33207` | 미구현 | [apps/web/src/mocks/user.ts](../apps/web/src/mocks/user.ts) + 주문/관심 등 (`orders.ts`, `favorites.ts`) — `GET /users/me` 연동 대상 |
| 판매자(EXPERT) 마이페이지 | `155:48177` | 미구현 | [apps/web/src/mocks/user.ts](../apps/web/src/mocks/user.ts) + [experts.ts](../apps/web/src/mocks/experts.ts), [portfolios.ts](../apps/web/src/mocks/portfolios.ts), 주문/정산 등 — `GET /users/me` 연동 대상 |

### 찜 / 관심목록

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 찜페이지 | `205:75688` | 미구현 | [apps/web/src/mocks/favorites.ts](../apps/web/src/mocks/favorites.ts) |

### 고객지원 (FAQ 등)

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| FAQ 화면 | `205:75687` | 미구현 | mock 미정 (정적 콘텐츠) |

### 상태/에러 화면

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 블랙리스트(차단) 상태 화면 | `205:75711` | 미구현 | [errors.ts](../apps/api/src/common/constants/errors.ts) `COMMON_ERRORS.BLOCKED` — 로그인 시 차단된 계정에 노출 |

### 인증 (auth 라우트 그룹)

> [apps/api/src/auth/auth.controller.ts](../apps/api/src/auth/auth.controller.ts)의 signin/signup 엔드포인트와 실제 연동되는 페이지들.

| 섹션 | nodeId | 상태 | 연관 mock/코드 |
|---|---|---|---|
| 로그인 | `64:6675` | 미구현 | `POST /auth/signin` |
| 판매자(전문가) SNS 회원가입 | `105:3937` | 미구현 | `POST /auth/oauth/signup` (role = `EXPERT`) — OAuth 콜백 후 role 확정 단계 |
| 의뢰인(일반유저) SNS 회원가입 | `112:4089` | 미구현 | `POST /auth/oauth/signup` (role = `CLIENT`) — OAuth 콜백 후 role 확정 단계 |
| 이메일(LOCAL) 회원가입 페이지들 | `112:4689` | 미구현 | `POST /auth/signup` — CLIENT/EXPERT 변형 포함 가능 |

## apps/admin

_(추후 추가)_

---

## URL 빠르게 만들기

Figma URL 포맷:
```
https://www.figma.com/design/3uzog2W35ZwbSb9zlhQx84/moveIt?node-id={nodeId-with-dash}&m=dev
```

위 표의 nodeId(`50:5278`)에서 `:`를 `-`로 바꿔 붙이면 됨 (`node-id=50-5278`).
