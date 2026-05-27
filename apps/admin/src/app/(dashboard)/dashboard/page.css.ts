import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const bottomRow = style({
  display: 'flex',
  gap: '24px',
  alignItems: 'flex-start',
});

export const pendingCol = style({
  flex: 1,
  minWidth: 0,
});

export const activityCol = style({
  flex: 1,
  minWidth: 0,
});
