import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line100}`,
  overflow: 'hidden',
  width: '100%',
});

export const wrapperFill = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

export const scrollBody = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const headerSticky = style({
  position: 'sticky',
  top: 0,
  zIndex: 1,
  backgroundColor: vars.color.white,
});

const rowBase = style({
  display: 'flex',
  alignItems: 'stretch',
  minHeight: '56px',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const header = style([rowBase]);

export const list = style({
  display: 'flex',
  flexDirection: 'column',
});

export const row = style([
  rowBase,
  {
    selectors: {
      '&:last-child': {
        borderBottom: 'none',
      },
    },
  },
]);

export const colDivider = style({
  borderLeft: `1px solid ${vars.color.line200}`,
});

export const colCheckbox = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '80px',
});

export const empty = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  color: vars.color.gray400,
});

export const emptyFill = style({
  flex: 1,
});
