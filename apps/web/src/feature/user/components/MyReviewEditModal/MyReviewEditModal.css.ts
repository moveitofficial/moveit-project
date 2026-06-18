import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  padding: '2rem',
  boxSizing: 'border-box',
});

export const title = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'center',
  },
]);

export const ratingRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
});

export const ratingValue = style([
  typography.f24B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const textarea = style([
  typography.f14R,
  {
    width: '100%',
    height: '11.875rem',
    padding: '1.25rem',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '0.75rem',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    resize: 'none',
    overflowY: 'auto',
    boxSizing: 'border-box',
    fontFamily: vars.font.family,
    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const errorMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
    textAlign: 'center',
  },
]);

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
});

export const submitButton = style([
  typography.f16EB,
  {
    width: '100%',
    height: '3.25rem',
    border: 'none',
    borderRadius: '0.75rem',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  color: vars.color.white,
  cursor: 'not-allowed',
});

export const cancelButton = style([
  typography.f16R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);
