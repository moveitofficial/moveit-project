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
  padding: '24px',
  gap: '8px',

  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
});

export const label = style({
  color: vars.color.gray400,
});

export const countRow = style({
  display: 'flex',
  alignItems: 'baseline',
});

export const countUnit = style({
  color: vars.color.gray400,
});

export const countColor = styleVariants({
  blue300: { color: vars.color.blue300 },
  red200: { color: vars.color.red200 },
  yellow100: { color: vars.color.yellow100 },
});

export const subtext = style({
  color: vars.color.gray400,
});
