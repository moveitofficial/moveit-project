import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const starButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  lineHeight: 0,
});

export const starButtonReadonly = style({
  cursor: 'default',
});

export const icon = style({
  width: '1rem',
  height: '1rem',
});

export const iconEmpty = style({
  color: vars.color.line200,
});
