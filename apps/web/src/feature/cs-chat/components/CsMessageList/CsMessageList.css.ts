import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const systemLine = style([
  typography.f14R,
  {
    margin: 0,
    textAlign: 'center',
    color: vars.color.gray400,
  },
]);

export const stamp = style({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  fontSize: 10,
  lineHeight: '14px',
  color: vars.color.gray400,
});

export const userRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
  gap: 8,
});

export const userBubble = style([
  typography.f14R,
  {
    margin: 0,
    maxWidth: 280,
    padding: 16,
    borderRadius: 8,
    backgroundColor: vars.color.yellow50,
    color: vars.color.black500,
    wordBreak: 'break-word',
  },
]);

export const adminRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 8,
});

export const adminAvatar = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
});

export const adminBubble = style([
  typography.f16R,
  {
    margin: 0,
    maxWidth: 248,
    padding: 16,
    borderRadius: 8,
    backgroundColor: vars.color.blue50,
    color: vars.color.black500,
    wordBreak: 'break-word',
  },
]);
