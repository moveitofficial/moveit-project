import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

const THUMB_SIZE_DEFAULT = 163;
const THUMB_SIZE_LARGE = 276;

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
  gridTemplateColumns: `repeat(4, ${String(THUMB_SIZE_DEFAULT)}px)`,
  gap: '24px',
});

export const gridLarge = style({
  display: 'grid',
  gridTemplateColumns: `repeat(4, ${String(THUMB_SIZE_LARGE)}px)`,
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
  width: `${String(THUMB_SIZE_DEFAULT)}px`,
  textAlign: 'left',
});

export const cardLarge = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: `${String(THUMB_SIZE_LARGE)}px`,
  textAlign: 'left',
});

export const thumbnailWrapper = style({
  width: `${String(THUMB_SIZE_DEFAULT)}px`,
  height: `${String(THUMB_SIZE_DEFAULT)}px`,
  overflow: 'hidden',
  borderRadius: '8px',
});

export const thumbnailWrapperLarge = style({
  width: `${String(THUMB_SIZE_LARGE)}px`,
  height: `${String(THUMB_SIZE_LARGE)}px`,
  overflow: 'hidden',
  borderRadius: '8px',
});

export const thumbnail = style({
  width: `${String(THUMB_SIZE_DEFAULT)}px`,
  height: `${String(THUMB_SIZE_DEFAULT)}px`,
  objectFit: 'cover',
});

export const thumbnailLarge = style({
  width: `${String(THUMB_SIZE_LARGE)}px`,
  height: `${String(THUMB_SIZE_LARGE)}px`,
  objectFit: 'cover',
});

export const cardTitle = style([
  typography.f14EB,
  {
    display: '-webkit-box',
    width: `${String(THUMB_SIZE_DEFAULT)}px`,
    margin: 0,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    color: vars.color.black500,
    textOverflow: 'ellipsis',
  },
]);

export const cardTitleLarge = style([
  typography.f14EB,
  {
    display: '-webkit-box',
    width: `${String(THUMB_SIZE_LARGE)}px`,
    margin: 0,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    color: vars.color.black500,
    textOverflow: 'ellipsis',
  },
]);
