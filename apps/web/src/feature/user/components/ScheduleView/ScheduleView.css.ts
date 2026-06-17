import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const heading = style([
  typography.f18EB,
  { margin: '0 0 17px', color: vars.color.black500 },
]);

export const toolbar = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
  padding: '16px 24px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const filters = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '32px',
});

const tabButton = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  border: 'none',
  padding: 0,
  backgroundColor: 'transparent',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const;

// 선택 시 ExtraBold로 굵어져도 너비가 변하지 않도록, bold 폭을 미리 확보한다.
const reserveBoldWidth = {
  '::after': {
    content: 'attr(data-label)',
    height: 0,
    overflow: 'hidden',
    visibility: 'hidden',
    fontWeight: vars.font.weight.extraBold,
  },
} as const;

export const filterButton = style([
  typography.f16R,
  tabButton,
  reserveBoldWidth,
  { color: vars.color.gray400 },
]);

export const filterButtonActive = style({
  color: vars.color.black500,
  fontWeight: vars.font.weight.extraBold,
});

export const sorts = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
});

export const sortButton = style([
  typography.f12R,
  tabButton,
  reserveBoldWidth,
  { color: vars.color.gray400 },
]);

export const sortButtonActive = style({
  color: vars.color.blue300,
  fontWeight: vars.font.weight.extraBold,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const sentinel = style({
  height: '1px',
});

export const statusMessage = style([
  typography.f16R,
  { margin: 0, color: vars.color.gray400 },
]);

export const errorMessage = style([
  typography.f16R,
  { margin: 0, color: vars.color.red200 },
]);
