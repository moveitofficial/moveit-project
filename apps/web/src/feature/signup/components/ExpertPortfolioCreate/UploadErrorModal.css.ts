import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const backdrop = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(4, 4, 4, 0.2)',
  zIndex: 100,
});

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
  width: '357px',
  padding: '32px',
  borderRadius: '16px',
  backgroundColor: vars.color.white,
  filter: 'drop-shadow(0px 4px 2px rgba(0, 0, 0, 0.1))',
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

export const heading = style([
  typography.f18EB,
  {
    color: vars.color.black400,
    textAlign: 'center',
  },
]);

export const desc = style([
  typography.f16R,
  {
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const confirmBtn = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px 0',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);
