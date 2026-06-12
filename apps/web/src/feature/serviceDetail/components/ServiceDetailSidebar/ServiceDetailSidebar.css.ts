import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '360px',
  padding: '24px',
  borderRadius: '12px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  boxSizing: 'border-box',
});

export const priceLabel = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const priceRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: '4px',
});

export const priceValue = style([
  typography.f24EB,
  {
    margin: 0,
    color: vars.color.black500,
    fontFamily: vars.font.family,
    letterSpacing: 'normal',
  },
]);

export const priceUnit = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const infoBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '16px',
  borderRadius: '8px',
  backgroundColor: vars.color.blue50,
});

export const infoRow = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: '12px',
});

export const infoLabel = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    flexShrink: 0,
  },
]);

export const infoValue = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'right',
  },
]);

const actionButtonBase = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '290px',
  padding: '14px',
  alignSelf: 'center',
  borderRadius: '8px',
  boxSizing: 'border-box',
  cursor: 'pointer',
} as const;

export const primaryButton = style([
  typography.f16B,
  actionButtonBase,
  {
    border: 'none',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    textDecoration: 'none',
  },
]);

export const secondaryButton = style([
  typography.f16B,
  actionButtonBase,
  {
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
  },
]);

export const techStackList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '16px',
});

export const techStackTag = style([
  typography.f14R,
  {
    padding: '4px 12px',
    borderRadius: '4px',
    backgroundColor: vars.color.blue50,
    color: vars.color.blue300,
  },
]);
