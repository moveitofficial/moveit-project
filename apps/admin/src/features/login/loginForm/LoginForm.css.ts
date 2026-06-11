import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const FormContainer = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '32px',
  width: '100%',
});

export const InputItemWrapper = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  position: 'relative',
});

export const InputLabel = style([typography.f14B]);

export const FirstInputItem = style([InputItemWrapper, { marginBottom: 16 }]);

export const InputItem = style({
  width: '100%',
  padding: '14px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',

  selectors: {
    '&::placeholder': {
      color: vars.color.gray300,
      fontSize: '1rem',
      lineHeight: '1.375rem',
      fontWeight: vars.font.weight.regular,
      letterSpacing: '0.05em',
    },
  },
});

export const LoginBtn = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px 0',
    marginTop: '56px',
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

export const ErrorMessage = style([
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
