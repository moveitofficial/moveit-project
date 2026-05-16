# Frontend Structure (web · admin)

> **다루는 범위**: `apps/web`, `apps/admin`의 폴더 구조 · 도메인 분리 · 의존성 방향 · `page.tsx` 패턴
> **관련 코드**: [apps/web/src/](../apps/web/src/), [apps/admin/src/](../apps/admin/src/)
> **함께 보기**: [frontend-design-tokens.md](frontend-design-tokens.md)
> **최종 수정**: 2026-05-15

web과 admin은 **같은 features 패턴**을 쓴다. 원칙 90%가 동일하므로 한 문서에서 본다. 차이는 마지막 두 섹션(web 특화 / admin 특화)에 정리.

---

## 1. 핵심 원칙 3가지

### 1.1 모든 도메인 자산은 `features/<도메인>/`에 모은다

UI · API · 훅 · 타입 · 상수를 한 폴더에. 도메인 통째로 옮기거나 삭제하기 쉽게.

### 1.2 `app/`은 라우팅만

`page.tsx`는 **fetch + features 컴포넌트 조립**만. 비즈니스 로직 작성 금지.

### 1.3 올림 규칙 (Promotion Rule)

- 처음엔 무조건 `features/<도메인>/components/`에 둔다
- **2곳 이상**에서 쓰이는 순간 → `components/common/`(web) / `components/`(admin)로 승격
- **미리 공통화 금지**

---

## 2. 폴더 구조 개요

```
apps/<web|admin>/src/
├── app/                          # 라우팅만
│   └── (라우트 그룹별 페이지)
│
├── components/
│   ├── layout/                   # 앱 전역 레이아웃 (Header·Footer / Sidebar·PageHeader)
│   └── common/                   # 진짜 도메인 무관 공통 (2곳 이상 쓰여야 생성)
│
├── features/                     # 도메인별 모든 것
│   └── <도메인>/
│       ├── components/           # 도메인 UI
│       ├── api.ts                # API 호출 래퍼 (mock 분기 포함)
│       ├── queries.ts            # react-query 훅
│       ├── constants.ts          # 라벨, enum 매핑
│       ├── types.ts              # 도메인 타입
│       └── schema.ts             # (선택) zod 스키마
│
├── lib/                          # 순수 유틸 (format, cn 등)
├── hooks/                        # 도메인 무관 공통 훅
├── stores/                       # 전역 클라이언트 상태 (zustand)
├── mocks/                        # 더미 데이터 (포트폴리오 단계엔 핵심)
└── types/                        # 전역/앰비언트 타입만
```

**만들지 않는 폴더**: `containers/`, `services/`, `domains/`, `constants/`, `components/ui/` (디자인 시스템은 [`@repo/ui`](../packages/ui/) 사용).

---

## 3. features/<도메인>/ 표준 구성

```
features/users/
├── components/         # 도메인 UI (.tsx + .css.ts 콜로케이션)
│   ├── UserTable.tsx
│   ├── UserTable.css.ts
│   ├── UserFilter.tsx
│   └── UserDetailView.tsx
├── api.ts              # API 호출 (mock 분기 포함)
├── queries.ts          # react-query 훅
├── constants.ts        # 라벨, enum
├── types.ts            # 도메인 타입
└── schema.ts           # (선택) zod 스키마
```

### api.ts — mock 분기 패턴

포트폴리오 단계라 실제 API 대신 mock으로 동작:

```typescript
import { usersApi } from '@repo/api';
import { mockUsers } from '@/mocks/users';

export const fetchUsers = async () => {
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') return mockUsers;
  return usersApi.list();
};
```

### queries.ts — react-query 훅

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from './api';

export const useUsersQuery = () =>
  useQuery({ queryKey: ['users'], queryFn: fetchUsers });
```

### constants.ts — 라벨/enum

```typescript
export const USER_STATUS_LABEL = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  DELETED: '탈퇴',
} as const;
```

---

## 4. 의존성 방향 (금지 규칙)

```
app  ──→  features  ──→  lib
  │           │
  │           └──→  components/layout
  │
  ├───→  components/layout  ──→  lib
  ├───→  stores
  └───→  hooks
```

**금지**:
- ❌ `components/` → `features/` import
- ❌ `lib/` → 다른 폴더 import (순수 유지)
- ❌ `features/users/` → `features/orders/` 직접 import (한쪽 도메인에서 다른 도메인 컴포넌트 사용 금지)
- 필요해지면 `components/common/`(web) 또는 `components/`(admin)로 승격

**유일한 예외**: web의 `features/main/`은 메인 페이지 조립을 위해 다른 도메인 컴포넌트 import 허용. admin엔 해당 예외 없음.

---

## 5. 타입 정의 위치

| 타입 종류 | 위치 | 예시 |
|---|---|---|
| 도메인 타입 (90%) | `features/<도메인>/types.ts` | `User`, `Order`, `UserStatus` |
| 컴포넌트 props | 컴포넌트 파일 안 | `type Props = { ... }` (export 안 함) |
| 전역/앰비언트 타입 (10%) | `types/` | `static-assets.d.ts`, env 타입 |
| 서버 응답 타입 | `@repo/api`에서 import | `import type { UserDto } from '@repo/api'` |

```typescript
// features/users/types.ts
import type { UserDto } from '@repo/api';

export type UserListItem = Pick<UserDto, 'id' | 'name' | 'status'>;
export type UserFilter = { search?: string };
```

---

## 6. `page.tsx` 표준 패턴

```typescript
// app/(dashboard)/users/page.tsx
import { fetchUsers } from '@/features/users/api';
import { UserTable } from '@/features/users/components/UserTable';
import { UserFilter } from '@/features/users/components/UserFilter';

