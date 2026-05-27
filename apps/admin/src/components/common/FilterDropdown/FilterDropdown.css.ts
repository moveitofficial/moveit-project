import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  position: 'relative',
  display: 'flex',
  flexGrow: 1,
  maxWidth: '160px',
});

export const trigger = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  width: '100%',
  height: '56px',
  padding: '0 16px',

  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  color: vars.color.black500,

  cursor: 'pointer',

  selectors: {
    '&:hover': {
      borderColor: vars.color.blue300,
    },
  },
});

export const arrow = style({
  color: vars.color.black500,
});

export const dropdown = style({
  position: 'absolute',
  top: 'calc(100% + 4px)',
  left: 0,
  zIndex: 100,
  overflow: 'hidden',

  minWidth: '100%',
  padding: '16px 4px',

  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  boxShadow: '2px 2px 8px 0px rgba(0, 0, 0, 0.08)',
});

export const option = style({
  display: 'block',
  textAlign: 'left',
  width: '100%',
  height: '52px',
  padding: '10px 14px',
  whiteSpace: 'nowrap',

  backgroundColor: 'transparent',
  border: 'none',
  color: vars.color.black500,

  cursor: 'pointer',

  selectors: {
    '&:hover': {
      backgroundColor: vars.color.background100,
    },
    '&[aria-selected="true"]': {
      color: vars.color.blue300,
      fontWeight: 800,
    },
  },
});
