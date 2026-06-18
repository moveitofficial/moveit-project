import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '62px',
});

export const searchContainer = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '32px',
});

export const titleText = style([
  typography.f40EB,
  { color: vars.color.blue300 },
]);
export const titleBlack = style([
  typography.f40EB,
  { color: vars.color.black500 },
]);

export const decText = style([typography.f16R, { color: vars.color.black100 }]);

export const roundGroup = style({
  margin: '24px 0',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '16px',
});

export const chipLink = style({
  display: 'inline-flex',
});

export const webDataGroup = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '32px',
});

export const dataItem = style([
  typography.f18EB,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
  },
]);

export const dataGroupDecText = style([
  typography.f12EB,
  { color: vars.color.gray200 },
]);

// SVG export가 그림자만큼 좌우 48px씩 투명 여백을 포함해 (486→582), 레이아웃 폭에서 상쇄
export const imageContainer = style({
  marginLeft: '-48px',
  marginRight: '-48px',
  flexShrink: 0,
});
