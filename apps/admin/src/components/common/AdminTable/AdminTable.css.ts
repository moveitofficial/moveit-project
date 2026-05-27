import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
  width: '100%',
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

export const rowLink = style({
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  color: 'inherit',
  textDecoration: 'none',
});

export const empty = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '120px',
  color: vars.color.gray400,
});
