import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const topRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  marginBottom: '0.5rem',
});

export const postMeta = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.5rem',
  minWidth: 0,
  flex: 1,
});

export const postTitle = style([
  typography.f14EB,
  {
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: vars.color.black500,
    textDecoration: 'none',
  },
]);

export const actionsRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.75rem',
  flexShrink: 0,
});

export const actionButton = style([
  typography.f12R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
    textDecoration: 'none',
  },
]);

export const dateText = style([
  typography.f12R,
  {
    color: vars.color.gray400,
  },
]);

export const commentContent = style([
  typography.f14R,
  {
    margin: '0 0 0.75rem',
    color: vars.color.gray400,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
]);

export const likeRow = style([
  typography.f14EB,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '0.25rem',
    color: vars.color.black300,
  },
]);
