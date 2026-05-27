# Move:it 웹 API 명세서

> **대상 클라이언트**: apps/web (Next.js 의뢰인·전문가 통합 웹)
> **작성 기준**: Prisma 스키마 ([apps/api/prisma/schema.prisma](../apps/api/prisma/schema.prisma)) + 디자인 카탈로그 ([frontend-figma-references.md](frontend-figma-references.md)) + 웹 mock 데이터 ([apps/web/src/mocks/](../apps/web/src/mocks/))
> **최종 수정**: 2026-05-19
> **작성 목적**: 백엔드 구현 가이드 (구현완료 / 신규 표시 포함)

---

## 0. 공통 규약

### 0.1 베이스 URL

| 환경 | API URL (`NEXT_PUBLIC_API_URL`) | Client URL (`NEXT_PUBLIC_CLIENT_URL`) |
|---|---|---|
| 로컬 | `http://localhost:8000/` | `http://localhost:3000/` |
| 운영 | `https://api.moveitofficial.com/` | `https://www.moveitofficial.com/` |

모든 엔드포인트는 위 API URL 뒤에 path가 붙는 형태. 예: `https://api.moveitofficial.com/auth/signin`

### 0.2 인증

JWT는 **httpOnly 쿠키**로 관리. 클라이언트에서 직접 토큰을 다루지 않음.

| 쿠키 | TTL | 용도 |
|---|---|---|
| `moveit_access_token` | 1h | API 호출 시 자동 첨부 |
| `moveit_refresh_token` | 7d | access token 만료 시 갱신 |

- 쿠키 옵션: `httpOnly + sameSite=lax + secure(운영)`
- CORS: `credentials: true` 필수 (`Access-Control-Allow-Credentials: true`)
- 인증 필요한 라우트는 `@JwtAuth()` 데코레이터로 보호 — Swagger에 자물쇠 🔒 표시됨

### 0.3 응답 형식

**성공**:
```json
{
  "success": true,
  "message": "요청 성공",
  "data": { ... }
}
```

**데이터가 없는 성공**:
```json
{
  "success": true,
  "message": "요청 성공",
  "data": {}
}
```

**실패**:
```json
{
  "success": false,
  "message": "에러 메시지(한국어)",
  "error": {
    "code": 409
  }
}
```
- `error.code`: **HTTP 상태코드 숫자** (문자열 코드 금지)

**페이지네이션 (리스트 응답의 `data` 형태)**:
```json
{
  "items": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 125,
    "hasNext": true
  }
}
```

### 0.4 공통 에러 코드

| HTTP | 의미 | 예 |
|---|---|---|
| 400 | 검증 실패 | 잘못된 입력값 |
| 401 | 인증 실패 | 토큰 만료/유효하지않음, 잘못된 비밀번호 |
| 403 | 권한 없음 | EXPERT 전용 라우트에 CLIENT 접근 |
| 404 | 리소스 없음 | 존재하지 않는 ID |
| 409 | 충돌 | 이메일 중복 |
| 423 | 잠긴 계정 | 블랙리스트 |
| 500 | 서버 오류 | 내부 에러 |

### 0.5 공통 enum (Prisma 스키마 기반)

