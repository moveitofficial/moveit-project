import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '32px',
  textAlign: 'center',
});

export const title = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'center',
  },
]);

export const successContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '32px',
  boxSizing: 'border-box',
  textAlign: 'center',
});

export const successTitle = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black400,
  },
]);

export const successDescription = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.gray400,
    whiteSpace: 'pre-wrap',
  },
]);

export const primaryButton = style([
  typography.f16B,
  {
    width: '100%',
    padding: '14px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    textDecoration: 'none',
  },
]);

export const secondaryButton = style([
  typography.f14R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: vars.color.gray400,
  },
]);

export const warningIcon = style({
  color: vars.color.red200,
  flexShrink: 0,
});
