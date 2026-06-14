import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapperCenter = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  marginBottom: '56px',
});

export const wrapperLeft = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '32px',
  marginBottom: '24px',
});

export const titleCenter = style([
  typography.f32R,
  {
    textAlign: 'center',
    color: vars.color.black500,
  },
]);

export const titleLeft = style([
  typography.f32R,
  {
    color: vars.color.black500,
  },
]);
