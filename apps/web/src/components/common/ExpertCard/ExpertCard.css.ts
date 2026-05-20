import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '276px',
  height: '170px',
  padding: '24px 58px 24px 24px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  boxSizing: 'border-box',
  overflow: 'visible',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const avatar = style({
  position: 'relative',
  flexShrink: 0,
  width: '40px',
  height: '40px',
  borderRadius: '9999px',
  overflow: 'hidden',
});

export const avatarImage = style({
  width: '40px',
  height: '40px',
  objectFit: 'cover',
});

export const headerText = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const title = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const subtitle = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
]);

export const tagList = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'nowrap',
  marginRight: '-58px',
  overflow: 'visible',
});

export const footer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const starIcon = style({
  width: '16px',
  height: '16px',
});

export const ratingValue = style([
  typography.f14R,
  {
    color: vars.color.black500,
  },
]);

export const reviewLabel = style([
  typography.f14R,
  {
    color: vars.color.gray500,
  },
]);
