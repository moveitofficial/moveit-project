# TypeScript Config Presets

> **다루는 범위**: `@repo/typescript-config` 공용 프리셋 구조 · 옵션 상속 · 새 워크스페이스 추가 방법
> **관련 코드**: [packages/typescript-config/](../packages/typescript-config/)
> **최종 수정**: 2026-05-15

---

## 1. 배경

기존엔 각 앱/패키지가 `incremental`, `include`, `exclude`, `strictNullChecks` 같은 옵션을 자기 tsconfig에서 직접 정의해 같은 옵션이 7~9곳에 중복됐다. TS 버전 업그레이드나 옵션 변경 시 모든 파일을 수정해야 했고, 누가 한 앱만 다르게 설정해도 발견하기 어려웠다.

**개선 원칙**: 공통 옵션을 루트 공용 프리셋(`@repo/typescript-config`)에 모으고, 각 앱은 **"프리셋과 다른 점"만** 적는다.

**핵심 기술**: TypeScript 5.5+의 `${configDir}` 템플릿 변수. 프리셋 안에서 쓰면 **그 프리셋을 사용하는 자식 tsconfig의 디렉토리**로 치환된다. 덕분에 `include`까지 프리셋으로 끌어올릴 수 있게 됐다.

---

## 2. 프리셋 구조

```
base.json            ← 진짜 공통 (strict, target, module 등)
├─ nextjs.json       ← Next.js 앱용 (web, admin)
├─ node.json         ← NestJS 앱용 (api)
└─ react-library.json
    └─ react-internal.json  ← 빌드 안 하는 내부 React 패키지용
```

| 프리셋 | 용도 | 사용처 |
|---|---|---|
| `base.json` | 직접 사용 금지, 다른 프리셋이 extends | (내부용) |
| `nextjs.json` | Next.js 앱 | `apps/web`, `apps/admin` |
| `node.json` | NestJS 앱 | `apps/api` |
| `react-library.json` | 실제로 빌드되는 라이브러리 (declaration 생성) | `packages/ui` |
| `react-internal.json` | 빌드 없이 소스 그대로 노출하는 내부 패키지 | `providers`, `styles`, `fonts`, `packages/api` |

---

## 3. 파일별 변경 요약

### 3.1 `packages/typescript-config/nextjs.json`

`${configDir}` 변수로 `include`/`exclude`까지 프리셋이 처리하도록 끌어올림. `incremental: true`도 web/admin이 공통으로 쓰던 옵션이라 흡수.

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowJs": true,
    "jsx": "preserve",
    "noEmit": true,
    "incremental": true
  },
  "include": [
    "${configDir}/next-env.d.ts",
    "${configDir}/**/*.ts",
    "${configDir}/**/*.tsx",
    "${configDir}/**/*.mts",
    "${configDir}/.next/types/**/*.ts",
    "${configDir}/.next/dev/types/**/*.ts"
  ],
  "exclude": ["${configDir}/node_modules"]
}
```

### 3.2 `packages/typescript-config/node.json`

`base.json`에 이미 있는 옵션 제거 (`module: NodeNext`, `moduleResolution: NodeNext`, `esModuleInterop`, `skipLibCheck`, `strictNullChecks`). 남은 건 NestJS 전용 옵션 + Node.js 차이.

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "allowSyntheticDefaultImports": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

### 3.3 `packages/typescript-config/react-internal.json` (신규)

providers, styles, fonts 패키지가 똑같이 반복하던 4줄을 추출한 신규 프리셋. 빌드 없이 소스만 노출하는 내부 패키지 전용.

```json
{
  "extends": "./react-library.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": ["${configDir}/src"],
  "exclude": ["${configDir}/node_modules"]
}
```

### 3.4 `packages/typescript-config/package.json`

신규 프리셋은 `files`에 반드시 등록:

```json
"files": [
  "base.json",
  "nextjs.json",
  "react-library.json",
  "react-internal.json",
  "node.json"
]
```

---

## 4. 사용처별 최종 tsconfig

### `apps/web/tsconfig.json` (= `apps/admin/tsconfig.json`)

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@public/*": ["./public/*"]
    }
  }
}
```

`incremental`, `include`, `exclude`는 프리셋이 처리. 남은 건 이 앱만의 path alias 하나 — "이 앱이 프리셋과 다른 점"이 한눈에 보임. 19줄 → 8줄.

### `apps/api/tsconfig.json` (변경 없음)

모든 옵션이 NestJS 앱 고유라 다른 워크스페이스와 공유할 게 없음:

```json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true,
    "incremental": true,
    "removeComments": true,
    "types": ["node", "jest", "multer"]
  }
}
```

### `packages/ui/tsconfig.json` (빌드되는 라이브러리)

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

`strictNullChecks: true`는 base의 `strict: true`에 포함돼 있어 제거. ui는 실제 빌드되므로 `outDir`, `rootDir`, `include`, `exclude`는 유지.

### `packages/providers|styles|fonts/tsconfig.json` (내부 패키지)

```json
{
  "extends": "@repo/typescript-config/react-internal.json"
}
```

모든 옵션이 신규 프리셋에 흡수돼 **한 줄로 끝**.

### `packages/api/tsconfig.json`

```json
{
  "extends": "@repo/typescript-config/react-internal.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

Next 번들러에서 직접 import되므로 `module`/`moduleResolution` 오버라이드는 유지.

---

## 5. 알아둘 점

### `${configDir}`은 TS 5.5+ 기능
- 우리는 TS 5.9.2 사용 중이라 안전.
- 5.5 이전엔 프리셋 안의 `include`/`exclude` 상대경로가 프리셋 자신 기준으로 풀려서 못 썼음.

### `include`/`exclude` 상속 규칙
- 자식 tsconfig에 `include`를 적으면 **부모 것은 완전히 무시됨** (병합 아님).
- 프리셋이 정한 범위로 충분하면 자식에서 안 적기.
- 다른 범위가 필요하면 자식에서 새로 적기 (이 경우 프리셋 것은 안 쓰임).

### `paths`(alias)는 앱별 자유
- 앱마다 다를 수 있어서 프리셋에 안 넣음.
- 각 앱이 자기 tsconfig에서 정의.

### `strictNullChecks` 중복 금지
- `base.json`의 `strict: true`가 이미 포함하므로 자식에서 또 적지 말 것.

---

## 6. 새 워크스페이스 추가 가이드

### Next.js 앱

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### NestJS 앱

```json
{
  "extends": "@repo/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "./dist",
    "sourceMap": true,
    "incremental": true,
    "types": ["node", "jest"]
  }
}
```

### 내부 패키지 (Next 앱에서만 import)

```json
{
  "extends": "@repo/typescript-config/react-internal.json"
}
```

### 빌드되는 React 라이브러리

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 7. 영향도 검증

- `pnpm check-types`: 6/7 패키지 통과
- 1건 실패는 `admin/src/components/layout/Sidebar/Sidebar.tsx:67` (Next.js typed routes 관련) — **기존 에러**, 리팩토링 stash 후 원본 코드로도 동일하게 발생 확인
- `tsc --showConfig`로 web의 최종 resolved tsconfig 확인 → `${configDir}`이 `apps/web/` 경로로 정확히 풀려서 기존 동작과 100% 동일
