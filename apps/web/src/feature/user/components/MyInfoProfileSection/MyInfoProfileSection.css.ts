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
  width: '100px',
  height: '42px',
  gap: '10px',
  opacity: '1',
  border: `1px solid ${vars.color.line200}`,
  borderWidth: '1px',
  padding: '10px 16px',
  borderRadius: '8px',
  cursor: 'pointer',

  fontFamily: vars.font.family,
  fontSize: '14px',
  fontWeight: vars.font.weight.bold,
  color: vars.color.black500,
});

export const hiddenInput = style({
  display: 'none',
});
