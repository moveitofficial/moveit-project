import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const box = style({
  padding: '24px',
  borderRadius: '8px',
  backgroundColor: vars.color.blue50,
});

export const text = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black300,
    whiteSpace: 'pre-line',
  },
]);
