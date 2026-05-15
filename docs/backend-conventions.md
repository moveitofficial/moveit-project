# Backend Conventions

> **다루는 범위**: NestJS 컨트롤러의 응답 형식 · 인증 · 에러 처리 · 리스트 응답 · Swagger 문서화
> **관련 코드**: [apps/api/src/common/](../apps/api/src/common/)
> **함께 보기**: [backend-auth-flow.md](backend-auth-flow.md), [backend-prisma-overview.md](backend-prisma-overview.md)
> **최종 수정**: 2026-05-15

API와 관련한 규칙(응답 형식, 인증, 에러, Swagger, 리스트 응답)을 한 문서에서 본다. 이 셋은 컨트롤러 하나 만들 때 항상 같이 적용되므로 분리해 두지 않는다.

---

## 1. 응답 형식 (자동 래핑)

컨트롤러는 **raw 데이터만 `return`**한다. 외곽 래핑은 인터셉터·필터가 처리한다.

**성공** — [`TransformInterceptor`](../apps/api/src/common/interceptors/transform.interceptor.ts)가 감쌈:
```json
{
  "success": true,
  "message": "요청 성공",
  "data": { ... }
}
```

**실패** — [`HttpExceptionFilter`](../apps/api/src/common/filters/http-exception.filter.ts)가 감쌈:
```json
{
  "success": false,
  "message": "...",
  "error": { "code": 409 }
}
```

- `error.code`는 **HTTP 상태코드 숫자**. 예전 방식인 문자열 코드(`"AUTH_DUPLICATE_EMAIL"`)는 더 이상 사용하지 않는다.
- `details` 필드는 제거되었다. 응답 스펙에 추가 정보 넣지 말 것.

**컨트롤러에서 직접 `{ success: true, data: ... }`를 만들지 않는다.** 인터셉터가 다시 감싸 이중 래핑된다.

---

## 2. 인증 — `@JwtAuth()`

인증이 필요한 라우트에는 [`@JwtAuth()`](../apps/api/src/common/decorators/jwt-auth.decorator.ts)를 사용한다.

```typescript
@JwtAuth()
@Get('me')
getMe() { /* ... */ }
```

`@JwtAuth()`는 **인증 + 문서화 통합 데코레이터**다:
- `UseGuards(JwtAccessGuard)` — 실제 JWT 인증 가드 적용
- `ApiUnauthorizedResponse(...)` — Swagger 401 문서화

→ 인증 라우트에 `@UseGuards()`를 **따로 쓰지 않는다** (이중 처리됨).

### 비즈니스 로직에서 추가 401이 필요한 경우

기본 401(토큰 만료/유효하지 않음) 외에 추가 401 케이스가 필요하면 가변 인자로 넘긴다:

```typescript
@JwtAuth(USER_ERRORS.DELETED)
@Get('me')
getMe() { /* ... */ }
```

> ⚠️ **401 처리 규칙 (라우트 종류에 따라 다름)**
> - **보호 라우트** (토큰 필요): 401은 `@JwtAuth()` / `@JwtAuth(...추가에러)`로만 처리. `@ApiErrorResponse`에 401짜리 상수를 넣지 말 것 (가드가 이미 처리하므로 이중 문서화 방지).
> - **비보호 라우트** (토큰 불필요): 비즈니스 401(예: sign-in의 `AUTH_ERRORS.INVALID_CREDENTIALS` — 잘못된 비밀번호)은 `@ApiErrorResponse`로 정상 문서화. 인증 자체가 없는 라우트라 `@JwtAuth` 적용 대상이 아님.
>
> 즉 두 룰은 서로 충돌하지 않는 **별개의 라우트 유형**에 적용된다.

자세한 JWT 흐름은 [backend-auth-flow.md](backend-auth-flow.md).

---

## 3. 에러 처리 — `AppException` + 에러 상수

모든 에러는 [`AppException`](../apps/api/src/common/exceptions/app.exception.ts) + 에러 상수로 발생시킨다.

```typescript
throw new AppException(USER_ERRORS.NOT_FOUND);

// 추가 정보 필요 (내부 디버깅용, 응답 body엔 노출되지 않음)
throw new AppException(USER_ERRORS.NOT_FOUND, { id });
```

**인라인 `throw new HttpException('...', 400)` 금지. 메시지 하드코딩 금지.**

### 에러 상수 위치

[`apps/api/src/common/constants/errors.ts`](../apps/api/src/common/constants/errors.ts)에 도메인별 그룹으로 정의:
- `COMMON_ERRORS` (INTERNAL_SERVER_ERROR 등)
- `AUTH_ERRORS` (DUPLICATE_EMAIL, INVALID_CREDENTIALS, BLOCKED, TOKEN_EXPIRED 등)
- `USER_ERRORS` (NOT_FOUND, ALREADY_EXISTS, BLOCKED, DELETED 등)
- `SERVICE_ERRORS`, `ORDER_ERRORS`, `PAYMENT_ERRORS`, `REFUND_ERRORS`, `EXPERT_ERRORS` 등

### 규칙

- 새 에러는 **`errors.ts`에 먼저 추가한 후** 사용
- 에러 메시지 하드코딩 금지
- 에러 발생은 `AppException`으로만 처리
- 응답 body에 status 코드 외 정보(검증 details, 원인 객체) 넣지 말 것

---

