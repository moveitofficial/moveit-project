import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
  padding: '32px',
});

export const top = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
});

export const title = style({
  margin: 0,
  color: vars.color.black400,
  textAlign: 'center',
});

export const statusMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const errorMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
    textAlign: 'center',
  },
]);

export const infoSections = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
});

export const infoBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '318px',
});

export const sectionTitle = style({
  color: vars.color.black500,
});

export const infoRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

export const rowLabel = style({
  color: vars.color.gray400,
});

export const rowValue = style({
  color: vars.color.black500,
});

export const totalValue = style({
  color: vars.color.black500,
});

export const refundValue = style({
  color: vars.color.red200,
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '318px',
});

export const confirmButton = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const closeButton = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px',
    border: `1px solid ${vars.color.gray200}`,
    borderRadius: '12px',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);
