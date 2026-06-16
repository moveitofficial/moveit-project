import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  width: 360,
  maxWidth: '100%',
  padding: 32,
  borderRadius: 16,
  backgroundColor: vars.color.white,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
});

export const texts = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  textAlign: 'center',
});

export const title = style([
  typography.f18EB,
  { margin: 0, color: vars.color.black400 },
]);

export const desc = style([
  typography.f16R,
  { margin: 0, color: vars.color.gray400, whiteSpace: 'pre-line' },
]);

export const confirm = style([
  typography.f16EB,
  {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);
