import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '496px',
});

export const titleWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  marginBottom: '56px',
});

export const title = style([
  typography.f32R,
  {
    textAlign: 'center',
    color: vars.color.black500,
  },
]);

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  position: 'relative',
});

export const label = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const input = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 1000px ${vars.color.white} inset`,
        WebkitTextFillColor: vars.color.black500,
      },
    },
  },
]);

export const passwordWrapper = style({
  position: 'relative',
  width: '100%',
});

export const fieldError = style([
  typography.f12B,
  {
    color: vars.color.red200,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
  },
]);

export const visibilityToggle = style({
  position: 'absolute',
  top: '50%',
  right: '16px',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  color: vars.color.gray300,
});

export const submitBtn = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px 0',
    marginTop: '24px',
    backgroundColor: vars.color.gray50,
    border: 'none',
    borderRadius: '12px',
    color: vars.color.white,
    cursor: 'not-allowed',

    selectors: {
      '&:not(:disabled)': {
        backgroundColor: vars.color.blue300,
        cursor: 'pointer',
      },
    },
  },
]);
