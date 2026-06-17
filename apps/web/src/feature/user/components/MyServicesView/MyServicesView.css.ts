import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const title = style([
  typography.f20B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const registerLink = style([
  typography.f14R,
  {
    padding: '8px 16px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    textDecoration: 'none',
  },
]);

export const emptyBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  minHeight: '240px',
  padding: '40px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const emptyText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
    whiteSpace: 'pre-wrap',
  },
]);

export const primaryButton = style([
  typography.f16B,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 40px',
    borderRadius: '8px',
    backgroundColor: vars.color.black500,
    color: vars.color.white,
    textDecoration: 'none',
  },
]);

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// 클릭 시 상세로 이동하는 본문 영역(버튼).
export const cardBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'none',
  textAlign: 'left',
  cursor: 'pointer',
});

export const thumb = style({
  width: '100%',
  aspectRatio: '276 / 180',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: vars.color.background300,
});

export const thumbImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const chips = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '4px',
});

export const chip = style([
  typography.f12R,
  {
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: vars.color.blue50,
    color: vars.color.blue300,
  },
]);

export const cardTitle = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
]);

export const ratingRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
});

export const starIcon = style({
  flexShrink: 0,
});

export const ratingText = style([
  typography.f12R,
  {
    color: vars.color.gray400,
  },
]);

export const price = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.blue300,
  },
]);

export const cardFooter = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: '8px',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const statusActive = style([
  typography.f12B,
  {
    color: vars.color.blue300,
  },
]);

export const statusPaused = style([
  typography.f12B,
  {
    color: vars.color.gray400,
  },
]);

export const actions = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const actionBtn = style([
  typography.f12R,
  {
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
    textDecoration: 'none',
  },
]);

export const actionDelete = style([
  typography.f12R,
  {
    border: 'none',
    background: 'none',
    color: vars.color.red200,
    cursor: 'pointer',
  },
]);

// 상황별 모달(삭제/판매중지 × 차단/확인)
export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  padding: '32px 24px',
  textAlign: 'center',
});

export const modalTitle = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const modalText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    whiteSpace: 'pre-wrap',
  },
]);

export const modalPrimary = style([
  typography.f16B,
  {
    width: '100%',
    padding: '14px 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const modalSecondary = style([
  typography.f14R,
  {
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);
