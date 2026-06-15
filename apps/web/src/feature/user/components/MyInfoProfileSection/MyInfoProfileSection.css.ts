import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  width: '120px',
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

export const changeButton = style({
  display: 'flex',
  padding: '0.625rem 1rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.625rem',

  borderRadius: '0.5rem',
  border: `1px solid var(--Line-Line-200, #E6E6E6)`,
  background: vars.color.white,

  fontFamily: vars.font.family,
  fontSize: '0.875rem',
  fontWeight: vars.font.weight.bold,
  color: vars.color.black500,
  lineHeight: '1.375rem',
});

export const hiddenInput = style({
  display: 'none',
});
