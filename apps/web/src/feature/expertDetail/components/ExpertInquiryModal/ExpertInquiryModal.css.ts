import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '24px',
  boxSizing: 'border-box',
});

export const expertBanner = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const expertAvatar = style([
  typography.f16B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
  },
]);

export const expertInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

export const expertName = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const expertHours = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const textarea = style([
  typography.f14R,
  {
    width: '100%',
    height: '160px',
    padding: '16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '8px',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    resize: 'none',
    overflowY: 'auto',
    boxSizing: 'border-box',
    fontFamily: vars.font.family,
    '::placeholder': {
      color: vars.color.gray400,
    },
  },
]);

export const attachGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const attachButton = style([
  typography.f14R,
  {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '8px',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
    flexShrink: 0,
  },
]);

export const attachHint = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray400,
    whiteSpace: 'nowrap',
  },
]);

export const footer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
  gap: '8px',
});

export const cancelButton = style([
  typography.f16B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '52px',
    padding: '0 24px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const submitButton = style([
  typography.f16EB,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '160px',
    height: '52px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const submitButtonDisabled = style({
  backgroundColor: vars.color.gray50,
  color: vars.color.white,
  cursor: 'not-allowed',
});

export const hiddenFileInput = style({
  display: 'none',
});

export const errorMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
  },
]);
