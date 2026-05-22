import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  padding: '32px',
  textAlign: 'center',
});

export const title = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
    wordBreak: 'keep-all',
  },
]);

export const description = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray500,
    whiteSpace: 'pre-line',
    wordBreak: 'keep-all',
  },
]);

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '12px',
  width: '100%',
});

export const blueButton = style([
  typography.f16B,
  {
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const redButton = style([
  typography.f16B,
  {
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.red200,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const whiteButton = style([
  typography.f16R,
  {
    width: '100%',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'transparent',
    color: vars.color.gray500,
    cursor: 'pointer',
  },
]);
