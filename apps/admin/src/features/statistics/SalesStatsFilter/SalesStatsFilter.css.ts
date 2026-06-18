import { vars } from '@repo/styles/tokens';
import { style, styleVariants } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '11px',
});

export const presetContainer = style({
  width: '296px',
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  padding: '0 8px',
  gap: '4px',
});

export const presetBtn = styleVariants({
  active: {
    width: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    border: 'none',
  },
  inactive: {
    width: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: vars.color.gray400,
    cursor: 'pointer',
    border: 'none',
  },
});

export const separator = style({
  color: vars.color.gray400,
  padding: '0 4px',
});

export const dateBox = style({
  position: 'relative',
  width: '296px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '56px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  padding: '0 16px',
  cursor: 'pointer',
});

export const dateBoxText = style({
  color: vars.color.black400,
});

export const hiddenDateInput = style({
  position: 'absolute',
  bottom: '-8px',
  left: 0,
  width: 0,
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
});
