import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const pageTitle = style([
  typography.f18EB,
  {
    margin: '0 0 4px',
    color: vars.color.black500,
  },
]);

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  backgroundColor: vars.color.white,
});

export const cardTitle = style([
  typography.f16EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const noticeList = style([
  typography.f16R,
  {
    margin: 0,
    paddingLeft: '24px',
    color: vars.color.black500,
  },
]);

export const reasonSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

export const textarea = style([
  typography.f14R,
  {
    width: '100%',
    height: '190px',
    padding: '20px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    fontFamily: vars.font.family,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    '::placeholder': {
      color: vars.color.gray400,
    },
    selectors: {
      '&:disabled': {
        backgroundColor: vars.color.gray50,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const errorMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
  },
]);

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
});

const baseButton = style([
  typography.f16EB,
  {
    width: '160px',
    height: '52px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
]);

export const cancelButton = style([
  baseButton,
  {
    backgroundColor: vars.color.white,
    border: `1px solid ${vars.color.line200}`,
    color: vars.color.black500,
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.6,
      },
    },
  },
]);

export const submitButton = style([
  baseButton,
  {
    backgroundColor: vars.color.red200,
    border: 'none',
    color: vars.color.white,
  },
]);

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  cursor: 'not-allowed',
});
