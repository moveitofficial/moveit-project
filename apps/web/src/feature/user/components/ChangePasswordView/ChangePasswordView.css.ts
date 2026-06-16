import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.88rem',
});

export const pageTitle = style({
  fontFamily: 'NanumSquareOTF',
  fontSize: '1.125rem',
  fontStyle: 'normal',
  fontWeight: '800',
  lineHeight: '1.625rem',
});

export const form = style({
  width: '100%',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '2.625rem 2.5rem 2.5rem 2.5rem',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
});

export const fieldRow = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
  width: '100%',
});

export const currentPasswordField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
});

export const currentPasswordFieldError = style([
  typography.f12B,
  {
    margin: 0,
    color: vars.color.red200,
    textAlign: 'right',
  },
]);

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  minWidth: 0,
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
    padding: '14px 48px 14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    boxSizing: 'border-box',

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const passwordWrapper = style({
  position: 'relative',
  width: '100%',
});

export const visibilityToggle = style({
  position: 'absolute',
  top: '50%',
  right: '16px',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
});

export const fieldError = style([
  typography.f12B,
  {
    margin: 0,
    color: vars.color.red200,
    textAlign: 'right',
  },
]);

export const formError = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
  },
]);

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const submitButton = style({
  borderRadius: '0.5rem',
  background: 'var(--Primary-blue-300, #1B92FF)',
  display: 'flex',
  padding: '0.5rem 1.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.625rem',

  fontSize: '0.875rem',
  fontStyle: 'normal',
  fontWeight: 700,
  color: vars.color.white,
});

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  color: vars.color.gray400,
  cursor: 'not-allowed',
});

export const statusMessage = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const errorMessage = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.red200,
  },
]);

export const noticeCard = style([
  card,
  {
    gap: '12px',
  },
]);

export const noticeText = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);
