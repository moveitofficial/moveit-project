# Backend Auth Flow

> **다루는 범위**: 회원가입 / 로그인 / JWT 발급 / 쿠키 / 보호 라우트 / Passport 전략
> **관련 코드**: [apps/api/src/auth/](../apps/api/src/auth/)
> **함께 보기**: [backend-conventions.md](backend-conventions.md)
> **최종 수정**: 2026-05-15

현재 코드(2026-05-15 기준) 그대로의 인증 흐름. 미구현 부분은 마지막 섹션에 명시.

---

## 1. 전체 구조

```
┌────────────────────┐    ┌────────────────────────────────────┐
│ POST /auth/sign-up │ ─→ │ AuthService.signUpWithEmail()      │
│                    │    │  · bcrypt.hash (cost 12)           │
│                    │    │  · UsersService.createLocalUser    │
│                    │    │  · Prisma P2002 → DUPLICATE_EMAIL  │
└────────────────────┘    └────────────────────────────────────┘

┌────────────────────┐    ┌────────────────────────────────────┐
│ POST /auth/sign-in │ ─→ │ AuthService.signInWithEmail()      │
│                    │    │  · 4가지 검증 (아래)               │
│                    │    │  · JWT 2종 sign                    │
│                    │    │ ─→ setAuthCookies(res, ...)        │
│                    │    │ ─→ return { user }                 │
└────────────────────┘    └────────────────────────────────────┘

┌──────────────────────┐  ┌────────────────────────────────────┐
│ 보호 라우트 요청     │ ─→ │ @JwtAuth() = UseGuards(...)        │
│ (쿠키 자동 전송)     │  │  ↓ JwtAccessGuard                  │
│                      │  │  ↓ JwtAccessStrategy.validate      │
│                      │  │     · 쿠키에서 토큰 추출           │
│                      │  │     · 서명 검증                    │
│                      │  │     · typ === 'access' 확인        │
│                      │  │  ↓ req.user = { userId, email, role }│
│                      │  │  ↓ 컨트롤러 실행                   │
└──────────────────────┘  └────────────────────────────────────┘
```

---

## 2. 회원가입 (POST /auth/sign-up)

**컨트롤러**: [auth.controller.ts:39](../apps/api/src/auth/auth.controller.ts)

```typescript
@ApiOperation({ summary: '이메일 회원가입 (LOCAL)' })
@ApiSuccessResponse(HttpStatus.CREATED, SignUpHttpResponseDto)
@ApiErrorResponse(AUTH_ERRORS.DUPLICATE_EMAIL)              // 409
@ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)      // 500
@HttpCode(HttpStatus.CREATED)
@Post('sign-up')
async signUp(@Body() body: SignUpRequestDto)
```

**요청 DTO**: [`SignUpRequestDto`](../apps/api/src/auth/dto/sign-up-request.dto.ts)
- `email`: `IsEmail`, `MaxLength(320)`
- `password`: 8~128자, 대·소문자·숫자·특수문자 각각 포함 (정규식 `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$`)
- `name`: 1~50자
- `role`: `Role` enum (`CLIENT` | `EXPERT`)

**서비스 흐름**: [auth.service.ts:41](../apps/api/src/auth/auth.service.ts)

1. `bcrypt.hash(password, 12)` — `BCRYPT_COST = 12`
2. `UsersService.createLocalUser({ email, passwordHash, name, role })`
3. Prisma `P2002` (unique 위반) catch → `AppException(AUTH_ERRORS.DUPLICATE_EMAIL)`
4. 그 외 에러는 그대로 throw (HttpExceptionFilter가 500으로 처리)

**응답 데이터** (`TransformInterceptor`가 감싼 후):
```json
{
  "success": true,
  "message": "요청 성공",
  "data": {
    "userId": "uuid",
    "role": "CLIENT",
    "onboardingRequired": true
  }
}
```

`onboardingRequired`는 현재 항상 `true`. 향후 프로필 작성 여부 분기에 사용 예정.

---

## 3. 로그인 (POST /auth/sign-in)

**컨트롤러**: [auth.controller.ts:51](../apps/api/src/auth/auth.controller.ts)

