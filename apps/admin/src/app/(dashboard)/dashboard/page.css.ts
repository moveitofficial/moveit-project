import { style } from '@vanilla-extract/css';

export const page = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  overflow: 'hidden',
  minHeight: 0,
});

export const bottomRow = style({
  flex: 1,
  display: 'flex',
  gap: '24px',
  overflow: 'hidden',
  minHeight: 0,
});

export const table = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
});
