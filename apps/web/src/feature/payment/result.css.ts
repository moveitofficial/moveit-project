import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  minHeight: '480px',
  padding: '80px 0',
  textAlign: 'center',
});

export const title = style([
  typography.f24EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const description = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const actions = style({
  display: 'flex',
  gap: '12px',
  marginTop: '12px',
});

export const primaryLink = style([
  typography.f16B,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    padding: '0 24px',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    textDecoration: 'none',
  },
]);

export const secondaryLink = style([
  typography.f16B,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '48px',
    padding: '0 24px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    textDecoration: 'none',
  },
]);
