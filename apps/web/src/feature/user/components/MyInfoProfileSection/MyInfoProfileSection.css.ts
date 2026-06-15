import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  width: '160px',
  flexShrink: 0,
});

export const avatar = style({
  position: 'relative',
  width: '120px',
  height: '120px',
  borderRadius: '9999px',
  overflow: 'hidden',
  backgroundColor: vars.color.gray100,
});

export const avatarImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const avatarFallback = style({
  width: '100%',
  height: '100%',
  backgroundColor: vars.color.gray200,
});

export const changeButton = style([
  typography.f14R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.blue300,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
]);

export const hiddenInput = style({
  display: 'none',
});
