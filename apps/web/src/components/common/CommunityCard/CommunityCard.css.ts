// import { recipe } from '@vanilla-extract/recipes';
import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '24px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const infoContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '8px',
});

export const dateText = style([
  typography.f12R,
  {
    color: vars.color.gray400,
  },
]);

export const titleText = style([typography.f14EB, { marginBottom: '8px' }]);
export const contentText = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    marginBottom: '12px',
    width: '100%',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
]);

export const communityInfoContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const userInfoContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
});
export const userName = style([typography.f14R]);

export const ImageContents = style({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  objectFit: 'cover',
  objectPosition: 'center',
  display: 'block',
});

export const statsContainer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
});

export const statsItem = style([
  typography.f14EB,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    color: vars.color.black300,
  },
]);
