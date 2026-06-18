import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '24px',
  height: 'calc(100vh - 220px)',
  minHeight: '560px',
  padding: '24px 0',
  boxSizing: 'border-box',
});