| Enum | 값 |
|---|---|
| `Role` | `CLIENT` `EXPERT` |
| `AuthProvider` | `LOCAL` `GOOGLE` `KAKAO` `NAVER` |
| `Region` | `SEOUL` `BUSAN` `DAEGU` `INCHEON` `GWANGJU` `DAEJEON` `ULSAN` `SEJONG` `GYEONGGI_NORTH` `GYEONGGI_SOUTH` `GANGWON` `CHUNGBUK` `CHUNGNAM` `JEONBUK` `JEONNAM` `GYEONGBUK` `GYEONGNAM` `JEJU` |
| `ServiceGroupName` | `IT_COACHING` `PROJECT_REQUEST` |
| `ServiceCategoryName` | `WEB` `APP` `AI` `GAME` `DATA_ANALYTICS` |
| `TechStackName` | `JAVASCRIPT` `TYPESCRIPT` `PYTHON` `JAVA` `KOTLIN` `SWIFT` `REACT` `NEXTJS` `VUE` `REACT_NATIVE` `NODEJS` `NESTJS` `SPRING` `DJANGO` `FASTAPI` `POSTGRESQL` `MYSQL` `MONGODB` `AWS` `DOCKER` |
| `StackType` | `DESIGN` `FRONTEND` `BACKEND` |
| `BusinessSector` | `PUBLIC_INSTITUTION` `ECOMMERCE` `LEGAL_TAX` `REAL_ESTATE` `MEDICAL_PHARMA` |
| `ServiceStatus` | `ACTIVE` `PAUSED` `CLOSED` |
| `OrderStatus` | `NEGOTIATING` `CANCEL_REQUESTED` `PAYMENT_CANCELLED` `IN_PROGRESS` `DEADLINE_IMMINENT` `EXPIRED` `WORK_COMPLETED` `PURCHASE_CONFIRMED` `SETTLEMENT_REQUESTED` `SETTLEMENT_COMPLETED` `REFUND_REQUESTED` `REFUND_COMPLETED` |
| `PaymentStatus` | `PENDING` `PAID` `FAILED` `CANCELLED` `REFUNDED` |
| `RefundType` | `CANCEL` `REFUND` |
| `RefundStatus` | `REQUESTED` `APPROVED` `REJECTED` `COMPLETED` |
| `CommunityCategory` | `QUESTION` `TIP` `REVIEW` `STUDY_GROUP` `FREE` |
| `NotificationType` | `COMMUNITY` `TRANSACTION` `REMINDER` |
| `NotificationCategory` | `POST_COMMENT` `POST_REPLY` `POST_LIKE` `ORDER_CREATED` `ORDER_CANCELLED` `PAYMENT_SUCCESS` `REFUND_REQUESTED` `PURCHASE_CONFIRM_REQUEST` `PURCHASE_CONFIRMED` `SETTLEMENT_REQUESTED` `SETTLEMENT_DONE` `SCHEDULE_REGISTERED` `SCHEDULE_CHANGE_REQUEST` `SCHEDULE_REMINDER` `DEADLINE_REMINDER` |
| `MessageType` | `TEXT` `FILE` `SYSTEM` |
| `SystemMessageType` | `TRADE_REQUEST_SENT` `TRADE_REQUEST_RECEIVED` `TRADE_CANCELED` `PAYMENT_REQUEST` `PAYMENT_HELD` `PAYMENT_COMPLETED` `SCHEDULE_REQUEST` `SCHEDULE_REGISTERED` `SCHEDULE_CHANGE_REQUEST` `ORDER_COMPLETION_PENDING` |
| `MainSectionType` | `POPULAR_IT_COACHING` `POPULAR_PROJECT_REQUEST` `MOVEIT_POPULAR_PROJECT_EXPERT` `MOVEIT_POPULAR_COACHING` `RECOMMENDED_IT_COACHING` `RECOMMENDED_PROJECT_REQUEST` |
| `ReportReason` | `FALSE_INFORMATION` `ABUSE` `ILLEGAL_ACTIVITY` `EXTERNAL_CONTACT` `SPAM` `OTHER` |

### 0.6 표기 규칙

- 📌 = 구현 완료 (이미 API 존재)
- 🆕 = 신규 (이번 구현 대상)
- 🔒 = JWT 인증 필요
- 👤 = 역할 제한 (CLIENT / EXPERT)

---

## 1. 인증 (Auth)

> 관련 디자인: 로그인 `64:6675` / SNS 회원가입 EXPERT `105:3937` / SNS 회원가입 CLIENT `112:4089` / 이메일 회원가입 `112:4689` / 블랙리스트 상태 `205:75711`

### 📌 POST /auth/signup — 이메일 회원가입

**Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "홍길동",
  "role": "CLIENT"
}
```

**Response 201** (`data`):
```json
{
  "userId": "uuid",
  "role": "CLIENT",
  "onboardingRequired": true
}
```

**Errors**: 409 (이메일 중복) / 400 (검증) / 500

---

### 📌 POST /auth/signin — 이메일 로그인

**Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response 200** (`data`):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "CLIENT",
    "profileImageUrl": null,
    "isBlocked": false,
    "isDeleted": false
  }
}
```

**Side effect**: `Set-Cookie: moveit_access_token`, `moveit_refresh_token`

**Errors**: 401 (비밀번호 불일치) / 423 (블랙리스트) / 410 (탈퇴 계정) / 404 (계정 없음) / 500

---

### 📌 POST /auth/oauth/signup — OAuth 가입 완료 (role 확정)

OAuth 콜백 후 httpOnly 쿠키에 저장된 `signupToken`과 role을 받아 최종 가입.

**Body**:
```json
{
  "role": "CLIENT"
}
```

**Response 201** (`data`): signin 응답과 동일 (`user`)
**Side effect**: 로그인 쿠키 설정 + `signupToken` 쿠키 삭제

**Errors**: 401 (signupToken 무효/만료) / 409 (이메일 중복) / 423 (블랙리스트) / 500

---

### 📌 GET /auth/{provider} — OAuth 시작

- `provider`: `google` / `kakao` / `naver`
- 동작: 해당 IdP 인증 페이지로 302 리다이렉트

### 📌 GET /auth/{provider}/callback — OAuth 콜백

- 신규 가입: `signupToken` 쿠키 세팅 후 `{CLIENT_URL}/signup/oauth?provider={provider}`로 리다이렉트
- 기존 사용자: 로그인 쿠키 세팅 후 `{CLIENT_URL}`로 리다이렉트
- 실패: `{CLIENT_URL}/signin?error={code}`

---

### 🆕 POST /auth/refresh — 토큰 갱신