```typescript
@ApiOperation({ summary: '이메일 로그인 (LOCAL)' })
@ApiSuccessResponse(HttpStatus.OK, signInHttpResponseDto)
@ApiErrorResponse(AUTH_ERRORS.INVALID_CREDENTIALS)         // 401
@ApiErrorResponse(AUTH_ERRORS.BLOCKED)                     // 403
@ApiErrorResponse(USER_ERRORS.NOT_FOUND)                   // 404
@ApiErrorResponse(COMMON_ERRORS.INTERNAL_SERVER_ERROR)     // 500
@HttpCode(HttpStatus.OK)
@Post('sign-in')
async signIn(@Body() body: SignInRequestDto, @Res({ passthrough: true }) res: Response)
```

> sign-in은 비보호 라우트이므로 `@ApiErrorResponse(...INVALID_CREDENTIALS)` (401)이 정상이다. 보호 라우트의 401만 `@JwtAuth(...)` 안에서 처리한다.

**요청 DTO**: [`SignInRequestDto`](../apps/api/src/auth/dto/sign-in-request.dto.ts) — `email` + `password` (8~128자)

**서비스 검증 순서**: [auth.service.ts:73](../apps/api/src/auth/auth.service.ts)

1. `usersService.getUserByEmail(email)` → `null`이면 → `USER_ERRORS.NOT_FOUND` (404)
2. `user.provider !== 'LOCAL'` 또는 `user.password === null` → `AUTH_ERRORS.INVALID_CREDENTIALS` (401)
3. `user.isBlocked` → `AUTH_ERRORS.BLOCKED` (403)
4. `user.isDeleted` → `AUTH_ERRORS.INVALID_CREDENTIALS` (401) — 탈퇴 사실을 노출하지 않으려 의도적으로 동일 메시지
5. `bcrypt.compare(password, user.password)` → false면 `AUTH_ERRORS.INVALID_CREDENTIALS` (401)

검증 통과 후:
- **access token**: payload `{ sub: user.id, email, role, typ: 'access' }`, expiresIn `1h`
- **refresh token**: payload `{ sub: user.id, typ: 'refresh' }`, expiresIn `7d`
- `setAuthCookies(res, accessToken, refreshToken)` 호출
- 컨트롤러는 `return { user }` (TransformInterceptor가 `{ success, message, data: { user } }`로 감쌈)

**응답에 노출되는 사용자 필드** ([`#toPublicUser`](../apps/api/src/auth/auth.service.ts)):
```typescript
{ id, email, name, role, profileImageUrl, isBlocked, isDeleted }
```
password, provider, providerId 등 민감/내부 필드는 노출 X.

---

## 4. 쿠키 설정

[auth.service.ts:126](../apps/api/src/auth/auth.service.ts)의 `setAuthCookies`:

```typescript
const base = {
  httpOnly: true,
  secure: NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

res.cookie('moveit_access_token',  accessToken,  { ...base, maxAge: 60 * 60 * 1000 });
res.cookie('moveit_refresh_token', refreshToken, { ...base, maxAge: 7 * 24 * 60 * 60 * 1000 });
```

| 상수 | 값 | 정의 |
|---|---|---|
| `ACCESS_COOKIE_NAME` | `moveit_access_token` | [auth.constants.ts](../apps/api/src/auth/auth.constants.ts) |
| `REFRESH_COOKIE_NAME` | `moveit_refresh_token` | 동 |
| `ACCESS_MAX_AGE_MS` / `ACCESS_JWT_EXPIRES_IN` | `60 * 60 * 1000` / `'1h'` | 동 (반드시 동일 유지) |
| `REFRESH_MAX_AGE_MS` / `REFRESH_JWT_EXPIRES_IN` | `7 * 24 * 60 * 60 * 1000` / `'7d'` | 동 |
| `JWT_ACCESS_TYP` / `JWT_REFRESH_TYP` | `'access'` / `'refresh'` | 동 |

> `MAX_AGE_MS`와 `JWT_EXPIRES_IN`은 반드시 같은 기간이어야 한다 (auth.constants.ts 주석 명시).

**프론트엔드**: 쿠키 자동 전송이므로 클라이언트 코드에서 토큰을 직접 다루지 않는다. [`@repo/fetcher`](../packages/fetcher/src/fetchClient.ts)의 `api`는 `credentials: 'include'`(CSR) / `next/headers` 쿠키 전달(SSR)로 자동 처리.

---

## 5. 보호 라우트 흐름

### `@JwtAuth()` 데코레이터

[apps/api/src/common/decorators/jwt-auth.decorator.ts](../apps/api/src/common/decorators/jwt-auth.decorator.ts)

