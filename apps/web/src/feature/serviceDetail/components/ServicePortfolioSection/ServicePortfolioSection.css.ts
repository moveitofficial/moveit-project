import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
});

export const moreLink = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    textDecoration: 'none',
  },
]);
