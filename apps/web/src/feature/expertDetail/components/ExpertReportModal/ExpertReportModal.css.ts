import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const scrollBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '24px',
  boxSizing: 'border-box',
});

export const title = style([
  typography.f20B,
  {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0,
    color: vars.color.black500,
  },
]);

export const titleIcon = style({
  flexShrink: 0,
});

export const reasonGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '12px',
});

export const reasonOption = style([
  typography.f14R,
  {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.gray100}`,
    cursor: 'pointer',
    color: vars.color.black500,
  },
]);

export const reasonOptionSelected = style({
    borderColor: vars.color.red200,
});

export const textarea = style([
  typography.f14R,
  {
    width: '100%',
    minHeight: '120px',
    padding: '12px 14px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.gray100}`,
    resize: 'vertical',
    boxSizing: 'border-box',
    color: vars.color.black500,
  },
]);

export const attachButton = style([
  typography.f14R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.gray100}`,
    backgroundColor: vars.color.white,
    cursor: 'pointer',
    color: vars.color.black500,
  },
]);

export const attachHint = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const agreementBox = style({
  padding: '12px 14px',
  borderRadius: '8px',
  backgroundColor: vars.color.yellow50,
});

export const agreementLabel = style([
  typography.f14R,
  {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    margin: 0,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const filePreviewList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const filePreviewItem = style({
  position: 'relative',
  width: '64px',
  height: '64px',
  borderRadius: '8px',
  overflow: 'hidden',
});

export const filePreviewImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const fileRemoveButton = style({
  position: 'absolute',
  top: '4px',
  right: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '20px',
  height: '20px',
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: vars.color.black500,
  color: vars.color.white,
  cursor: 'pointer',
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  padding: '0 24px 24px',
  boxSizing: 'border-box',
});

export const cancelButton = style([
  typography.f16R,
  {
    padding: '12px 20px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.gray100}`,
    backgroundColor: vars.color.white,
    cursor: 'pointer',
    color: vars.color.black500,
  },
]);

export const submitButton = style([
  typography.f16B,
  {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: vars.color.red200,
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

export const fieldLabel = style([
  typography.f14B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const errorMessage = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.red200,
  },
]);
