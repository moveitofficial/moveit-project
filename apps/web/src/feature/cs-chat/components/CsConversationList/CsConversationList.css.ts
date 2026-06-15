import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  flex: 1,
  overflowY: 'auto',
  padding: '16px 24px 80px',
});

export const empty = style([
  typography.f14R,
  {
    margin: 'auto',
    color: vars.color.gray400,
  },
]);

export const newButton = style([
  typography.f16EB,
  {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 16px',
    borderRadius: 8,
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
]);
