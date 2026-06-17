import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: '100%',
  padding: '1.5rem',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '0.75rem',
  boxSizing: 'border-box',
});

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
});

export const serviceGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  minWidth: 0,
});

export const avatar = style({
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  objectFit: 'cover',
  flexShrink: 0,
});

export const avatarFallback = style([
  typography.f12B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
  },
]);

export const titleArea = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  minWidth: 0,
});

export const serviceTitle = style([
  typography.f20B,
  {
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
]);

export const metaText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexShrink: 0,
});

export const actionButton = style([
  typography.f14R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const ratingRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

export const ratingValue = style([
  typography.f24B,
  {
    margin: 0,
  },
]);

export const content = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.black500,
    lineHeight: '1.75rem',
  },
]);
