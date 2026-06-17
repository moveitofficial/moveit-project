import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const hero = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: '92px',
});

export const heroMain = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '272px',
});

export const heroContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const topRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const breadcrumb = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const favoriteButton = style({
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '6px',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: vars.color.black500,
  flexShrink: 0,
  fontWeight: vars.font.weight.extraBold,
});

export const favoriteButtonActive = style({
  color: vars.color.red200,
});

export const favoriteCount = style([
  typography.f14EB,
  {
    color: vars.color.black500,
  },
]);

export const title = style([
  typography.f32EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const statsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
});

export const newServiceNote = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.blue300,
  },
]);

export const ratingGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
});

export const starList = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
});

export const starIcon = style({
  width: '16px',
  height: '16px',
  color: vars.color.yellow100,
});

export const starIconEmpty = style({
  width: '16px',
  height: '16px',
  color: vars.color.yellow100,
  fill: 'none',
});

export const ratingText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const statText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const purchaseRate = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.blue300,
  },
]);

export const expertBanner = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  padding: '16px 20px',
  borderRadius: '12px',
  backgroundColor: vars.color.blue100,
  marginTop: 'auto',
});

export const expertAvatar = style([
  typography.f16B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
  },
]);

export const expertInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const expertName = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const expertHours = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const heroImageWrapper = style({
  width: '360px',
  height: '272px',
  borderRadius: '12px',
  overflow: 'hidden',
  flexShrink: 0,
});

export const heroImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
