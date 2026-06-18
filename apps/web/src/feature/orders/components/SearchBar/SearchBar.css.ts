import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  position: 'relative',
  width: '100%',
});

export const input = style([
  typography.f16R,
  {
    width: '100%',
    height: '44px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    padding: '0 44px 0 16px',
    color: vars.color.black500,
    '::placeholder': {
      color: vars.color.gray400,
    },
    selectors: {
      '&:focus': {
        outline: 'none',
        borderColor: vars.color.blue300,
      },
    },
  },
]);

export const icon = style({
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: vars.color.gray400,
});
