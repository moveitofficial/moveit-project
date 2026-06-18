import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const button = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    cursor: 'pointer',
    selectors: {
      '&:hover': { color: vars.color.black500 },
      '&:disabled': { cursor: 'not-allowed' },
    },
  },
]);
