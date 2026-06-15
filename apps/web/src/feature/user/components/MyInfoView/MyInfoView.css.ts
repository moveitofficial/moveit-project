import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.87rem',
  width: '100%',
  fontFamily: vars.font.family,
});

export const title = style({
  fontFamily: vars.font.family,
  fontWeight: vars.font.weight.extraBold,
  fontSize: '18px',
  color: vars.color.black500,
  padding: '0',
});

export const card = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '2.625rem 2.5rem 2.5rem 2.5rem',
  width: 'fit-content',
  maxWidth: '100%',
  minWidth: 0,
  gap: '2.5rem',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  boxSizing: 'border-box',
});

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  width: '39.75rem',
  flexShrink: 0,
  minWidth: 0,
});

export const providerList = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

export const providerBadge = style([
  typography.f14B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    aspectRatio: 1 / 1,
    borderRadius: '9999px',
    border: `1px solid ${vars.color.line200}`,
    color: vars.color.gray400,
    backgroundColor: vars.color.white,
  },
]);

export const providerBadgeActive = style({
  borderColor: vars.color.blue300,
  color: vars.color.blue300,
  backgroundColor: vars.color.blue50,
});

export const savedDetailChips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'flex-start',
});
