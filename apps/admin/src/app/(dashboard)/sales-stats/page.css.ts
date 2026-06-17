import { style } from '@vanilla-extract/css';

export const container = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const twoColGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
});