export default async function UsersPage() {
  const users = await fetchUsers();
  return (
    <>
      <UserFilter />
      <UserTable users={users} />
    </>
  );
}
```

규칙:
- 서버에서 데이터 fetch (`features/<도메인>/api.ts` 사용)
- `features/<도메인>/components/`에서 UI import해 조립
- 페이지 폴더엔 `page.tsx`, `layout.tsx`, `loading.tsx` 등 **Next.js 특수 파일만**

---

## 7. 스타일 (vanilla-extract)

`.css.ts`는 컴포넌트 옆에 콜로케이션:

```
features/users/components/
├── UserTable.tsx
├── UserTable.css.ts
└── UserFilter.tsx
```

색·폰트는 항상 토큰 참조. 디자인 시스템 토큰 사용법은 [frontend-design-tokens.md](frontend-design-tokens.md) 참고.

---

## 8. 라우트 처리 — typedRoutes

`next.config.ts`에서 `typedRoutes: true` 활성화됨 → `<Link href="...">`가 타입 체크된다. **`routes.ts` 같은 상수 파일은 만들지 않는다.**

---

## 9. web 특화

### 라우트 그룹

web은 헤더/푸터 표시 여부가 페이지마다 달라서 라우트 그룹으로 분리:

```
app/
├── (with-header)/         # 헤더+푸터 있는 페이지
│   ├── layout.tsx
│   ├── experts/
│   └── community/
├── (auth)/                # 헤더 없는 로그인 페이지
│   ├── layout.tsx
│   ├── login/
│   └── signup/
└── (full-screen)/         # 채팅처럼 풀스크린
    ├── layout.tsx
    └── chat/
```

### `features/main/` 예외

메인 페이지는 인기 전문가·추천 서비스·커뮤니티 인기글 등 **여러 도메인을 조합**한다. 따라서 다른 features 컴포넌트 import가 허용되는 **유일한 도메인**.

```
features/main/
├── components/
│   ├── HeroBanner.tsx
│   ├── PopularExpertsSection.tsx     # features/experts 컴포넌트 재사용
│   └── RecommendedServicesSection.tsx
└── api.ts                             # 메인 전용 집계 API
```

### 도메인 매핑 (mocks → features)

| `mocks/` 파일 | `features/` 폴더 | 비고 |
|---|---|---|
| `user.ts` | `auth/` + `user/` | 인증 따로, 프로필 따로 |
| `experts.ts` | `experts/` | 전문가 탐색·상세 |
| `portfolios.ts` | `portfolios/` | 또는 `experts/`에 흡수 |
| `services.ts` | `services/` | 서비스 카테고리 |
| `community.ts` | `community/` | 커뮤니티 |
| `chat.ts` | `chat/` | 채팅 |
| `orders.ts` | `orders/` | 주문/의뢰 |
| `reviews.ts` | `reviews/` | 리뷰 |
| `favorites.ts` | `favorites/` | 찜 |
| `notifications.ts` | `notifications/` | 알림 |
| `main.ts` | `main/` | 메인 페이지 |
| `metadata.ts` | `lib/metadata.ts` 또는 features별 분배 | 공통 메타 |

### 클라이언트 상태가 많음

검색·필터·무한스크롤·채팅 등 인터랙션이 많아 도메인별 store가 종종 필요:

```typescript
// features/experts/store.ts
import { create } from 'zustand';

export const useExpertFilterStore = create<{
  category: string | null;
  setCategory: (c: string | null) => void;
}>((set) => ({
  category: null,
  setCategory: (category) => set({ category }),
}));
```

전역 UI(모바일 메뉴 등)만 [stores/ui-store.ts](../apps/web/src/stores/ui-store.ts).

---

## 10. admin 특화

### 라우트 그룹

admin은 2개로 깔끔:
- `(auth)/login` — 헤더 없는 로그인
- `(dashboard)/<도메인>` — 사이드바·헤더 있는 일반 페이지

### 도메인 목록 (데이터 관리 중심)

users, orders, experts, managers, refunds, settlements, services, reports, statistics, cs, faqs, dashboard, main-settings

### Sidebar / PageHeader 동기화

새 도메인 페이지 추가 시 **두 파일을 같이 갱신**:
- [apps/admin/src/components/layout/Sidebar/Sidebar.tsx](../apps/admin/src/components/layout/Sidebar/Sidebar.tsx) — `menuGroups` 배열
- [apps/admin/src/components/layout/PageHeader/PageHeader.tsx](../apps/admin/src/components/layout/PageHeader/PageHeader.tsx) — `ROUTE_INFO` 맵 (breadcrumb + title)

### 다크 사이드바

- `vars.color.adminMenuBackground` (#101729) — 사이드바
- `vars.color.adminBackground` (#F7F8FC) — 본문 배경

---

## 11. 자주 하는 실수

- ❌ `app/`에 컴포넌트 작성 → `features/<도메인>/components/`로
- ❌ 도메인 UI를 `components/`에 작성 → `features/<도메인>/components/`로
- ❌ 도메인 타입을 `types/`에 정의 → `features/<도메인>/types.ts`로
- ❌ `features/users/`에서 `features/orders/` 직접 import → `components/`로 승격
- ❌ container 폴더 만들기 → `page.tsx`가 그 역할
- ❌ 미리 공통화 → 2곳에서 쓰일 때 승격
- ❌ admin에 새 라우트만 만들고 Sidebar/PageHeader 갱신 안 함 → breadcrumb·메뉴 깨짐
- ❌ `<Link href="/users">` 문자열로 routes 상수 파일 만들기 → typedRoutes로 충분
