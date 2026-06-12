import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  padding: '48px 0 80px',
  boxSizing: 'border-box',
});

export const title = style([
  typography.f32B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 163px)',
  gap: '24px',
});

export const cardButton = style({
  padding: 0,
  border: 'none',
  background: 'none',
  textAlign: 'left',
  color: 'inherit',
  cursor: 'pointer',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '163px',
  textAlign: 'left',
});

export const thumbnailWrapper = style({
  width: '163px',
  height: '163px',
  overflow: 'hidden',
  borderRadius: '8px',
});

export const thumbnail = style({
  width: '163px',
  height: '163px',
  objectFit: 'cover',
});

export const cardTitle = style([
  typography.f14EB,
  {
    display: '-webkit-box',
    width: '163px',
    margin: 0,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    color: vars.color.black500,
    textOverflow: 'ellipsis',
  },
]);
