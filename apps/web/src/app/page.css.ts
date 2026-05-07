import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const fontGroup = style({
  fontWeight: vars.font.weight.regular,
  color: vars.color.gray500,
});

export const heading = style({
  color: vars.color.black500,
});

export const accent = style({
  color: vars.color.blue300,
});

export const danger = style({
  color: vars.color.red200,
});
