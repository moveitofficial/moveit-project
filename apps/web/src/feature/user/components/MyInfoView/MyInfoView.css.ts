import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  fontFamily: vars.font.family,
});

export const title = style({
  fontFamily: vars.font.family,
  fontWeight: vars.font.weight.extraBold,
  fontSize: '18px',
  color: vars.color.black500,
});

export const card = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '40px',
  width: 'fit-content',
  maxWidth: '100%',
  minWidth: 0,
  padding: '40px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  backgroundColor: vars.color.white,
  boxSizing: 'border-box',
});

export const fields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  width: '636px',
  flexShrink: 0,
  minWidth: 0,
});

export const providerList = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const providerBadge = style([
  typography.f14B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
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