```typescript
export function JwtAuth(...additionalErrors: ErrorConstant[]) {
  return applyDecorators(
    UseGuards(JwtAccessGuard),
    ApiUnauthorizedResponse({
      type: ErrorResponseDto,
      examples: { TOKEN_EXPIRED, ACCESS_TOKEN_INVALID, ...additionalErrors },
    }),
  );
}
```

- 한 줄로 **가드 적용 + Swagger 401 문서화** 동시 처리
- 추가 401 케이스가 필요하면 `@JwtAuth(USER_ERRORS.DELETED)`처럼 가변인자

### `JwtAccessGuard` & `JwtAccessStrategy`

**Guard** ([jwt-access.guard.ts](../apps/api/src/auth/jwt/jwt-access.guard.ts)): `AuthGuard('jwt-access')` 래퍼 한 줄.

**Strategy** ([jwt-access.strategy.ts](../apps/api/src/auth/jwt/jwt-access.strategy.ts)):

```typescript
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const token = req.cookies[ACCESS_COOKIE_NAME];
          return typeof token === 'string' ? token : null;
        },
      ]),
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: JwtAccessPayload): JwtAccessUser {
    if (payload.typ !== JWT_ACCESS_TYP) throw new UnauthorizedException();
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
```

**핵심 동작**:
1. 쿠키 `moveit_access_token`에서 JWT 추출 (Authorization 헤더 X — 쿠키 전용)
2. `JWT_SECRET`으로 서명 검증
3. `payload.typ === 'access'` 확인 — refresh 토큰을 access 자리에 못 쓰게 막는 핵심 가드
4. `req.user = { userId, email, role }` 설정

컨트롤러에서 사용:
```typescript
@JwtAuth()
@Get('me')
getMe(@Req() req: { user: JwtAccessUser }) {
  return this.usersService.findById(req.user.userId);
}
```

---

## 6. JWT Payload 타입

[auth.types.ts](../apps/api/src/auth/auth.types.ts)

```typescript
interface JwtAccessPayload {
  sub: string;     // user.id
  email: string;
  role: Role;
  typ: string;     // 'access'
}

interface JwtRefreshPayload {
  sub: string;     // user.id
  typ: string;     // 'refresh'
}
```

> `typ`는 디코드 후 string으로만 보장되므로 타입을 `string`으로 두고, validate에서 상수와 비교한다.

---

## 7. 모듈 구성

[auth.module.ts](../apps/api/src/auth/auth.module.ts)

- `imports`: `UsersModule`, `PassportModule`, `JwtModule.registerAsync({ secret: config.getOrThrow('JWT_SECRET') })`
- `providers`: `AuthService`, `JwtAccessStrategy`, `JwtRefreshStrategy`, `JwtAccessGuard`, `JwtRefreshGuard`
- `exports`: `JwtAccessGuard`, `JwtRefreshGuard` (다른 모듈에서 가드 재사용 가능)
- `controllers`: `AuthController`

---

## 8. 환경 변수

| 키 | 용도 |
|---|---|
| `JWT_SECRET` | JWT 서명 키 (필수, `getOrThrow`) |
| `NODE_ENV` | `'production'`일 때만 쿠키 `secure: true` |

`.env.${NODE_ENV}` 파일에서 로드 (`ConfigModule.forRoot({ envFilePath: ... })`).

---

## 9. Refresh Strategy (구현되어 있지만 엔드포인트 없음)

[jwt-refresh.strategy.ts](../apps/api/src/auth/jwt/jwt-refresh.strategy.ts), [jwt-refresh.guard.ts](../apps/api/src/auth/jwt/jwt-refresh.guard.ts)는 구현돼 있다:
- 쿠키 `moveit_refresh_token`에서 추출
- `payload.typ === 'refresh'` 검증
- `req.user = { userId }` 만 반환 (email/role 없음)

하지만 **현재 refresh 엔드포인트(`POST /auth/refresh` 등)는 컨트롤러에 존재하지 않는다.** Strategy/Guard는 준비됐고, 컨트롤러 핸들러만 추가하면 즉시 사용 가능한 상태.

---

## 10. 미구현/예정 정리

- ❌ Refresh 엔드포인트 (Strategy/Guard는 준비됨)
- ❌ 로그아웃 엔드포인트 (쿠키 삭제)
- ❌ Google / Kakao / Naver OAuth (`AuthProvider` enum엔 정의돼 있음)
- ❌ 비밀번호 재설정 흐름
- ❌ 이메일 인증

`onboardingRequired: true`는 항상 true로 고정. 프론트엔드에서 어떻게 활용할지(프로필 입력 강제 등)는 별도 결정 사항.
