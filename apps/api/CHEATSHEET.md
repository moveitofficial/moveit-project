# 백엔드 개발 치트시트

> 루트 [ONBOARDING.md](../../ONBOARDING.md)의 상세 설명은 거기서, 여기선 백엔드만 빠르게.

---

## 1. 클론 후 세팅 순서

```bash
# 1. 클론 & 루트 의존성 설치
git clone <repo-url>
cd moveit-project
corepack enable
pnpm install

# 2. 환경변수 세팅
cp apps/api/.env.example apps/api/.env.development

# 3. Prisma 클라이언트 생성 (DB는 이미 세팅돼 있으므로 generate만)
pnpm --filter api run prisma:generate

# 4. 개발 서버 실행
pnpm --filter api dev
```

---

## 2. VSCode 확장팩 — Prisma 버전 맞추기

Prisma 확장팩은 **6.0.0 버전**으로 고정해야 스키마 인텔리센스가 정상 작동합니다.

1. VSCode 좌측 Extensions 패널 열기 (`Cmd+Shift+X`)
2. `Prisma` 검색 → Prisma 확장팩 선택
3. 설치 버튼 옆 **▼ 화살표** 클릭 → `Install Specific Version...`
4. `6.0.0` 입력 후 설치
5. 자동 업데이트 방지: `Cmd+Shift+P` → `Disable Auto Updating Extensions` → Prisma 선택

---

## 3. 자주 쓰는 명령어 (`--filter api`)

모든 명령어는 **모노레포 루트**에서 실행합니다. `cd apps/api` 하지 마세요.

```bash
# 백엔드만 실행
pnpm --filter api dev

# 백엔드만 빌드
pnpm --filter api build

# 백엔드만 lint 검사
pnpm --filter api lint

# 패키지 설치
pnpm --filter api add <패키지>
pnpm --filter api add -D <패키지>      # devDependency

# 패키지 제거
pnpm --filter api remove <패키지>
```

### NestJS CLI (코드 생성)

```bash
# 리소스 한번에 생성 (module + controller + service + dto + entity)
pnpm --filter api exec nest g res <name>

# 개별 생성
pnpm --filter api exec nest g mo <name>        # module
pnpm --filter api exec nest g co <name>        # controller
pnpm --filter api exec nest g s <name>         # service
pnpm --filter api exec nest g gu <name>        # guard
pnpm --filter api exec nest g mi <name>        # middleware
pnpm --filter api exec nest g pi <name>        # pipe
pnpm --filter api exec nest g i <name>         # interceptor
pnpm --filter api exec nest g f <name>         # filter
pnpm --filter api exec nest g d <name>         # decorator
```

> `nest g res`는 REST/GraphQL 선택 프롬프트가 뜹니다. REST 선택하면 됩니다.

### Prisma 명령어

> ⛔ **`prisma:migrate`, `prisma:seed`는 직접 실행 금지**  
> 스키마 변경이나 시드 관련 작업이 필요하면 **백엔드 리드에게 토스**하세요.  
> 잘못 실행하면 공유 DB에 영향을 줍니다.

```bash
# Prisma 클라이언트 재생성 (schema.prisma가 pull로 바뀐 경우)
pnpm --filter api run prisma:generate

# Prisma Studio (DB GUI — 조회/확인용)
pnpm --filter api run prisma:studio

# 스키마 유효성 검사
pnpm --filter api run prisma:validate
```

### 패키지 빌드

```bash
# socket-events 빌드 (채팅 관련 타입/이벤트 수정 후 반드시 실행)
pnpm --filter @repo/socket-events build

# content-filter 빌드 (금지어 목록/필터 함수 수정 후 반드시 실행)
pnpm --filter @repo/content-filter build
```

> 두 패키지 모두 `pnpm install` 시 자동 빌드됩니다. 수동으로 수정했을 때만 위 명령어를 실행하세요.

---

## 4. Import 꼬임 → 린트 오류 한번에 수정

ESLint가 import 순서, `import type` 누락 등을 잡아냅니다. 수동으로 다 고치지 말고:

```bash
# 백엔드 ESLint 자동 수정 (--fix)
pnpm --filter api exec eslint . --fix
```

> `--fix`로 못 고치는 건 (ex. `any` 사용, `!` 단언) 직접 수정해야 합니다.

### 자주 나오는 lint 에러

| 에러                      | 원인                  | 해결                                         |
| ------------------------- | --------------------- | -------------------------------------------- |
| `consistent-type-imports` | 타입 import 누락      | `import type { X } from '...'` 로 변경       |
| `import/order`            | import 순서 틀림      | `--fix`로 자동 수정                          |
| `no-unused-vars`          | 안 쓰는 변수          | 지우거나 `_변수명` 으로                       |
| `no-explicit-any`         | `any` 사용            | 정확한 타입 명시 또는 `unknown`              |
| `no-floating-promises`    | `await` 빠진 Promise  | `await` 추가 또는 `void promise`             |
| `no-non-null-assertion`   | `!` 단언 사용         | `?.` 옵셔널체이닝 또는 조건문으로            |

---

## 5. 주의사항

- **환경변수 파일**: `.env.development` 는 git에 올라가지 않습니다. 팀원에게 직접 받으세요.
- **스키마/시드 변경 필요하면 직접 건드리지 말고 백엔드 리드에게 요청**: `prisma:migrate`, `prisma:seed`는 공유 DB에 직접 영향을 줍니다.
- **`pnpm install`을 `apps/api` 안에서 직접 실행 금지** → 루트에서 `pnpm --filter api add <pkg>` 사용.
- **JWT_SECRET, JWT_EXPIRES_IN** 미설정 시 서버 실행은 되지만 인증 관련 기능이 터집니다. 반드시 채울 것.
