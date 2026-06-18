import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const modalPanel = style({
  height: 'min(90vh, 1020px)',
  // 베이스 Modal의 maxHeight(820)를 이 모달에서만 덮어쓴다.
  maxHeight: 'min(90vh, 1020px)',
});

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '20px 24px',
  borderBottom: `1px solid ${vars.color.line200}`,
  flexShrink: 0,
});

export const expertBanner = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  minWidth: 0,
});

export const expertAvatar = style([
  typography.f16B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
  },
]);

export const expertInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

export const expertName = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const expertHours = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const headerActions = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  flexShrink: 0,
});

export const consultButton = style([
  typography.f16B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
]);

export const closeButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  padding: 0,
  border: 'none',
  borderRadius: '8px',
  background: 'none',
  color: vars.color.black500,
  cursor: 'pointer',
});

// 왼쪽은 고정, 오른쪽(이미지)만 독립 스크롤되도록 행 전체가 패널 높이를 채운다.
export const contentRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  flex: 1,
  minHeight: 0,
});

export const leftPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '320px',
  flexShrink: 0,
  padding: '24px',
  borderRight: `1px solid ${vars.color.line200}`,
  boxSizing: 'border-box',
  overflowY: 'auto',
});

export const rightPanel = style({
  flex: 1,
  minWidth: 0,
  padding: '24px',
  backgroundColor: vars.color.background100,
  boxSizing: 'border-box',
  overflowY: 'auto',
});

export const title = style([
  typography.f20EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const description = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray500,
    whiteSpace: 'pre-wrap',
  },
]);

export const metaSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const metaSectionTitle = style([
  typography.f14B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const tagList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px',
});

export const tagChip = style([
  typography.f16R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: '100px',
    backgroundColor: vars.color.blue100,
    color: vars.color.black500,
    cursor: 'default',
  },
]);

export const imageStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const portfolioImage = style({
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
});

export const loadingState = style([
  typography.f16R,
  {
    margin: 0,
    padding: '48px 24px',
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);
