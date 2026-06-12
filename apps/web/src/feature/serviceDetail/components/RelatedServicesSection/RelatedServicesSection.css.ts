import { style } from '@vanilla-extract/css';

export const cardList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '24px',
});

export const cardLink = style({
  textDecoration: 'none',
  color: 'inherit',
});
