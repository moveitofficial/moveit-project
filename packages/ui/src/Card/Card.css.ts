import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const card = style({
  width: '276px',
  height: '356px',
  display: 'flex',
  flexDirection: 'column',
});

export const clickable = style({
  cursor: 'pointer',
});

export const thumbnailWrapper = style({
  position: 'relative',
  width: '276px',
  height: '176px',
  borderRadius: '12px',
  overflow: 'hidden',
  flexShrink: 0,
  marginBottom: '16px',
});

export const thumbnail = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

export const techStackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
  marginBottom: '16px',
});

export const title = style([
  typography.f16EB,
  {
    color: vars.color.black300,
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'keep-all',
  },
]);

export const ratingRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  marginBottom: '8px',
});

export const starIcon = style({
  width: '16px',
  height: '16px',
});

export const rating = style([
  typography.f14R,
  { color: vars.color.black500 },
]);

export const reviewCount = style([
  typography.f14R,
  { color: vars.color.gray400 },
]);

export const price = style([
  typography.f18EB,
  { color: vars.color.blue300, marginBottom: '8px' },
]);

export const expertName = style([
  typography.f14R,
  { color: vars.color.gray400 },
]);
