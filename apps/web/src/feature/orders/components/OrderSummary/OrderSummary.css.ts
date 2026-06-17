import { vars } from '@repo/styles/tokens';
import { style, styleVariants } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '24px',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '94px',
  padding: '20px',
  gap: '4px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const label = style({
  color: vars.color.gray400,
});

export const countRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: '4px',
});

export const count = styleVariants({
  blue300: { color: vars.color.blue300 },
  yellow100: { color: vars.color.yellow100 },
  black500: { color: vars.color.black500 },
  red200: { color: vars.color.red200 },
});

export const countUnit = style({
  color: vars.color.gray400,
});
