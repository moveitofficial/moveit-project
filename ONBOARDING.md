# 팀 온보딩 가이드

이 문서는 **moveit-project 모노레포**에 새로 합류하는 팀원이 환경을 세팅하고, 개발 컨벤션을 이해하고, 막힘 없이 작업할 수 있도록 작성된 가이드입니다.

> **읽는 순서 추천**: [1. 빠른 시작](#1-빠른-시작) → [2. 프로젝트 구조](#2-프로젝트-구조) → [3. 명령어 치트시트](#3-명령어-치트시트) → 나머지는 필요할 때 참고.

---

## 목차

1. [빠른 시작](#1-빠른-시작)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [명령어 치트시트](#3-명령어-치트시트)
4. [모노레포가 어떻게 돌아가는가 (pnpm + Turborepo)](#4-모노레포가-어떻게-돌아가는가)
5. [패키지 설치 규칙](#5-패키지-설치-규칙)
6. [코드 컨벤션 (ESLint, Prettier, TypeScript)](#6-코드-컨벤션)
7. [새 앱/패키지 추가하기](#7-새-앱패키지-추가하기)
8. [자주 만나는 함정](#8-자주-만나는-함정)
9. [전체 의존성 / 기술 스택 정리](#9-기술-스택-정리)

---

## 1. 빠른 시작

### 필수 환경

- **Node.js** `v24.14.0` (정확히 이 버전, `.nvmrc`로 고정)
- **pnpm** `v8.15.9` (Corepack으로 자동 관리됨 — 별도 글로벌 설치 불필요)

#### Node 버전 맞추기

**nvm 사용자**:

```bash
nvm install     # .nvmrc 읽어서 자동 설치
nvm use         # .nvmrc 읽어서 적용
```

**fnm 사용자**:

```bash
fnm use         # .nvmrc 자동 인식
```

**asdf 사용자**:

```bash
asdf install nodejs 24.14.0
asdf local nodejs 24.14.0
```

> ⚠️ 다른 버전이면 `pnpm install`이 **실패**합니다 (`engine-strict` 켜져 있음). 이건 의도된 거고 — 환경 통일을 위해서입니다.

### 셋업 (4줄)

```bash
git clone <repo-url>
cd moveit-project
corepack enable
pnpm install
```

### (백엔드 개발자라면 추가로)

Prisma / DB 초기 설정이 필요한 경우:

```bash
# 환경변수 세팅
cp apps/api/.env.example apps/api/.env.development

# Prisma 클라이언트 생성
pnpm --filter api run prisma:generate

# 마이그레이션 적용
pnpm --filter api run prisma:migrate
```
자세한 내용은 [7.1 백엔드 초기 환경 세팅](#71-백엔드-초기-환경-세팅-prisma) 참고

### 실행

```bash
pnpm dev          # 모든 앱 동시 실행
pnpm build        # 모든 앱 빌드
pnpm lint         # 전체 lint 검사
pnpm check-types  # 전체 타입 검사
pnpm format       # 전체 코드 포맷팅
```

> `pnpm dev` 한 번이면 web (그리고 추후 nest api까지) 한 번에 다 뜸.

---

## 2. 프로젝트 구조

```
moveit-project/
├── apps/                          # 실제 실행되는 앱들
│   └── web/                       # Next.js 16 프론트엔드
│       ├── src/
│       │   └── app/               # App Router 페이지
│       ├── eslint.config.mjs      # 공유 lint 규칙 import
│       ├── tsconfig.json          # 공유 ts 설정 extends
│       ├── next.config.ts         # vanilla-extract + react compiler
│       └── package.json
│
├── packages/                      # 앱들이 공유하는 패키지들
│   ├── ui/                        # 공유 React 컴포넌트 (@repo/ui)
│   ├── eslint-config/             # 공유 ESLint 규칙 (@repo/eslint-config)
│   │   ├── base.js                # 공통 규칙 (전 워크스페이스)
│   │   ├── next.js                # Next.js 앱 전용
│   │   └── react-internal.js      # 내부 React 라이브러리 전용
│   └── typescript-config/         # 공유 tsconfig (@repo/typescript-config)
│       ├── base.json
│       ├── nextjs.json
│       └── react-library.json
│
├── pnpm-workspace.yaml            # 워크스페이스 정의
├── turbo.json                     # Turborepo 태스크 파이프라인
├── .prettierrc                    # 프리티어 설정 (전체 적용)
├── .gitignore                     # 무시 패턴
└── package.json                   # 루트 — 전체 명령 진입점
```

### 핵심 개념

| 폴더         | 역할                                                  |
| ------------ | ----------------------------------------------------- |
| `apps/*`     | **실행되는 것** — 서버, 프론트, 모바일 등             |
| `packages/*` | **공유되는 것** — 여러 앱이 import해서 쓰는 코드/설정 |

---

## 3. 명령어 치트시트

### 루트에서 (전체 실행)

```bash
pnpm dev              # 모든 워크스페이스 dev 동시 실행
pnpm build            # 모든 워크스페이스 빌드 (의존성 순서대로)
pnpm lint             # 모든 워크스페이스 lint
pnpm check-types      # 모든 워크스페이스 tsc --noEmit
pnpm format           # 전체 코드 prettier 포맷
```

### 특정 워크스페이스만

```bash
pnpm --filter web dev               # web만 실행
pnpm --filter web build             # web만 빌드
pnpm --filter @repo/ui lint         # ui 패키지만 lint
```

### 패키지 설치/제거

```bash
# 루트에 설치 (전체 공통 도구)
pnpm add -Dw <패키지>

# 특정 워크스페이스에 설치
pnpm --filter web add <패키지>          # 일반 의존성
pnpm --filter web add -D <패키지>       # 개발 의존성

# 제거
pnpm --filter web remove <패키지>
```

> 자세한 설치 규칙은 [5. 패키지 설치 규칙](#5-패키지-설치-규칙) 참고.

---

## 4. 모노레포가 어떻게 돌아가는가

### pnpm 워크스페이스

[`pnpm-workspace.yaml`](pnpm-workspace.yaml)이 어떤 폴더가 워크스페이스인지 정의합니다.

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
ignoredBuiltDependencies:
  - sharp
  - unrs-resolver
```

**중요한 동작 방식**:

- 각 워크스페이스(`apps/web`, `packages/ui` 등)는 자기 `package.json`을 가짐
- 의존성은 **루트 `node_modules`에 모아 설치**되고, 각 워크스페이스 안엔 **심볼릭 링크**만 생김 → 디스크 절약
- 워크스페이스끼리 의존하려면 `"@repo/ui": "workspace:*"` 처럼 표시

### Turborepo

[`turbo.json`](turbo.json)이 **태스크 파이프라인**을 정의합니다.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": { "cache": false, "persistent": true },
    ...
  }
}
```

**핵심 기능**:

- **병렬 실행**: 여러 워크스페이스 작업을 동시 처리
- **의존성 순서 보장**: `^build`는 "내가 의존하는 패키지의 build를 먼저" 실행
- **캐싱**: 입력이 안 바뀌면 결과 재사용 → "FULL TURBO" 메시지가 캐시 적중 의미
- **outputs 선언**: 빌드 결과물 위치를 알려줘서 캐시할 수 있게 함

### 동작 흐름 예시

```
$ pnpm build

[루트] turbo run build
   ↓
   ├─ packages/ui     (의존하는 곳 없음, 먼저 빌드)
   │      ↓
   ├─ apps/web        (ui에 의존, ui 빌드 끝나고 시작)
   │      ↓
   │      .next/ 결과물 생성 → 캐시
   └─ 다음에 또 build 치면 변경 없으면 즉시 캐시 반환
```

---

## 5. 패키지 설치 규칙

**핵심 질문: "이 패키지를 누가 쓰냐?"**

| 사용처                 | 어디에 설치? | 명령어                           |
| ---------------------- | ------------ | -------------------------------- |
| 모든 워크스페이스가 씀 | **루트**     | `pnpm add -Dw <pkg>`             |
| 특정 앱만 씀           | **그 앱에**  | `pnpm --filter <name> add <pkg>` |

### 루트에 설치할 것 (`-w`)

- `prettier`, `turbo`, `typescript`, `husky` 같은 **전사 도구**
- 이미 셋업되어 있음 — 새로 추가할 일은 드뭄

### 워크스페이스에 설치할 것 (`--filter`)

- `next`, `react`, `@tanstack/react-query` 같은 **앱이 직접 쓰는 라이브러리**
- 90% 케이스가 여기 해당

### ❌ 절대 하지 말 것

```bash
# 워크스페이스 폴더 안에서 직접 pnpm install — 자체 node_modules가 생겨서 모노레포가 깨짐
cd apps/web
pnpm install something  # ❌
```

올바른 방법:

```bash
# 루트에서 --filter로
pnpm --filter web add something  # ✅
```

---

## 6. 코드 컨벤션

### ESLint — 빡센 규칙 적용 중

`@repo/eslint-config` 패키지에서 통합 관리합니다.

#### 적용된 규칙 핵심

**TypeScript 빡세게**

- `strict-type-checked` + `stylistic-type-checked` (타입 정보 활용한 강력 체크)
- `any` 사용 금지
- 안 쓴 변수 금지 (단, `_` 시작은 허용)
- `import type` 강제 (타입 import는 명시적으로)
- non-null 단언 `!` 금지
- floating promise 금지 (`await` 빠진 promise 잡아냄)

**Import 위생**

- import 순서 강제 (builtin → external → internal → ...)
- 중복 import 금지
- 순환 참조 금지

**일반 코드 품질**

- `console.log` 금지 (`warn`/`error`만 허용)
- `==` 금지 (`===` 강제)
- `var` 금지, `const` 우선
- `eslint-plugin-unicorn` 모던 베스트프랙티스

#### 자주 보는 에러와 대처

| 에러                      | 의미             | 해결                             |
| ------------------------- | ---------------- | -------------------------------- |
| `no-unused-vars`          | 안 쓴 변수       | 지우거나 `_변수명`으로           |
| `no-explicit-any`         | `any` 사용       | 정확한 타입 명시 또는 `unknown`  |
| `no-non-null-assertion`   | `!` 사용         | `?.` 옵셔널체이닝 또는 가드문    |
| `consistent-type-imports` | 타입 import 누락 | `import type { X } from '...'`   |
| `no-floating-promises`    | await 빠짐       | `await` 추가 또는 `void promise` |
| `eqeqeq`                  | `==` 사용        | `===` 로 변경                    |
| `no-console`              | `console.log`    | 지우거나 `console.warn`/`error`  |

#### 자동 수정

```bash
# 워크스페이스 단위
pnpm --filter web exec eslint . --fix

# 그냥 전체
pnpm lint  # 검사만
```

VSCode 사용자는 `settings.json`에 추가하면 저장 시 자동 수정:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

#### 규칙 추가/수정하고 싶을 때 논의 후 세팅한사람이 수정 그외 수정 불가

- **모든 워크스페이스에 적용** → [packages/eslint-config/base.js](packages/eslint-config/base.js)
- **Next.js 앱만** → [packages/eslint-config/next.js](packages/eslint-config/next.js)
- **공유 React 패키지만** → [packages/eslint-config/react-internal.js](packages/eslint-config/react-internal.js)

> **주의**: `base.js`가 strict-type-checked 기반이라, 다른 파일에서 `tseslint.configs.recommended`를 추가하면 약화시킬 수 있음. 새 규칙은 base의 형식을 참고할 것.

---

### Prettier

[`.prettierrc`](.prettierrc) 한 곳에서 관리:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80
}
```

- 세미콜론 ON
- 작은따옴표
- 들여쓰기 2칸
- 한 줄 80자
- 후행 쉼표 (다중 라인 객체/배열에서)

저장 시 자동 적용 추천 (VSCode `editor.formatOnSave: true`).

---

### TypeScript

`@repo/typescript-config`에서 공유 설정 관리.

| 프리셋               | 용도                                                        |
| -------------------- | ----------------------------------------------------------- |
| `base.json`          | 모든 TS 코드의 베이스 (strict, noUncheckedIndexedAccess 등) |
| `nextjs.json`        | Next.js 앱용 (jsx preserve, allowJs 등)                     |
| `react-library.json` | 라이브러리용 (declaration 등)                               |

각 워크스페이스는 자기 `tsconfig.json`에서 `extends`로 가져옴:

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": { ... }
}
```

---

## 7. 새 앱/패키지 추가하기

### 새 앱 추가 (예: NestJS api)

```bash
# 1. apps 안에 nest 깔기
cd apps
npx @nestjs/cli new api --package-manager pnpm --skip-install --skip-git

# 2. 루트에서 install
cd ..
pnpm install

# 3. ⚠️ Nest CLI가 만든 중복 파일 정리 (필수)
rm apps/api/.gitignore
rm apps/api/pnpm-lock.yaml 2>/dev/null
rm apps/api/pnpm-workspace.yaml 2>/dev/null
# .prettierrc도 있으면 지우기 (루트에 이미 있음)

# 4. 공유 설정 연결 (apps/api/package.json devDependencies에 추가)
#    "@repo/eslint-config": "workspace:*"
#    "@repo/typescript-config": "workspace:*"

# 5. apps/api/eslint.config.mjs를 공유 config 쓰도록 바꾸기

# 6. 다시 install
pnpm install
```

### 새 공유 패키지 추가 (예: 공유 타입 정의)

```bash
mkdir -p packages/types
cd packages/types
```

`package.json`:

```json
{
  "name": "@repo/types",
  "version": "0.0.0",
  "private": true,
  "exports": { "./*": "./src/*.ts" },
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "check-types": "tsc --noEmit"
  }
}
```

다른 앱에서 사용:

```bash
pnpm --filter web add @repo/types
```

```ts
import type { User } from '@repo/types/user';
```

---

## 7.1 백엔드(API) 초기 환경 세팅 (Prisma)

### 1. 환경변수 설정

```bash
# apps/api/.env.example 복사
cp apps/api/.env.example apps/api/.env.development

# DATABASE_URL 본인 로컬 DB로 설정
```

---
### 2. Prisma 클라이언트 생성
```bash
pnpm --filter api run prisma:generate
```

---
### 3. 마이그레이션 적용
```bash
pnpm --filter api run prisma:migrate
> ⚠️ migrate는 처음 세팅/스키마 변경 시에만 실행
```
---

## 8. 자주 만나는 함정

### 🚫 워크스페이스 안에서 직접 `pnpm install`

```bash
cd apps/web && pnpm install some-pkg  # ❌ 자체 node_modules 생김
```

→ 루트에서 `pnpm --filter web add some-pkg` 사용.

### 🚫 워크스페이스 안에 `pnpm-workspace.yaml` 만들기

- pnpm이 어느 게 진짜 workspace root인지 헷갈림
- 워크스페이스 root는 **루트 1개**만

### 🚫 워크스페이스 안에 `pnpm-lock.yaml`

- lockfile은 **루트 1개**만 존재해야 함

### 🚫 새 앱이 자기 `.gitignore`, `tsconfig`, `eslint` 자체 사용

- create-next-app, nest new 같은 CLI는 자체 설정을 만들어줌
- → 깔고 나서 **공유 설정 쓰도록 정리** 필수

### ⚠️ TS 에러는 안 나는데 IDE에 빨간 줄

- VSCode TS 캐시 문제일 수 있음
- `Cmd+Shift+P` → `TypeScript: Restart TS Server`

### ⚠️ Turbopack 쓰면 vanilla-extract 깨짐

- Next dev 스크립트에 `--webpack` 플래그 필수 (현재 적용됨)
- vanilla-extract가 Turbopack 미지원이라 그럼

### ⚠️ Turbo "global turbo 사용 중" 경고

- `pnpm dev` 같은 pnpm 경유 명령은 로컬 turbo 사용 — 무시 가능

---

## 9. 기술 스택 정리

### 도구 / 인프라

- **pnpm** 9.x — 패키지 매니저 (효율적인 monorepo 지원)
- **Turborepo** 2.9 — 태스크 러너 + 캐싱
- **TypeScript** 5.9 — 정적 타입
- **ESLint** 9 (flat config) — 린팅
- **Prettier** 3.7 — 포맷팅

### apps/web (Next.js 프론트엔드)

- **Next.js** 16 (App Router) — `--webpack` 모드
- **React** 19
- **React Compiler** 활성화
- **Vanilla Extract** — 타입 안전한 CSS-in-JS
- **TanStack React Query** v5 — 서버 상태 관리
- **clsx** — 조건부 className 유틸

### packages/ui

- 공유 React 컴포넌트 (button, card, code 등)

### packages/eslint-config

- **typescript-eslint** 8.56 (strict-type-checked + stylistic)
- **eslint-plugin-import-x** — import 순서/순환참조
- **eslint-plugin-unicorn** — 모던 베스트프랙티스
- **eslint-plugin-react** + **react-hooks**
- **@next/eslint-plugin-next** — Next 전용 규칙
- **eslint-config-prettier** — prettier 충돌 방지

---

## 부록: 주요 파일 한눈에

| 파일                                                                         | 역할                                   |
| ---------------------------------------------------------------------------- | -------------------------------------- |
| [package.json](package.json)                                                 | 루트 — 전체 명령 진입점, 공통 devDeps  |
| [pnpm-workspace.yaml](pnpm-workspace.yaml)                                   | 워크스페이스 정의                      |
| [turbo.json](turbo.json)                                                     | 태스크 파이프라인, 캐시 outputs        |
| [.prettierrc](.prettierrc)                                                   | 포맷터 설정 (전체 적용)                |
| [.gitignore](.gitignore)                                                     | git 무시 패턴                          |
| [.npmrc](.npmrc)                                                             | pnpm 설정 (현재 비어있음, 기본값 사용) |
| [packages/eslint-config/base.js](packages/eslint-config/base.js)             | **빡센 lint 규칙 핵심**                |
| [packages/eslint-config/next.js](packages/eslint-config/next.js)             | Next 앱용 추가 규칙                    |
| [packages/typescript-config/base.json](packages/typescript-config/base.json) | TS 베이스 설정                         |
| [apps/web/next.config.ts](apps/web/next.config.ts)                           | vanilla-extract, react compiler        |
| [apps/web/src/app/providers.tsx](apps/web/src/app/providers.tsx)             | TanStack Query Provider                |

---

## 도움 요청하기

이 문서로 안 풀리는 게 있으면:

1. 같은 팀원에게 먼저 묻기
2. 공식 문서:
   - [Turborepo](https://turborepo.dev/docs)
   - [pnpm Workspaces](https://pnpm.io/workspaces)
   - [Next.js](https://nextjs.org/docs)
   - [TanStack Query](https://tanstack.com/query/latest)
   - [Vanilla Extract](https://vanilla-extract.style/)
3. 이 문서를 업데이트할 가치가 있으면 PR 보내기

---

> 마지막 업데이트: 2026-05-11
