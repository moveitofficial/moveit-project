import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '28px',
  maxHeight: '85vh',
  overflowY: 'auto',
});

export const titleRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
});

export const titleIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  backgroundColor: vars.color.red200,
  color: vars.color.white,
});

export const title = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const label = style([
  typography.f16B,
  {
    marginTop: '6px',
    color: vars.color.black500,
  },
]);

export const reasonGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
});

export const reasonOption = style([
  typography.f14R,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    borderRadius: '10px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
    textAlign: 'left',
  },
]);

export const reasonOptionActive = style({
  borderColor: vars.color.red200,
});

export const radio = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  border: `1.5px solid ${vars.color.line300}`,
  flexShrink: 0,
});

export const radioActive = style({
  borderColor: vars.color.red200,
});

export const radioDot = style({
  width: '9px',
  height: '9px',
  borderRadius: '50%',
  backgroundColor: vars.color.red200,
});

export const textarea = style([
  typography.f14R,
  {
    width: '100%',
    minHeight: '140px',
    padding: '14px 16px',
    borderRadius: '12px',
    border: `1px solid ${vars.color.line200}`,
    resize: 'none',
    color: vars.color.black500,
    boxSizing: 'border-box',
    '::placeholder': {
      color: vars.color.gray300,
    },
  },
]);

export const hint = style([
  typography.f12R,
  {
    marginTop: '-6px',
    color: vars.color.red200,
  },
]);

export const fileRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
});

export const fileButton = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const fileButtonDisabled = style({
  color: vars.color.gray300,
  cursor: 'not-allowed',
});

export const fileHint = style([
  typography.f12R,
  {
    color: vars.color.gray400,
  },
]);

export const thumbs = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
});

export const thumb = style({
  position: 'relative',
  width: '64px',
  height: '64px',
});

export const thumbImage = style({
  width: '64px',
  height: '64px',
  borderRadius: '8px',
  objectFit: 'cover',
});

export const thumbRemove = style({
  position: 'absolute',
  top: '-6px',
  right: '-6px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  cursor: 'pointer',
});

export const agreement = style([
  typography.f14R,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: vars.color.yellow100,
    color: vars.color.black500,
    cursor: 'pointer',
    textAlign: 'left',
  },
]);

export const checkbox = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  borderRadius: '4px',
  border: `1.5px solid ${vars.color.white}`,
  backgroundColor: vars.color.white,
  color: vars.color.white,
  flexShrink: 0,
});

export const checkboxChecked = style({
  backgroundColor: vars.color.red200,
  borderColor: vars.color.red200,
});

export const actions = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '6px',
});

export const cancelButton = style([
  typography.f16B,
  {
    padding: '12px 28px',
    borderRadius: '10px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const submitButton = style([
  typography.f16B,
  {
    padding: '12px 28px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: vars.color.red200,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  color: vars.color.gray300,
  cursor: 'not-allowed',
});
