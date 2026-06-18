import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const FormContainer = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '50px',
  gap: '16px',
  width: '100%',
});

export const InputItemWrapper = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const InputLabel = style([typography.f14B]);

export const InputItem = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const LoginBtn = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px 0',
    marginTop: '40px',
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

export const InputItemError = style({
  borderColor: vars.color.red200,
});

export const ErrorMessage = style([
  typography.f12R,
  {
    color: vars.color.red200,
    textAlign: 'right',
    marginTop: '4px',
  },
]);
