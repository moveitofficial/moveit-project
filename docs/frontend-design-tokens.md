# Frontend Design Tokens

> **다루는 범위**: vanilla-extract 디자인 토큰(`vars`, `typography`) 사용법 · 컬러 팔레트 · 타이포 스케일
> **관련 코드**: [packages/styles/src/tokens.css.ts](../packages/styles/src/tokens.css.ts), [packages/styles/src/typography.css.ts](../packages/styles/src/typography.css.ts)
> **함께 보기**: [frontend-structure.md](frontend-structure.md)
> **최종 수정**: 2026-05-15

색·폰트 raw 값은 절대 컴포넌트에 박지 않는다. **항상 토큰 참조.**

---

## 1. 사용법

### 컬러 — `vars`

```typescript
import { vars } from '@repo/styles/tokens';

export const button = style({
  backgroundColor: vars.color.blue300,
  borderColor: vars.color.line200,
  color: vars.color.black500,
});
```

### 타이포 — `typography`

```typescript
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

// 단일 typography 적용
export const title = typography.f24EB;

// typography + 추가 스타일 조합 (배열 문법)
export const subtitle = style([
  typography.f16R,
  { color: vars.color.gray400 },
]);
```

### Root 레이아웃에서 테마 적용

`themeClass`를 `<html>`에 적용하면 `vars` 참조가 실제 CSS 변수로 풀린다:

```typescript
// apps/web/src/app/layout.tsx
import { themeClass } from '@repo/styles/tokens';
import { nanumSquare } from '@repo/fonts';
import clsx from 'clsx';

<html lang="ko" className={clsx(nanumSquare.variable, themeClass)}>
```

`vars.font.family`는 `var(--font-nanum-square), sans-serif`로 정의돼 있어서, `nanumSquare.variable`이 함께 적용돼야 폰트가 동작한다.

---

## 2. 컬러 팔레트

총 **30개 컬러** 토큰. 스케일별로 그룹화돼 있다.

### Black (텍스트 메인)

| 토큰 | HEX | 용도 |
|---|---|---|
| `black100` | `#6B6B6B` | 보조 텍스트 |
| `black200` | `#525252` | |
| `black300` | `#373737` | |
| `black400` | `#1F1F1F` | |
| `black500` | `#040404` | 메인 텍스트 (가장 진함) |

### Gray (보조 / 비활성)

| 토큰 | HEX |
|---|---|
| `gray50` | `#E0E0E0` |
| `gray100` | `#DEDEDE` |
| `gray200` | `#C4C4C4` |
| `gray300` | `#ABABAB` |
| `gray400` | `#999999` |
| `gray500` | `#808080` |

### Blue (브랜드 / 액션)

| 토큰 | HEX | 용도 |
|---|---|---|
| `blue50` | `#F5FAFF` | 가장 옅은 배경 강조 |
| `blue100` | `#E9F4FF` | |
| `blue200` | `#4DA9FF` | |
| `blue300` | `#1B92FF` | **메인 브랜드 컬러** (버튼·CTA) |
| `blue400` | `#242945` | 다크/네이비 톤 |

### 악센트

| 토큰 | HEX | 용도 |
|---|---|---|
| `yellow100` | `#FFC149` | 강조 (별점 등) |
| `red100` | `#FFEEF0` | 에러 배경 |
| `red200` | `#FF4F64` | 에러 텍스트/포인트 |

### Background (페이지 배경)

| 토큰 | HEX |
|---|---|
| `background100` | `#FCFCFC` |
| `background200` | `#F7F7F7` |
| `background300` | `#EFEFEF` |
| `background400` | `#F4F7FB` |

### Line (구분선)

| 토큰 | HEX | 용도 |
|---|---|---|
| `line100` | `#F2F2F2` | 옅은 구분선 |
| `line200` | `#E6E6E6` | 일반 구분선 (border) |

### Admin 전용

| 토큰 | HEX | 용도 |
|---|---|---|
| `adminMenuBackground` | `#101729` | 사이드바 다크 배경 |
| `adminBackground` | `#F7F8FC` | 어드민 본문 영역 배경 |

> `line` vs `background` 구분: `line`은 1px 보더용으로 약간 더 진함, `background`는 면 채움용.

---

## 3. 타이포그래피 스케일

`typography.f{size}{weight}` 명명. **9 사이즈 × 3 웨이트 = 27개 variant**.

### 사이즈

