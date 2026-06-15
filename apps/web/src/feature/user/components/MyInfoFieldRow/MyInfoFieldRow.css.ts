import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
});

export const fieldHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});

export const label = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const saveButton = style([
  typography.f14R,
  {
    flexShrink: 0,
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.blue300,
    cursor: 'pointer',

    selectors: {
      '&:disabled': {
        color: vars.color.gray400,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const input = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    boxSizing: 'border-box',

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
      '&:disabled': {
        color: vars.color.gray400,
        backgroundColor: vars.color.gray100,
        cursor: 'not-allowed',
      },
    },
  },
]);
