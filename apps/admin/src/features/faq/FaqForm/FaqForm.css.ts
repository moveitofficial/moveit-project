import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  padding: '32px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const title = style([
  typography.f20EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const titleInput = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '8px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const footer = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '12px',
});

export const cancelButton = style([
  typography.f16B,
  {
    width: '120px',
    padding: '12px 0',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const submitButton = style([
  typography.f16B,
  {
    width: '120px',
    padding: '12px 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  cursor: 'not-allowed',
});