| 토큰 사이즈 | font-size (rem) | font-size (px) | line-height |
|---|---|---|---|
| 40 | `2.5rem` | 40px | `3.25rem` |
| 32 | `2rem` | 32px | `2.625rem` |
| 24 | `1.5rem` | 24px | `2rem` |
| 20 | `1.25rem` | 20px | `1.75rem` |
| 18 | `1.125rem` | 18px | `1.625rem` |
| 16 | `1rem` | 16px | `1.5rem` |
| 14 | `0.875rem` | 14px | `1.375rem` |
| 12 | `0.75rem` | 12px | `1.125rem` |
| 8 | `0.5rem` | 8px | `0.75rem` |

### 웨이트

| 접미사 | font-weight | 의미 |
|---|---|---|
| `R` | 400 | Regular |
| `B` | 700 | Bold |
| `EB` | 800 | ExtraBold |

### 공통 속성

- `letterSpacing: 0.05em` (모든 variant 동일)
- `fontFamily`는 `themeClass`의 `vars.font.family`에서 자동 적용 (Nanum Square)

### 27개 전체 표

| | R (400) | B (700) | EB (800) |
|---|---|---|---|
| **40** | `f40R` | `f40B` | `f40EB` |
| **32** | `f32R` | `f32B` | `f32EB` |
| **24** | `f24R` | `f24B` | `f24EB` |
| **20** | `f20R` | `f20B` | `f20EB` |
| **18** | `f18R` | `f18B` | `f18EB` |
| **16** | `f16R` | `f16B` | `f16EB` |
| **14** | `f14R` | `f14B` | `f14EB` |
| **12** | `f12R` | `f12B` | `f12EB` |
| **8** | `f8R` | `f8B` | `f8EB` |

---

## 4. 폰트 (NanumSquare)

[packages/fonts/src/index.ts](../packages/fonts/src/index.ts)

```typescript
export const nanumSquare = localFont({
  src: [
    { path: './NanumSquareOTF_acR.otf',  weight: '400', style: 'normal' },
    { path: './NanumSquareOTF_acB.otf',  weight: '700', style: 'normal' },
    { path: './NanumSquareOTF_acEB.otf', weight: '800', style: 'normal' },
  ],
  variable: '--font-nanum-square',
  display: 'swap',
});
```

- 3 weight만 번들됨 (400/700/800). 다른 weight는 사용 불가.
- 적용: `<html className={nanumSquare.variable}>` → CSS 변수 `--font-nanum-square`가 활성화 → `vars.font.family`가 참조.

---

## 5. 새 토큰 추가 시 절차

### 새 컬러 추가
1. [tokens.css.ts](../packages/styles/src/tokens.css.ts)의 `color` 객체에 추가 (기존 스케일에 맞춰 — 새 스케일 만들지 말 것)
2. `vars.color.새토큰`으로 사용

### 새 타이포 사이즈/웨이트 추가
- 기본적으로 **27개로 충분**. 새 사이즈가 정말 필요한지 먼저 검토.
- 추가 시 [typography.css.ts](../packages/styles/src/typography.css.ts)의 `styleVariants`에 같은 형식으로 추가 (`fontSize`, `lineHeight`, `fontWeight: vars.font.weight.XXX`, `letterSpacing: '0.05em'`).

### 절대 하지 말 것
- ❌ 컴포넌트 안에 raw HEX(`#1B92FF`) 사용 → 토큰 추가 후 참조
- ❌ 다른 letter-spacing 값 인라인으로 — 디자인 일관성 깨짐
- ❌ `font-weight: 500/600` 같은 NanumSquare가 지원 안 하는 weight 사용

---

## 6. RoundChip / RectLabel 같은 공유 컴포넌트 패턴 참고

`@repo/ui`의 [RoundChip](../packages/ui/src/RoundChip/RoundChip.css.ts), [RectLabel](../packages/ui/src/RectLabel/RectLabel.css.ts)이 `recipe()` + `createVar()`로 컬러·사이즈를 variants로 분리한 좋은 예시. 토큰 + 동적 CSS 변수 조합 패턴을 참고할 수 있다.

```typescript
const bgColor = createVar();

export const container = recipe({
  base: {
    backgroundColor: `color-mix(in srgb, ${bgColor} 100%, transparent)`,
  },
  variants: {
    color: {
      blue300: { vars: { [bgColor]: vars.color.blue300 } },
      red200:  { vars: { [bgColor]: vars.color.red200 } },
    },
  },
});
```
