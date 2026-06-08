import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const button = style({
  color: vars.color.red200,
  cursor: 'pointer',
  flexShrink: 0,
});
