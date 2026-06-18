import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { globalStyle, style } from '@vanilla-extract/css';

export const editor = style({
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
  backgroundColor: vars.color.white,
});

export const toolbar = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  padding: '8px 12px',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const group = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '2px',
});

export const button = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  border: 'none',
  borderRadius: '4px',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.gray50,
  },
});

// 현재 선택/커서에 적용된 서식 버튼 표시.
export const buttonActive = style({
  backgroundColor: vars.color.blue50,
  color: vars.color.blue300,
});

export const area = style([
  typography.f14R,
  {
    minHeight: '160px',
    maxHeight: '320px',
    overflowY: 'auto',
    padding: '16px',
    color: vars.color.black500,
    lineHeight: 1.6,
    outline: 'none',
    selectors: {
      '&:empty::before': {
        content: 'attr(data-placeholder)',
        color: vars.color.gray400,
      },
    },
  },
]);

globalStyle(`${area} ul`, {
  listStyleType: 'disc',
  paddingLeft: '24px',
});

globalStyle(`${area} ol`, {
  listStyleType: 'decimal',
  paddingLeft: '24px',
});
