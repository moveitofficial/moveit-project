import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const summary = style([
  typography.f16B,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    margin: 0,
    color: vars.color.black500,
  },
]);

export const summaryStarIcon = style({
  width: '16px',
  height: '16px',
});

export const sortTabs = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
});

export const sortButton = style([
  typography.f14R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const sortButtonActive = style({
  color: vars.color.blue300,
  fontWeight: vars.font.weight.bold,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  marginTop: '8px',
});

export const reviewCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const reviewHeader = style({
  display: 'grid',
  gridTemplateColumns: '40px 1fr',
  columnGap: '8px',
  rowGap: '4px',
  alignItems: 'center',
});

export const avatar = style({
  gridRow: '1 / 3',
  alignSelf: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const avatarFallback = style([
  typography.f12B,
  {
    gridRow: '1 / 3',
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    lineHeight: '1',
    letterSpacing: '0',
    flexShrink: 0,
  },
]);

export const reviewerName = style([
  typography.f14R,
  {
    gridColumn: '2',
    gridRow: '1',
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const ratingRow = style({
  gridColumn: '2',
  gridRow: '2',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
});

export const starList = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2px',
});

export const starIcon = style({
  width: '16px',
  height: '16px',
});

export const starIconEmpty = style({
  width: '16px',
  height: '16px',
  color: vars.color.yellow100,
  fill: 'none',
});

export const ratingValue = style([
  typography.f14R,
  {
    color: vars.color.black500,
  },
]);

export const content = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
    whiteSpace: 'pre-line',
  },
]);

export const date = style([
  typography.f12R,
  {
    margin: 0,
    marginTop: '4px',
    color: vars.color.gray400,
  },
]);

export const emptyBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  marginTop: '8px',
  padding: '72px 0',
  borderRadius: '16px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
});

export const emptyIllustration = style({
  width: '320px',
  height: '168px',
});

export const emptyText = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const moreButton = style([
  typography.f14R,
  {
    alignSelf: 'center',
    marginTop: '8px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);
