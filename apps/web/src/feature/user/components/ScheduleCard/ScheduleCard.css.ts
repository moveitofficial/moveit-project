import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '40px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  backgroundColor: vars.color.white,
});

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '6px',
});

export const title = style([typography.f14EB, { color: vars.color.black500 }]);

export const schedule = style([typography.f14R, { color: vars.color.gray400 }]);

export const aside = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  flexShrink: 0,
});

export const amount = style([typography.f14EB, { color: vars.color.black500 }]);

export const actions = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
});

const buttonBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '38px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  backgroundColor: vars.color.white,
  color: vars.color.black500,
  cursor: 'pointer',
} as const;

export const button = style([
  typography.f12B,
  buttonBase,
  { width: '72px', padding: '4px 0' },
]);

export const requestButton = style([
  typography.f12B,
  buttonBase,
  { width: '93px', padding: '4px 12px' },
]);
