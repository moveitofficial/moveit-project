import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
});

export const tab = style({
  padding: '12px 31px',
  marginBottom: '-1px',
  borderBottom: `1px solid ${vars.color.line200}`,
  color: vars.color.gray400,
  cursor: 'pointer',

  selectors: {
    '&[aria-selected="true"]': {
      borderBottomColor: vars.color.blue300,
      color: vars.color.black500,
      fontWeight: 800,
    },
  },
});

export const count = style({
  marginLeft: '4px',
  color: vars.color.gray400,
});
