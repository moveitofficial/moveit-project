import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const title = style({
  color: vars.color.black500,
  margin: 0,
});

export const buttonGroup = style({
  display: 'flex',
  gap: '8px',
});

export const baseButton = style({
  padding: '10px 30px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
});

export const errorText = style({
  color: vars.color.red200,
  textAlign: 'right',
});
