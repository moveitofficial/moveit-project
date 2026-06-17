import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '744px',
  margin: '0 auto',
  padding: '48px 0 80px',
});

export const title = style([
  typography.f20B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const subtitle = style([
  typography.f12R,
  {
    margin: 0,
    marginBottom: '8px',
    color: vars.color.gray400,
  },
]);

export const categories = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: '8px',
});

export const categoryChip = style([
  typography.f14R,
  {
    padding: '8px 16px',
    borderRadius: '999px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const categoryChipActive = style({
  borderColor: vars.color.blue300,
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
});

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

export const actions = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '24px',
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

export const errorModal = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '32px 24px',
  textAlign: 'center',
});

export const errorIcon = style({
  color: vars.color.red200,
});

export const errorText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
    whiteSpace: 'pre-wrap',
  },
]);

export const errorButton = style([
  typography.f16B,
  {
    width: '100%',
    padding: '14px 0',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);
