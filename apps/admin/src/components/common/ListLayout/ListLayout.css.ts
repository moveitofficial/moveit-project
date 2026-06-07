import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const filterSection = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '8px',
});

export const tableSection = style({
  marginTop: '24px',
  flex: '1 1 0',
  minHeight: 0,
  overflowY: 'auto',
});

export const pagination = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '60px',
});