## 4. 리스트 응답 — `toListResponse` 유틸

리스트를 반환하는 API는 공통 유틸로 응답 형식을 통일한다.

```typescript
import { toListResponse } from '../common/utils/list-response.util';

async findAllSomething() {
  const items = await this.repository.findAllSomething();
  return toListResponse(items);
}
```

최종 응답 (TransformInterceptor가 외곽 한 번 더 래핑):
```json
{
  "success": true,
  "message": "요청 성공",
  "data": {
    "count": 20,
    "items": [...]
  }
}
```

**예외**: 단건 조회이거나 `count`가 불필요한 응답은 raw return해도 된다. 강제는 아님.

---

## 5. Swagger 문서화

### 성공 응답 — `@ApiSuccessResponse(status, ResponseDto)`

```typescript
@ApiSuccessResponse(HttpStatus.OK, ResponseDto)
@ApiSuccessResponse(HttpStatus.CREATED, ResponseDto)
```

### 에러 응답 — `@ApiErrorResponse(...errors)` 그룹화 규칙

**status가 다른 에러는 각각 한 줄씩** (호출을 분리):

```typescript
@ApiErrorResponse(AUTH_ERRORS.DUPLICATE_EMAIL)          // 409
@ApiErrorResponse(USER_ERRORS.NOT_FOUND)                // 404
@ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)  // 500
```

**같은 status의 여러 케이스는 한 호출에 묶음**:

```typescript
@ApiErrorResponse(
  USER_ERRORS.NOT_FOUND,
  ORDER_ERRORS.NOT_FOUND,
) // 404
```

이유: Swagger UI에서 status 코드별로 묶여 표시되므로 코드 구조와 1:1 매칭이 되어 가독성·유지보수성 ↑.

### NestJS 기본 에러 데코레이터 사용 금지

- ❌ `@ApiNotFoundResponse`, `@ApiConflictResponse`, `@ApiBadRequestResponse` 등 NestJS 기본 데코레이터는 **더 이상 사용하지 않는다**
- ✅ 무조건 `@ApiErrorResponse(...)`

### 전체 예시

```typescript
@Controller('users')
export class UserController {
  @JwtAuth()                                          // 인증 + 401 문서화
  @ApiSuccessResponse(HttpStatus.OK, UserResponseDto)
  @ApiErrorResponse(USER_ERRORS.NOT_FOUND)            // 404
  @Get('me')
  getMe() { /* ... */ }

  @ApiSuccessResponse(HttpStatus.CREATED, UserResponseDto)
  @ApiErrorResponse(AUTH_ERRORS.DUPLICATE_EMAIL)              // 409
  @ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)      // 500
  @Post()
  create() { /* ... */ }
}
```

---

## 6. DTO 컨벤션 — `declare` 필드

```typescript
export class SignInRequestDto {
  @ApiProperty({ example: 'a@b.com', description: 'email' })
  @IsEmail()
  @MaxLength(320)
  declare email: string;
}
```

- `declare`로 선언해 **런타임 프로퍼티가 만들어지지 않고 데코레이터 메타만 남긴다**.
- `class-validator` + `class-transformer` 데코레이터로 검증.
- `ValidationPipe`는 `whitelist + forbidNonWhitelisted + transform`이 켜져 있어, 정의 안 한 필드는 자동으로 잘리고, 모르는 키가 오면 400으로 거절된다.

기존 DTO 예시: [apps/api/src/auth/dto/](../apps/api/src/auth/dto/)

---

## 7. `common/` 폴더 구조

```
common/
├── constants/      # 에러 상수 (errors.ts)
├── decorators/     # @JwtAuth, @ApiSuccessResponse, @ApiErrorResponse
├── exceptions/     # AppException
├── filters/        # HttpExceptionFilter, WsExceptionFilter
├── interceptors/   # TransformInterceptor, LoggingInterceptor
├── swagger/        # ErrorResponseDto, errorResponseExample
└── utils/          # toListResponse 등
```

**책임 분리 지키기**:
- Swagger 관련 파일 → `common/swagger/`
- 공통 데코레이터 → `common/decorators/`
- 공통 유틸 → `common/utils/`

> ⚠️ `common/dto/`는 제거되었다. 새로 만들지 말 것 — Swagger DTO가 필요하면 `common/swagger/`에.

---

## 8. 자주 하는 실수

- ❌ 컨트롤러에서 `{ success: true, data: ... }` 직접 만들기 → 인터셉터가 또 감싸서 이중 래핑
- ❌ 인라인 `throw new HttpException('메시지', 400)` → `AppException(ERROR_CONST)` 사용
- ❌ 보호 라우트의 `@ApiErrorResponse`에 401짜리 상수 넣기 → `@JwtAuth(...)` 가변인자로
- ❌ `@UseGuards(JwtAccessGuard)` 직접 사용 → `@JwtAuth()`가 이미 포함
- ❌ `@ApiNotFoundResponse` 같은 NestJS 기본 에러 데코레이터 → `@ApiErrorResponse(...)`
- ❌ 응답 body에 `details` 필드, 문자열 `code` → 제거됨, 사용 금지
- ❌ DTO 필드에 `declare` 빠뜨림 → 런타임 프로퍼티 생성돼 불필요한 메모리·혼동
- ❌ `common/dto/` 폴더 만들기 → `common/swagger/`에 추가
