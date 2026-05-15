# docs/

moveit-project 작업에 필요한 가이드 모음. **AI(Claude / Cursor)와 팀원이 함께 보는 자료실.**

루트의 다른 문서들과의 역할 분리:

| 문서 | 역할 |
|---|---|
| [../CLAUDE.md](../CLAUDE.md) | LLM 행동 지침 + 핵심 컨벤션 (매 대화 자동 로드, 짧게) |
| [../ONBOARDING.md](../ONBOARDING.md) | 환경 세팅·명령어·신규 합류자용 (사람 중심) |
| **docs/** (이 폴더) | 깊이 있는 주제별 가이드 (필요할 때 참조) |

---

## 작업별 어디부터 봐야 할지

### 백엔드 (`apps/api`)

| 작업 | 문서 |
|---|---|
| 새 컨트롤러·엔드포인트 만들기 | [backend-conventions.md](backend-conventions.md) |
| 에러 던지기·응답 형식·Swagger 데코레이터 | [backend-conventions.md](backend-conventions.md) |
| 로그인·회원가입·JWT·쿠키 흐름 이해/수정 | [backend-auth-flow.md](backend-auth-flow.md) + [backend-conventions.md](backend-conventions.md) |
| 보호 라우트 만들기 (`@JwtAuth` 사용) | [backend-conventions.md](backend-conventions.md) §2 + [backend-auth-flow.md](backend-auth-flow.md) §5 |
| 새 Prisma 모델·관계 추가 | [backend-prisma-overview.md](backend-prisma-overview.md) |
| 모델 관계·enum 의미 이해 | [backend-prisma-overview.md](backend-prisma-overview.md) |
| 리스트 응답 (`toListResponse`) | [backend-conventions.md](backend-conventions.md) §4 |
| 새 에러 상수 추가 | [backend-conventions.md](backend-conventions.md) §3 |

### 프론트엔드 (`apps/web`, `apps/admin`)

| 작업 | 문서 |
|---|---|
| 새 페이지 만들기 (`page.tsx` + features) | [frontend-structure.md](frontend-structure.md) |
| 새 도메인(`features/<도메인>/`) 추가 | [frontend-structure.md](frontend-structure.md) §3 |
| 컴포넌트 어디에 둘지 (도메인 vs 공통) | [frontend-structure.md](frontend-structure.md) §4 (의존성 방향) |
| admin에 새 메뉴/라우트 추가 (Sidebar/PageHeader 갱신) | [frontend-structure.md](frontend-structure.md) §10 |
| 색·폰트 사용·추가 | [frontend-design-tokens.md](frontend-design-tokens.md) |
| vanilla-extract `.css.ts` 작성 | [frontend-design-tokens.md](frontend-design-tokens.md) + [frontend-structure.md](frontend-structure.md) §7 |
| 타입 어디에 정의할지 | [frontend-structure.md](frontend-structure.md) §5 |

### 인프라·설정

| 작업 | 문서 |
|---|---|
| 새 워크스페이스 추가 (앱·패키지) | [infrastructure-typescript.md](infrastructure-typescript.md) §6 |
| tsconfig 수정·새 옵션 추가 | [infrastructure-typescript.md](infrastructure-typescript.md) |
| TS 옵션이 어디서 오는지 확인 | [infrastructure-typescript.md](infrastructure-typescript.md) §2, §4 |

---

## 문서 목록

### Backend
- **[backend-conventions.md](backend-conventions.md)** — API 컨벤션 통합. 응답 형식 자동 래핑, `@JwtAuth`, `AppException` + `errors.ts`, `toListResponse`, Swagger 그룹화 규칙, DTO `declare` 패턴, `common/` 폴더 구조.
- **[backend-auth-flow.md](backend-auth-flow.md)** — 현재 코드 기준 인증 흐름. sign-up/sign-in 시퀀스, JWT payload, 쿠키 설정, `JwtAccessStrategy` 내부, 미구현 항목(refresh 엔드포인트 등) 명시.
- **[backend-prisma-overview.md](backend-prisma-overview.md)** — 35개 모델·22개 enum을 도메인별로 그룹화. 인증·서비스·거래(Order/Payment/Refund)·채팅·통계 등. 마이그레이션 히스토리.

### Frontend
- **[frontend-structure.md](frontend-structure.md)** — `features/<도메인>/` 패턴. 3가지 원칙, 의존성 방향 금지 규칙, 타입 위치, `page.tsx` 표준 패턴. web 특화(라우트 그룹·`features/main` 예외) / admin 특화(Sidebar/PageHeader 동기화).
- **[frontend-design-tokens.md](frontend-design-tokens.md)** — `vars.color.*` 30개 컬러 팔레트, `typography.fXXY` 27개 타이포 variant 표. NanumSquare 폰트 설정. 새 토큰 추가 절차.

### Infrastructure
- **[infrastructure-typescript.md](infrastructure-typescript.md)** — `@repo/typescript-config` 프리셋 구조 (base/nextjs/node/react-library/react-internal). `${configDir}` 활용. 새 워크스페이스 추가 보일러플레이트.

---

## 문서 수정 가이드

- 코드와 문서가 어긋나면 **코드가 진실**. 문서를 갱신한다.
- 각 문서 상단의 `최종 수정` 날짜를 함께 갱신.
- 새 컨벤션 결정·구조 변경 시 해당 doc만 고치면 충분 — README 라우팅 표는 작업 → 문서 매핑이라 도메인이 바뀌지 않는 한 거의 안 건드림.
- 문서 추가 시 이 README의 "작업별 라우팅"·"문서 목록" 두 곳에 추가.

---

## AI가 이 폴더를 활용하는 방식

- **자동 로드(매 대화)**: [../CLAUDE.md](../CLAUDE.md), [../.cursor/rules/project.mdc](../.cursor/rules/project.mdc)에 핵심 규칙. → 매번 토큰 차지함, 짧게 유지.
- **온디맨드(필요할 때)**: 이 폴더의 문서. AI가 작업 종류에 따라 위 라우팅 표를 보고 1~2개 파일만 읽음. → 토큰은 작업당 1회만 차지.

이 구조 덕분에 **항상 들고 다니는 컨텍스트는 가볍게**, **필요할 때만 깊이 있는 정보를 가져온다**.
