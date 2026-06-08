import { style } from '@vanilla-extract/css';

export const wrapper = style({
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
});
