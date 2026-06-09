import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  width: '100%',
  position: 'relative',
});

export const inputContainer = style([
  typography.f20B,
  {
    width: '100%',
    borderRadius: '16px',
    border: `1px solid ${vars.color.line200}`,
    padding: '18px 80px 18px 32px',
    '::placeholder': {
      color: vars.color.gray200,
    },
  },
]);

export const searchIcon = style({
  position: 'absolute',
  right: 32,
  top: 12,
});

export const searchSubmitButton = style([
  searchIcon,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  },
]);
