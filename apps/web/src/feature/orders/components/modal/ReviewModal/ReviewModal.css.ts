import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  padding: '32px',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
});

export const headerReadOnly = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

export const title = style({
  margin: 0,
  color: vars.color.black400,
});

export const stars = style({
  display: 'flex',
  gap: '8px',
});

export const starsReadOnlyRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
});

export const starsReadOnly = style({
  display: 'flex',
  fontSize: '32px',
  lineHeight: 1,
});

export const ratingNumber = style([
  typography.f16EB,
  {
    color: vars.color.black500,
    paddingTop: '4px',
  },
]);

export const starButton = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: '32px',
  lineHeight: 1,
  color: vars.color.gray300,
  ':hover': {
    color: vars.color.yellow100,
  },
});

export const starButtonActive = style({
  color: vars.color.yellow100,
});

export const starFilled = style({
  color: vars.color.yellow100,
});

export const starEmpty = style({
  color: vars.color.gray300,
});

export const textarea = style({
  width: '100%',
  height: '120px',
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

export const content = style({
  color: vars.color.black400,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
});

export const statusMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const errorMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
    textAlign: 'center',
  },
]);

export const linkRow = style({
  display: 'flex',
  gap: '16px',
  justifyContent: 'flex-end',
});

export const subButton = style([
  typography.f14R,
  {
    background: 'none',
    border: 'none',
    padding: 0,
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const actions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
});

export const confirmButton = style([
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
  },
]);
