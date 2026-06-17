import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '32px',
});

export const title = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'center',
  },
]);

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const sectionTitle = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const rows = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  margin: 0,
});

export const row = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const totalRow = style([
  row,
  {
    marginTop: '8px',
  },
]);

export const label = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    flexShrink: 0,
  },
]);

export const value = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'right',
  },
]);

export const labelTotal = style([
  typography.f16B,
  {
    color: vars.color.black500,
    flexShrink: 0,
  },
]);

export const valueTotal = style([
  typography.f18B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const confirmButton = style([
  typography.f16EB,
  {
    width: '100%',
    height: '52px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);
