import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)', // 부모 중앙 기준으로 좌측까지 밀어냄
  backgroundColor: vars.color.black500,
  padding: '86px 0',
  marginTop: '88px',
  display: 'flex',
  justifyContent: 'center',
});

export const innerContainer = style({
  width: '100%',
  maxWidth: '1176px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const titleTextGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const titleText = style([
  typography.f40EB,
  {
    color: vars.color.white,
  },
]);

export const titleColor = style({
  color: vars.color.yellow100,
});

export const desColor = style({
  color: vars.color.blue100,
});

export const btn = style([
  typography.f16B,
  {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    padding: '14px 20px',
    borderRadius: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: vars.color.yellow100,
  },
]);
