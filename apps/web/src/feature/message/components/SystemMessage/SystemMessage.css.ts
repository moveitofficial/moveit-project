import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const row = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '8px',
  maxWidth: '80%',
});

export const avatar = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  flexShrink: 0,
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  minWidth: '280px',
  maxWidth: '360px',
  padding: '20px',
  borderRadius: '12px',
  backgroundColor: vars.color.blue50,
  boxSizing: 'border-box',
});

export const title = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const desc = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const fieldLabel = style([
  typography.f12B,
  {
    color: vars.color.black500,
  },
]);

export const fieldValue = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray500,
  },
]);

export const fieldValueStrong = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const amounts = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  margin: 0,
});

export const amountRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const amountLabel = style([
  typography.f12R,
  {
    color: vars.color.gray400,
  },
]);

export const amountValue = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const amountLabelTotal = style([
  typography.f14B,
  {
    color: vars.color.black500,
  },
]);

export const amountValueTotal = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.blue300,
  },
]);

export const payButton = style([
  typography.f16B,
  {
    width: '100%',
    height: '48px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    ':disabled': {
      backgroundColor: vars.color.gray50,
      cursor: 'not-allowed',
    },
  },
]);

export const outlineButton = style([
  typography.f16B,
  {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);
