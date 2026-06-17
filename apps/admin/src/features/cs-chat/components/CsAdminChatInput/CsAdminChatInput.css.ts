import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const bar = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 16,
  borderTop: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
});

export const input = style([
  typography.f14R,
  {
    width: '100%',
    height: 54,
    resize: 'none',
    padding: 16,
    borderRadius: 12,
    border: `1px solid ${vars.color.line200}`,
    color: vars.color.black500,
    outline: 'none',
    '::placeholder': { color: vars.color.gray400 },
  },
]);

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const leftActions = style({
  display: 'flex',
  gap: 8,
});

export const outlineButton = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
    selectors: {
      '&:disabled': { color: vars.color.gray300, cursor: 'not-allowed' },
    },
  },
]);

export const sendButton = style([
  typography.f14B,
  {
    padding: '8px 24px',
    borderRadius: 8,
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    selectors: {
      '&:disabled': {
        backgroundColor: vars.color.gray200,
        cursor: 'not-allowed',
      },
    },
  },
]);
