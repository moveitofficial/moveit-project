import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const header = style({
  padding: '24px 32px 16px',
  textAlign: 'center',
});

export const title = style({
  margin: 0,
});

export const fileInput = style({
  display: 'none',
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '20px 32px 0',
});

export const uploadArea = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  height: '100px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      borderColor: vars.color.blue300,
      backgroundColor: vars.color.blue100,
    },
  },
});

export const uploadSvgIcon = style({
  color: vars.color.gray400,
  flexShrink: 0,
});

export const uploadText = style({
  color: vars.color.gray400,
});

export const previewWrapper = style({
  display: 'block',
  cursor: 'pointer',
});

export const previewImage = style({
  display: 'block',
  width: '100%',
  height: '130px',
  objectFit: 'cover',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
});

export const fieldGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const label = style({
  color: vars.color.black400,
});

export const input = style({
  width: '100%',
  padding: '10px 16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  outline: 'none',
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

export const errorText = style({
  color: vars.color.red200,
  margin: 0,
});

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  padding: '40px 32px 24px',
});

export const submitButton = style({
  width: '318px',
  padding: '14px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      backgroundColor: vars.color.line200,
      cursor: 'not-allowed',
    },
  },
});

export const cancelButton = style({
  padding: '4px',
  background: 'none',
  border: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
  textAlign: 'center',
});
