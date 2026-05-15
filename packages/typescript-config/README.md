# @repo/typescript-config

모노레포 전역 공용 TypeScript 설정. 모든 앱/패키지는 이곳의 프리셋을 `extends`해서 사용한다.

## 왜 이렇게 했는가

기존엔 각 앱/패키지가 `incremental`, `include`, `exclude`, `strictNullChecks` 등을 자기 tsconfig에서 직접 정의해 같은 옵션이 7~9곳에 반복됐다. TS 버전 업그레이드나 옵션 변경 시 모든 파일을 수정해야 했고, 누가 한 앱만 다르게 설정해도 발견하기 어려웠다.

루트 프리셋에 공통 옵션을 모으면:

1. **변경 한 곳만** — 프리셋 한 파일 수정으로 모든 앱/패키지에 일괄 반영
2. **일관성 보장** — 옵션이 한 곳에만 있어서 drift 발생 불가
3. **앱 tsconfig의 의도가 명확** — "공용과 다른 점"만 보여서 리뷰 쉬움

## 프리셋 구조

```
base.json            ← 진짜 공통 (strict, target, module, lib 등)
├─ nextjs.json       ← Next.js 앱용 (web, admin)
├─ node.json         ← NestJS 앱용 (api)
└─ react-library.json
    └─ react-internal.json  ← 빌드 안 하는 내부 React 패키지용 (providers, styles, fonts, packages/fetcher)
```

| 프리셋 | 용도 | 사용처 |
|---|---|---|
| `base.json` | 모든 곳의 베이스 (직접 extends 하지 말 것) | (내부용) |
| `nextjs.json` | Next.js 앱 | `apps/web`, `apps/admin` |
| `node.json` | NestJS 등 Node.js 앱 | `apps/api` |
| `react-library.json` | 실제로 빌드되는 React 라이브러리 (outDir/declaration 생성) | `packages/ui` |
| `react-internal.json` | 빌드 없이 소스를 그대로 노출하는 내부 React 패키지 (noEmit) | `packages/providers`, `packages/styles`, `packages/fonts`, `packages/fetcher` |

## 새 워크스페이스 추가할 때

### Next.js 앱
```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```
`include`/`exclude`/`incremental`은 프리셋이 이미 잡아두니 다시 적지 말 것.

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

### 내부 패키지 (Next 앱에서만 import해서 쓸 패키지)
```json
{
  "extends": "@repo/typescript-config/react-internal.json"
}
```
거의 한 줄로 끝난다.

### 실제로 빌드되는 React 라이브러리
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

## 알아둘 점

### 1. `${configDir}` 사용

`include`/`exclude`에 있는 `${configDir}`은 TS 5.5+에서 지원되는 템플릿 변수로, **프리셋을 사용하는 쪽 tsconfig의 디렉토리**로 치환된다.

예를 들어 `nextjs.json`의:
```json
"include": ["${configDir}/next-env.d.ts", "${configDir}/**/*.ts", ...]
```

`apps/web/tsconfig.json`이 이 프리셋을 extends하면 `${configDir}`이 `apps/web/`로 풀린다. 그래서 각 앱이 `include`를 직접 안 적어도 자기 디렉토리 기준으로 잘 작동한다.

> ⚠️ TS 5.5 이전엔 `include`의 상대경로가 프리셋 기준으로 풀려서 (`packages/typescript-config/src` 같은 식) 의도대로 안 됐다. `${configDir}` 덕분에 비로소 `include`까지 프리셋으로 끌어올릴 수 있게 된 것.

### 2. `include`/`exclude` 상속 규칙

`extends`를 써도 자식 tsconfig에 `include`를 적으면 **부모의 `include`는 완전히 무시**된다 (병합 아님). 그래서:

- 프리셋이 정한 `include`로 충분하면 → **자식에 안 적기**
- 프리셋과 다른 범위가 필요하면 → 자식에 자기만의 `include` 적기 (이 경우 프리셋 것은 안 쓰임)

`packages/ui/tsconfig.json`이 자체 `include: ["src"]`를 가진 이유: 빌드되는 라이브러리라 `outDir/rootDir` 매칭을 위해 명시한 것.

### 3. `paths`는 앱별로 자유

`paths` (alias)는 앱마다 다를 수 있어서 프리셋에 안 넣었다. 각 앱이 자기 tsconfig에서 정의한다.

## 변경 이력

- 2026-05-15: 공통 옵션(`incremental`, `include`, `exclude`, `strictNullChecks` 등)을 프리셋으로 추출. `react-internal.json` 프리셋 신규 추가.
