import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '100%',
  padding: '48px 0 80px',
  boxSizing: 'border-box',
});

export const heroSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const heroControls = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
});

export const categoryFilters = style({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '8px',
});

export const heroTextGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const heroEyebrow = style([
  typography.f14EB,
  {
    color: vars.color.blue300,
  },
]);

export const heroTitle = style([
  typography.f32EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const heroDescription = recipe({
  base: {
    margin: 0,
    color: vars.color.gray400,
  },
  variants: {
    weight: {
      regular: typography.f14R,
      bold: typography.f14B,
    },
  },
  defaultVariants: {
    weight: 'bold',
  },
});


export const categoryChipButton = style({
  display: 'inline-flex',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
});

export const categoryChip = style([
  typography.f16R,
  {
    color: vars.color.black500,
  },
]);

export const categoryChipActive = style({
  color: vars.color.white,
});

export const featuredBand = style({
  width: '100vw',
  marginLeft: 'calc(-50vw + 50%)',
  backgroundColor: vars.color.blue50,
  padding: '80px 0',
  display: 'flex',
  justifyContent: 'center',
  boxSizing: 'border-box',
});

export const featuredSection = style({
  width: '100%',
  maxWidth: '1176px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const featuredHeader = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const featuredTitle = style([
  typography.f20EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const featuredDescription = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const featuredCardList = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '24px',
});

export const listSection = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '24px',
});

export const listContent = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const sortTabs = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '16px',
});

export const sortTab = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    textDecoration: 'none',
  },
]);

export const sortTabActive = style({
  fontWeight: vars.font.weight.bold,
  color: vars.color.blue300,
});

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 276px)',
  gap: '24px',
});

export const pagination = style({
  alignSelf: 'center',
});
