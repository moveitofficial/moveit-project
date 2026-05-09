import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  height: '100vh',
});

export const main = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  backgroundColor: vars.color.adminBackground,
});

export const content = style({
  flex: 1,
  padding: '24px 32px',
});
