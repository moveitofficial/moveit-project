import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
});

export const searchWrapper = style({
  flexGrow: 1,
  maxWidth: '509px',
  minWidth: '300px',
});
