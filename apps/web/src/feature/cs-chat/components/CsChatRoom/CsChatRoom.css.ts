import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const transcript = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  flex: 1,
  overflowY: 'auto',
  padding: '20px 24px',
});
