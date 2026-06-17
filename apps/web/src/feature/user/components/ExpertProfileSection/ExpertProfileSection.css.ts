import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '2.625rem 2.5rem 2.5rem',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  boxSizing: 'border-box',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});

export const title = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const actionButtons = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flexShrink: 0,
});

export const actionButton = style([
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
