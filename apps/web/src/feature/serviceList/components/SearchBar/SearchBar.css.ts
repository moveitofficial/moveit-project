import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const searchWrapper = style({
  width: '763px',
  maxWidth: '100%',
  position: 'relative',
});

export const searchInput = style([
  typography.f16R,
  {
    width: '100%',
    height: '52px',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    padding: '0 48px 0 16px',
    '::placeholder': {
      color: vars.color.gray200,
    },
  },
]);

export const searchSubmitButton = style({
  position: 'absolute',
  right: '16px',
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
