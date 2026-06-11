import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const canvas = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  margin: '-32px',
  padding: '32px',
  backgroundColor: vars.color.white,
});
