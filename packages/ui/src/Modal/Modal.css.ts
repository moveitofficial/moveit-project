import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px',
  backgroundColor: `color-mix(in srgb, ${vars.color.black500} 20%, transparent)`,
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: 'min(90vh, 820px)',
  backgroundColor: vars.color.white,
  borderRadius: '24px',
  boxSizing: 'border-box',
  overflow: 'hidden',
});

export const header = style({
  flexShrink: 0,
});

export const body = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

export const footer = style({
  flexShrink: 0,
});
