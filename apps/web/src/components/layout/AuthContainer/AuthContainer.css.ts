import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  width: '100%',
  minHeight: '100vh',
  backgroundColor: vars.color.white,
});

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  maxWidth: '1176px',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
});
