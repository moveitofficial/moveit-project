import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const actionButton = style({
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const rejectField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '318px',
});

export const rejectModal = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '48px',
  padding: '32px',
});

export const rejectModalTop = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
});

export const rejectModalTitle = style({
  margin: 0,
  color: vars.color.black400,
  textAlign: 'center',
});

export const rejectModalActions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '318px',
});

export const rejectSubmitButton = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.red200,
    color: vars.color.white,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
]);

export const rejectCancelButton = style([
  typography.f16EB,
  {
    border: 'none',
    background: 'none',
    padding: 0,
    color: vars.color.gray400,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
]);

export const textarea = style({
  width: '318px',
  height: '116px',
  padding: '16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  resize: 'none',
  boxSizing: 'border-box',
  outline: 'none',
  color: vars.color.black400,
  backgroundColor: vars.color.white,
  '::placeholder': {
    color: vars.color.gray400,
  },
  ':focus': {
    borderColor: vars.color.blue300,
  },
});
