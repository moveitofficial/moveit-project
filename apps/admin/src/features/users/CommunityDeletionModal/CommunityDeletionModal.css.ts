import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
  padding: '32px',
});

export const top = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '100%',
});

export const title = style({
  margin: 0,
  color: vars.color.black400,
  textAlign: 'center',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '318px',
});


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

export const reasonSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '318px',
});


export const reasonMeta = style({
  display: 'flex',
  justifyContent: 'space-between',
  color: vars.color.gray400,
});

export const reasonText = style({
  marginTop: '8px',
});

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  width: '318px',
});

export const submitButton = style([
  typography.f16EB,
  {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
]);

export const cancelButton = style([
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