쿠키의 refresh token으로 access token 재발급.

**Body**: 없음
**Response 200**: `{}`
**Side effect**: 새 `moveit_access_token` 쿠키 설정

**Errors**: 401 (refresh token 만료/무효)

---

### 🆕 POST /auth/signout 🔒 — 로그아웃

**Response 200**: `{}`
**Side effect**: 두 쿠키 모두 삭제

---

## 2. 내 정보 / 프로필 (Me)

> 관련 디자인: 마이페이지 CLIENT `154:33207` / EXPERT `155:48177` / 블랙리스트 `205:75711`

### 📌 GET /users/me 🔒 — 내 정보 조회

**Response 200** (`data`):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "role": "CLIENT",
  "provider": "LOCAL",
  "profileImageUrl": "https://...",
  "region": "SEOUL",
  "phoneNumber": "010-1234-5678",
  "isBlocked": false,
  "isDeleted": false,
  "createdAt": "2026-01-15T09:00:00.000Z"
}
```

블랙리스트 화면(`205:75711`)은 응답의 `isBlocked === true` 또는 별도 423 응답으로 분기.

**Errors**: 404 (계정 없음) / 500

---

### 📌 PATCH /users/me 🔒 — 내 정보 수정

**Body** (모두 optional):
```json
{
  "name": "변경된이름",
  "profileImageUrl": "https://...",
  "region": "BUSAN",
  "phoneNumber": "010-1111-2222",
  "bankName": "신한",
  "bankAccount": "110-***-***"
}
```

**Response 200**: 갱신된 User
**Errors**: 404 / 500

---

### 📌 PATCH /users/me/password 🔒 — 비밀번호 변경

**Body**:
```json
{
  "currentPassword": "...",
  "newPassword": "..."
}
```

**Response 200**: `{}`
**Errors**: 400 (검증) / 401 (현재 비밀번호 불일치) / 404 / 500

---

### 📌 PATCH /users/me/withdraw 🔒 — 회원 탈퇴

**Body**:
```json
{ "reason": "사용 빈도가 낮아요" }
```

**Response 200**: `{}`
**Side effect**: `isDeleted=true`, `deletedAt`, `deletionReason` 기록 + 쿠키 삭제

---

### 📌 PATCH /users/me/client-profiles 🔒 👤CLIENT — 클라이언트 프로필 수정

**Body**:
```json
{
  "nickname": "닉네임",
  "interestCategories": [
    { "group": "IT_COACHING", "category": "WEB" },
    { "group": "PROJECT_REQUEST", "category": "APP" }
  ]
}
```

**Response 200**: 갱신된 ClientProfile

---

### 🆕 GET /users/me/expert-profile 🔒 👤EXPERT — 전문가 프로필 조회

**Response 200** (`data`):
```json
{
  "id": "uuid",
  "isApplied": true,
  "isApproved": true,
  "businessName": "코드잇 에이전시",
  "businessNumber": "***-**-*****",
  "ceoName": "박대표",
  "contactTimeStart": "10:00",
  "contactTimeEnd": "19:00",
  "foundedYear": 2020,
  "employeeMin": 5,
  "employeeMax": 10,
  "description": "...",
  "avgRating": 4.9,
  "reviewCount": 328,
  "specialtyCategories": [{ "group": "PROJECT_REQUEST", "category": "APP" }],
  "techStacks": ["REACT_NATIVE", "TYPESCRIPT"]
}
```

---

### 🆕 PATCH /users/me/expert-profile 🔒 👤EXPERT — 전문가 프로필 수정

**Body**: 위 응답 필드 중 `id/isApplied/isApproved/avgRating/reviewCount` 제외한 모든 필드 (optional)

---

### 🆕 POST /users/me/expert-application 🔒 👤CLIENT — 전문가 신청 (CLIENT → EXPERT)

**Body**: 전문가 프로필 필드 일체
**Response 201**: 신청된 ExpertProfile (`isApplied=true, isApproved=false`)

---

## 3. 메타데이터 (Catalogs)

> 카테고리·기술스택 등 정적 목록

### 📌 GET /catalogs/groups — 서비스 그룹 (IT 코칭 / 프로젝트 의뢰)

**Response 200** (`data`):
```json
{
  "count": 2,
  "items": [
    { "id": "uuid", "name": "IT_COACHING", "label": "IT 코칭" },
    { "id": "uuid", "name": "PROJECT_REQUEST", "label": "프로젝트 의뢰" }
  ]
}
```

### 📌 GET /catalogs/categories — 서비스 카테고리 (WEB/APP/AI/GAME/DATA_ANALYTICS)

**Response 200**: 동일 형태 (5개)

### 📌 GET /catalogs/tech-stacks — 기술 스택 (20개)

**Response 200**: `{ count, items: [{ id, name(enum), label }] }`

---

### 🆕 GET /catalogs/regions — 지역 목록

17개 `Region` enum 반환.

### 🆕 GET /catalogs/business-sectors — 비즈니스 섹터

5개 `BusinessSector` enum 반환 (포트폴리오 작성 시 사용).

---

## 4. 메인 (Main)

> 관련 디자인: 메인 페이지 + 인기 게시글 섹션 `50:5278`

### 🆕 GET /main — 메인 데이터 (배너 + 섹션 + 새로 등록된 서비스)

**Response 200** (`data`):
```json
{
  "banners": [
    { "id": "uuid", "imageUrl": "https://...", "actionUrl": "/" }
  ],
  "sections": [
    {
      "sectionType": "POPULAR_IT_COACHING",
      "title": "가장 많이 찾는 IT 코칭",
      "targetType": "SERVICE",
      "items": [/* ServiceListItem 4개 */]
    },
    {
      "sectionType": "MOVEIT_POPULAR_PROJECT_EXPERT",
      "title": "무빗 인기 프로젝트 의뢰 전문가",
      "targetType": "USER",
      "items": [/* ExpertSummary 4개 */]
    }
    // ... 6개 sectionType 전부
  ],
  "newServices": [/* createdAt DESC 4개 */]
}
```

- `sections`: 어드민이 `main_settings` 테이블에서 큐레이션
- `newServices`: 자동 — `services` 테이블 `createdAt DESC` 상위 4개
- `targetType=SERVICE`: items는 ServiceListItem / `targetType=USER`: items는 ExpertSummary

---

## 5. 서비스 (Services)

> 관련 디자인: 카테고리 페이지(들) `129:14600` / 서비스 상세 `131:14973`

### 🆕 GET /services — 서비스 목록 (필터 + 페이지네이션)

**Query**:
| Param | Type | 예 |
|---|---|---|
| `group` | `ServiceGroupName` | `IT_COACHING` |
| `category` | `ServiceCategoryName` | `WEB` |
| `region` | `Region` | `SEOUL` |
| `priceMin` | `number` | `100000` |
| `priceMax` | `number` | `500000` |
| `techStacks` | `TechStackName[]` (csv) | `REACT,TYPESCRIPT` |
| `sort` | `'latest'\|'popular'\|'price_asc'\|'price_desc'\|'rating'` | `popular` |
| `page` | `number` | `1` |
| `pageSize` | `number` (max 50) | `20` |

**Response 200** (`data`): 페이지네이션 + `items: ServiceListItem[]`

```json
// ServiceListItem
{
  "id": "uuid",
  "title": "안드로이드 / iOS 앱 개발",
  "servicePrice": 380000,
  "workDuration": 30,
  "revisionCount": 3,
  "thumbnailUrl": "https://...",
  "status": "ACTIVE",
  "expert": {
    "id": "uuid",
    "name": "코드잇 에이전시",
    "companyName": "코드잇 에이전시",
    "profileImageUrl": "https://..."
  },
  "categoryRef": { "group": "PROJECT_REQUEST", "category": "APP" },
  "rating": 4.9,
  "reviewCount": 328,
  "isFavorite": false
}
```

---

### 🆕 GET /services/{id} — 서비스 상세

**Response 200** (`data` = `ServiceDetail`):
```json
{
  "id": "uuid",
  "title": "...",
  "workDuration": 30,
  "revisionCount": 3,
  "serviceScope": "기획, 디자인, 개발",
  "servicePrice": 380000,
  "description": "...",
  "preparationNotes": "...",
  "refundPolicy": "...",
  "status": "ACTIVE",
  "categoryRef": { "group": "PROJECT_REQUEST", "category": "APP" },
  "isFavorite": false,
  "expert": { /* ExpertSummary */ },
  "images": [{ "id": "uuid", "url": "https://...", "isMain": true }],
  "techStacks": ["REACT_NATIVE", "TYPESCRIPT"],
  "steps": [{ "order": 1, "title": "...", "description": "..." }],
  "faqs": [{ "id": "uuid", "question": "...", "answer": "..." }],
  "reviews": {
    "items": [/* Review 최대 N개 */],
    "totalCount": 328,
    "averageRating": 4.9
  },
  "recommendedServices": [/* ServiceListItem 4개 */]
}
```

**Errors**: 404 (서비스 없음) / 500

---

### 🆕 GET /services/{id}/reviews — 서비스 리뷰 목록 (페이지네이션)

**Query**: `page`, `pageSize`, `sort?: 'latest'|'rating_desc'`

**Response 200**: `{ items: Review[], pagination }`

---

### 🆕 POST /services 🔒 👤EXPERT — 서비스 등록

**Body**: 위 ServiceDetail에서 `id/expert/rating/reviewCount/reviews/recommendedServices/isFavorite/images.id` 제외 + `imageUrls: string[]`

### 🆕 PATCH /services/{id} 🔒 👤EXPERT (소유자만)

### 🆕 PATCH /services/{id}/status 🔒 👤EXPERT (소유자만) — 상태 변경
**Body**: `{ "status": "PAUSED" }`

### 🆕 DELETE /services/{id} 🔒 👤EXPERT (소유자만) — 종료(`CLOSED`)

---

## 6. 전문가 (Experts)

> 관련 디자인: 전문가 상세 `140:20083` / 메인 "무빗 인기 전문가" 섹션

### 🆕 GET /experts — 전문가 목록 (필터 + 페이지네이션)

**Query**:
| Param | Type |
|---|---|
| `group` | `ServiceGroupName` |
| `category` | `ServiceCategoryName` |
| `region` | `Region` |
| `techStacks` | `TechStackName[]` (csv) |
| `sort` | `'rating'\|'reviews'\|'latest'` |
| `page`, `pageSize` | number |

**Response 200**: `{ items: ExpertDetail[], pagination }` (목록에선 ExpertSummary로 축소해도 OK)

---

### 🆕 GET /experts/{id} — 전문가 상세

**Response 200** (`data` = `ExpertDetail`):
```json
{
  "id": "uuid",
  "name": "코드잇 에이전시",
  "companyName": "코드잇 에이전시",
  "description": "...",
  "profileImageUrl": "https://...",
  "isFavorite": false,
  "stats": {
    "totalReviews": 328,
    "averageRating": 4.9,
    "purchaseRate": 80,
    "completionRate": 100
  },
  "specialtyCategories": [{ "group": "PROJECT_REQUEST", "category": "APP" }],
  "techStacks": ["REACT_NATIVE", "TYPESCRIPT"],
  "portfolios": [/* PortfolioListItem 3개 */],
  "services": [/* ServiceListItem 해당 전문가의 활성 서비스 */]
}
```

---

### 🆕 GET /experts/{id}/portfolios — 전문가 포트폴리오 목록 (페이지네이션)

### 🆕 GET /experts/{id}/reviews — 전문가의 전체 리뷰 목록 (페이지네이션)

---

## 7. 포트폴리오 (Portfolios)

### 🆕 GET /portfolios/{id} — 포트폴리오 상세

**Response 200** (`data` = `PortfolioDetail`):
```json
{
  "id": "uuid",
  "title": "The CNM 교육 플랫폼",
  "thumbnailUrl": "https://...",
  "clientName": "CNM",
  "businessSector": "PUBLIC_INSTITUTION",
  "description": "...",
  "skills": [
    { "stackName": "REACT", "stackType": "FRONTEND" }
  ],
  "images": [{ "id": "uuid", "url": "https://...", "isMain": true }]
}
```

### 🆕 POST /portfolios 🔒 👤EXPERT

**Body**:
```json
{
  "title": "...",
  "description": "...",
  "clientName": "...",
  "businessSector": "PUBLIC_INSTITUTION",
  "imageUrls": ["https://..."],
  "skills": [{ "stackName": "REACT", "stackType": "FRONTEND" }]
}
```

### 🆕 PATCH /portfolios/{id} 🔒 👤EXPERT (소유자만)
### 🆕 DELETE /portfolios/{id} 🔒 👤EXPERT (소유자만)

---

## 8. 주문 (Orders)

> 관련 디자인: 마이페이지 CLIENT/EXPERT `154:33207` `155:48177`

### 🆕 GET /orders 🔒 — 내 주문 목록

**Query**:
| Param | Type | 비고 |
|---|---|---|
| `as` | `'client'\|'expert'` | 역할에 따라 다른 필드 노출 (기본: 본인 role) |
| `status` | `OrderStatus` 또는 csv | 다중 필터 |
| `page`, `pageSize` | number | |

**Response 200**: `{ items: OrderListItem[], pagination }`

```json
// OrderListItem
{
  "id": "uuid",
  "serviceTitle": "...",
  "thumbnailUrl": "https://...",
  "expertName": "코드잇 에이전시",
  "status": "IN_PROGRESS",
  "totalAmount": 418000,
  "startDate": "2026-05-01T00:00:00.000Z",
  "endDate": "2026-06-01T00:00:00.000Z",
  "createdAt": "2026-04-25T10:00:00.000Z"
}
```

---

### 🆕 GET /orders/{id} 🔒 — 주문 상세 (CLIENT/EXPERT 모두 본인 주문만)

**Response 200** (`data` = `OrderDetail`):
```json
{
  "id": "uuid",
  "serviceTitle": "...",
  "thumbnailUrl": "https://...",
  "expertName": "...",
  "status": "IN_PROGRESS",
  "totalAmount": 418000,
  "startDate": "...",
  "endDate": "...",
  "createdAt": "...",
  "service": { /* ServiceListItem */ },
  "agreedServicePrice": 380000,
  "platformFee": 38000,
  "payment": {
    "id": "uuid",
    "method": "CARD",
    "status": "PAID",
    "installmentMonths": 3,
    "paidAt": "..."
  },
  "refund": null
}
```

**Errors**: 403 (남의 주문) / 404

---

### 🆕 POST /orders 🔒 👤CLIENT — 주문 생성

**Body**:
```json
{
  "serviceId": "uuid",
  "agreedServicePrice": 380000,
  "startDate": "2026-05-01T00:00:00.000Z",
  "endDate": "2026-06-01T00:00:00.000Z"
}
```

**Response 201**:
```json
{
  "orderId": "uuid",
  "status": "NEGOTIATING",
  "totalAmount": 418000,
  "platformFee": 38000
}
```

---

### 🆕 PATCH /orders/{id}/status 🔒 — 주문 상태 전이

**Body**: `{ "status": "IN_PROGRESS" }`

전이 규칙 (제약은 백엔드에서):
- `NEGOTIATING` → `IN_PROGRESS` (결제 완료 후) / `CANCEL_REQUESTED`
- `IN_PROGRESS` → `WORK_COMPLETED` (EXPERT) / `DEADLINE_IMMINENT` / `EXPIRED`
- `WORK_COMPLETED` → `PURCHASE_CONFIRMED` (CLIENT)
- `PURCHASE_CONFIRMED` → `SETTLEMENT_REQUESTED` (EXPERT)
- `SETTLEMENT_REQUESTED` → `SETTLEMENT_COMPLETED` (ADMIN)
- 환불 분기: `*` → `REFUND_REQUESTED` → `REFUND_COMPLETED`

---

### 🆕 POST /orders/{id}/confirm 🔒 👤CLIENT — 구매확정

**Response 200**: 갱신된 OrderDetail (status=`PURCHASE_CONFIRMED`, `confirmedAt` 세팅)

---

### 🆕 POST /orders/{id}/settlement-request 🔒 👤EXPERT — 정산 요청

**Response 200**: 갱신된 OrderDetail (status=`SETTLEMENT_REQUESTED`)

---

### 🆕 POST /orders/{id}/refund 🔒 — 환불 요청

**Body**:
```json
{
  "type": "REFUND",
  "reason": "...",
  "refundAmount": 380000
}
```

**Response 200**: 갱신된 OrderDetail + `refund` 채워짐

---

### 🆕 POST /orders/{id}/review 🔒 👤CLIENT — 리뷰 작성

주문 상태가 `PURCHASE_CONFIRMED` 이상일 때만 가능. 1주문 1리뷰.

**Body**:
```json
{
  "rating": 5,
  "content": "..."
}
```

**Response 201**: 생성된 Review

**Errors**: 400 (이미 작성 / 상태 부적합) / 403 / 404

---

## 9. 결제 (Payments)

> 토스/포트원 등 PG 연동 가정

### 🆕 POST /payments 🔒 👤CLIENT — 결제 시작

**Body**:
```json
{
  "orderId": "uuid",
  "method": "CARD",
  "installmentMonths": 3
}
```

**Response 201**: `{ "paymentId", "paymentKey", "redirectUrl" }` (PG로 보낼 정보)

### 🆕 POST /payments/{id}/confirm 🔒 — PG 콜백/승인

**Body**: PG에서 받은 payload (paymentKey, amount 등 검증)

**Response 200**: 갱신된 Payment + Order status `IN_PROGRESS` 전이

---

## 10. 찜 / 관심목록 (Favorites)

> 관련 디자인: 찜페이지 `205:75688`

### 🆕 GET /favorites/services 🔒 — 찜한 서비스 목록

**Response 200**: `{ items: ServiceListItem[], pagination }`

### 🆕 GET /favorites/experts 🔒 — 찜한 전문가 목록

**Response 200**: `{ items: ExpertSummary[], pagination }`

### 🆕 POST /favorites/services/{id} 🔒 — 서비스 찜
**Response 200**: `{}`

### 🆕 DELETE /favorites/services/{id} 🔒 — 찜 해제
**Response 200**: `{}`

### 🆕 POST /favorites/experts/{id} 🔒 — 전문가 찜
### 🆕 DELETE /favorites/experts/{id} 🔒 — 전문가 찜 해제

---

## 11. 최근 본 (Recently Viewed)

### 🆕 GET /recently-viewed/services 🔒 — 최근 본 서비스

**Response 200**: `{ items: ServiceListItem[], pagination }`

### 🆕 POST /recently-viewed/services/{id} 🔒 — 기록 (조회 시 자동 호출)

---

## 12. 커뮤니티 (Community)

> 관련 디자인: 메인 인기 게시글 `50:5278` / 자유게시판 `205:75686`

### 🆕 GET /community/posts — 게시글 목록

**Query**:
| Param | Type | 예 |
|---|---|---|
| `category` | `CommunityCategory` | `FREE` |
| `sort` | `'latest'\|'popular'` | `latest` |
| `search` | `string` | 키워드 |
| `page`, `pageSize` | number | |

**Response 200** (`items`):
```json
{
  "id": "uuid",
  "category": "FREE",
  "title": "...",
  "content": "...",
  "author": {
    "id": "uuid",
    "name": "개발하는 조한준",
    "profileImageUrl": "https://..."
  },
  "likeCount": 233,
  "commentCount": 5,
  "viewCount": 1240,
  "isLiked": false,
  "createdAt": "..."
}
```

---

### 🆕 GET /community/posts/popular — 인기 게시글

메인 페이지의 "MOVIT 인기 게시글" 섹션(`50:5278`)용. 좋아요/조회수 가중 점수로 정렬한 상위 N개.

**Query**: `limit`(default 3)

**Response 200**: `{ count, items: CommunityPost[] }`

---

### 🆕 GET /community/posts/{id} — 게시글 상세 (조회수 +1)

**Response 200** (`data`): `CommunityPost & { comments: CommunityComment[] }`

```json
// CommunityComment
{
  "id": "uuid",
  "parentCommentId": null,
  "content": "...",
  "author": { /* ... */ },
  "likeCount": 5,
  "createdAt": "...",
  "replies": [/* CommunityComment[] (1 depth) */]
}
```

---

### 🆕 POST /community/posts 🔒 — 게시글 작성

**Body**:
```json
{
  "category": "QUESTION",
  "title": "...",
  "content": "..."
}
```

**Response 201**: 생성된 CommunityPost

### 🆕 PATCH /community/posts/{id} 🔒 (작성자만)
### 🆕 DELETE /community/posts/{id} 🔒 (작성자만)

### 🆕 POST /community/posts/{id}/like 🔒
### 🆕 DELETE /community/posts/{id}/like 🔒

### 🆕 POST /community/posts/{id}/comments 🔒
**Body**: `{ "content": "...", "parentCommentId": null }`
**Response 201**: 생성된 CommunityComment

### 🆕 PATCH /community/comments/{id} 🔒 (작성자만)
### 🆕 DELETE /community/comments/{id} 🔒 (작성자만)

---

## 13. 알림 (Notifications)

### 🆕 GET /notifications 🔒 — 알림 목록 (페이지네이션)

**Query**: `type?: NotificationType`, `unreadOnly?: boolean`, `page`, `pageSize`

**Response 200** (`items`):
```json
{
  "id": "uuid",
  "type": "TRANSACTION",
  "category": "PAYMENT_SUCCESS",
  "content": "결제 418,000원이 정상 처리되었어요.",
  "referenceType": "PAYMENT",
  "referenceId": "uuid",
  "isRead": false,
  "createdAt": "..."
}
```

### 🆕 GET /notifications/unread-count 🔒

**Response 200**:
```json
{
  "communityCount": 1,
  "transactionCount": 5,
  "reminderCount": 2
}
```

### 🆕 PATCH /notifications/{id}/read 🔒 — 단건 읽음
### 🆕 PATCH /notifications/read-all 🔒 — 전체 읽음

---

## 14. 채팅 (Chat)

> 관련 디자인: 메세지/채팅 `151:27882`

### 🆕 GET /chat/rooms 🔒 — 채팅방 목록

**Response 200** (`items`):
```json
{
  "id": "uuid",
  "currentService": { "id": "uuid", "title": "..." },
  "opponent": {
    "id": "uuid",
    "name": "코드잇 에이전시",
    "profileImageUrl": "https://..."
  },
  "lastMessage": {
    "id": "uuid",
    "type": "TEXT",
    "content": "...",
    "createdAt": "..."
  },
  "unreadCount": 2
}
```

### 🆕 POST /chat/rooms 🔒 — 채팅방 생성 (서비스 문의)

**Body**: `{ "serviceId": "uuid" }`
**Response 201**: 생성/기존 ChatRoomListItem

### 🆕 GET /chat/rooms/{id}/messages 🔒 — 메시지 목록 (페이지네이션, 역순)

**Query**: `cursor?: string`(messageId), `pageSize`

**Response 200** (`items`):
```json
{
  "id": "uuid",
  "chatRoomId": "uuid",
  "senderId": "uuid",
  "type": "TEXT",
  "systemType": null,
  "content": "...",
  "attachments": [],
  "isRead": false,
  "createdAt": "..."
}
```

### 🆕 POST /chat/rooms/{id}/messages 🔒

**Body**: `{ "type": "TEXT", "content": "...", "attachments": [...] }`
**Response 201**: 생성된 ChatMessage

### 🆕 PATCH /chat/rooms/{id}/read 🔒 — 읽음 처리 (lastReadMessageId 갱신)

---

### 🆕 WS /ws/chat 🔒 — 실시간 채팅 (WebSocket)

- 인증: 쿠키 (handshake 시)
- 이벤트:
  - `subscribe`: `{ roomId }` 룸 입장
  - `message`: 새 메시지 broadcast
  - `read`: 상대가 읽음 처리
- 백엔드 채팅 모듈 ChatGateway에서 처리

---

## 15. FAQ

> 관련 디자인: FAQ `205:75687`

### 🆕 GET /faqs — FAQ 목록

**Query**: `page`, `pageSize`, `search?: string`

**Response 200** (`items`):
```json
{
  "id": "uuid",
  "title": "회원가입은 어떻게 하나요?",
  "content": "...",
  "createdAt": "..."
}
```

---

## 16. 신고 (Reports)

### 🆕 POST /reports 🔒 — 신고하기

**Body**:
```json
{
  "reportedUserId": "uuid",
  "reason": "ABUSE",
  "detail": "...",
  "imageUrls": ["https://..."]
}
```

**Response 201**: 생성된 Report 요약 (id, status=`PENDING`)

---

## 17. 업로드 (Upload)

### 📌 POST /upload/portfolio 🔒 👤EXPERT — 포트폴리오 이미지 업로드

**Body**: `multipart/form-data` (`file`)
**Response 201**: `{ "url": "https://..." }`

### 🆕 POST /upload/profile 🔒 — 프로필 이미지 업로드
### 🆕 POST /upload/service 🔒 👤EXPERT — 서비스 이미지 업로드
### 🆕 POST /upload/community 🔒 — 게시글 첨부 이미지
### 🆕 POST /upload/chat 🔒 — 채팅 첨부 파일

> 공통: 응답은 `{ url }`만 반환. 실제 DB 저장은 각 도메인 API에서 url을 받아 처리.

---

## 18. 헬스체크

### 📌 GET /health — 서비스 상태

**Response 200**: `{ status: "ok", timestamp }`

---

## 부록 A. 디자인-API 매핑

| 디자인 노드 | 화면 | 주요 API |
|---|---|---|
| `50:5278` | 메인 - 인기 게시글 섹션 | `GET /main`, `GET /community/posts/popular` |
| `205:75686` | 자유게시판 | `GET /community/posts?category=FREE` |
| `129:14600` | 카테고리 페이지 | `GET /services?group=...&category=...` |
| `131:14973` | 서비스 상세 | `GET /services/{id}`, `POST /favorites/services/{id}` |
| `140:20083` | 전문가 상세 | `GET /experts/{id}`, `GET /experts/{id}/portfolios` |
| `151:27882` | 메세지/채팅 | `GET /chat/rooms`, `GET /chat/rooms/{id}/messages`, `WS /ws/chat` |
| `154:33207` | 마이페이지 CLIENT | `GET /users/me`, `GET /orders?as=client`, `GET /favorites/*` |
| `155:48177` | 마이페이지 EXPERT | `GET /users/me`, `GET /orders?as=expert`, `GET /users/me/expert-profile` |
| `205:75688` | 찜페이지 | `GET /favorites/services`, `GET /favorites/experts` |
| `205:75687` | FAQ | `GET /faqs` |
| `205:75711` | 블랙리스트 상태 | `GET /users/me`에서 `isBlocked=true` 분기 |
| `64:6675` | 로그인 | `POST /auth/signin` |
| `105:3937` | SNS 가입 (EXPERT) | `GET /auth/{provider}` → `POST /auth/oauth/signup` |
| `112:4089` | SNS 가입 (CLIENT) | `GET /auth/{provider}` → `POST /auth/oauth/signup` |
| `112:4689` | 이메일 회원가입 | `POST /auth/signup` |

---

## 부록 B. 구현 상태 요약

| 도메인 | 📌 구현완료 | 🆕 신규 구현 필요 |
|---|---|---|
| Auth | signup / signin / oauth-signup / google oauth | refresh / signout / kakao / naver |
| Me | get / patch / password / withdraw / client-profiles | expert-profile (get/patch) / expert-application |
| Catalogs | groups / categories / tech-stacks | regions / business-sectors |
| Main | - | get /main (배너+섹션+newServices) |
| Services | - | 전체 (list / detail / CRUD / status / reviews) |
| Experts | - | 전체 |
| Portfolios | - | 전체 |
| Orders | - | 전체 (list / detail / 생성 / 상태전이 / 확정 / 정산 / 환불 / 리뷰) |
| Payments | - | 전체 (PG 연동) |
| Favorites | - | 전체 (services / experts) |
| Recently Viewed | - | 전체 |
| Community | - | 전체 (posts / comments / likes) |
| Notifications | - | 전체 |
| Chat | - | 전체 (REST + WebSocket) |
| FAQ | - | 목록 |
| Reports | - | 작성 |
| Upload | portfolio | profile / service / community / chat |

---

## 부록 C. 참고

- 백엔드 컨벤션: [docs/backend-conventions.md](backend-conventions.md)
- 인증 흐름: [docs/backend-auth-flow.md](backend-auth-flow.md)
- Prisma 모델 개요: [docs/backend-prisma-overview.md](backend-prisma-overview.md)
- Figma 노드 카탈로그: [docs/frontend-figma-references.md](frontend-figma-references.md)
- 웹 mock 데이터: [apps/web/src/mocks/](../apps/web/src/mocks/)
