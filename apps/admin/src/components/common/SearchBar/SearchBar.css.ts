import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  
  height: '56px',
  padding: '0 16px',

  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',

  selectors: {
    '&:focus-within': {
      borderColor: vars.color.blue300,
    },
  },
});

export const input = style({
  flex: 1,
  border: 'none',
  outline: 'none',
  color: vars.color.black500,
  '::placeholder': {
    color: vars.color.gray400,
  },
});

export const icon = style({
  // flexShrink: 0,
  color: vars.color.black500,
});
