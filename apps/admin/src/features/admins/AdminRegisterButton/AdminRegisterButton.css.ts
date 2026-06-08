import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const registerButton = style({
  flexShrink: 0,
  padding: '16px 40px',
  marginLeft: '12px',
  borderRadius: '8px',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

export const formContent = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '32px',
});

export const formTitle = style({
  margin: 0,
  textAlign: 'center',
  color: vars.color.black500,
  marginBottom: '32px',
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const fieldsBase = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
} as const;

export const fields = style({
  ...fieldsBase,
  marginBottom: '40px',
});

export const fieldsCompact = style({
  ...fieldsBase,
  marginBottom: '16px',
});

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const fieldInput = style({
  width: '100%',
  padding: '12px 16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  outline: 'none',
  color: vars.color.black500,
  boxSizing: 'border-box',
  '::placeholder': {
    color: vars.color.gray400,
  },
  selectors: {
    '&:focus': {
      borderColor: vars.color.blue300,
    },
  },
});

export const errorMessage = style({
  margin: '0 0 24px',
  color: vars.color.red200,
});

export const formActions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '24px',
});

export const submitButton = style({
  padding: '14px 0',
  border: 'none',
  borderRadius: '12px',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      backgroundColor: vars.color.gray200,
      cursor: 'not-allowed',
    },
  },
});

export const cancelButton = style({
  color: vars.color.gray400,
  cursor: 'pointer',
});
