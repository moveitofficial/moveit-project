import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
});

export const filterSection = style({
  marginTop: '32px',
});

export const tableSection = style({
  marginTop: '24px',
});

export const pagination = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '60px',
});
