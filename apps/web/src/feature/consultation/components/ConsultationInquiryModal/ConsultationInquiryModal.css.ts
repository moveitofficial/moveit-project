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
    minHeight: '160px',
    padding: '16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '8px',
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: vars.font.family,
    '::placeholder': {
      color: vars.color.gray400,
    },
  },
]);

export const bottomSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

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

export const attachButtonDisabled = style({
  color: vars.color.gray400,
  cursor: 'not-allowed',
});

export const attachHint = style([
  typography.f12R,
  {
    margin: 0,
    color: vars.color.gray400,
    whiteSpace: 'nowrap',
  },
]);

export const fileList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const fileItem = style([
  typography.f14R,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    margin: 0,
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: vars.color.background100,
    color: vars.color.black500,
  },
]);

export const fileRemoveButton = style({
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
  flexShrink: 0,
});

export const footer = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  width: '100%',
});

export const buttonGroup = style({
  display: 'flex',
  flexDirection: 'row',
  width: '216px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: `1px solid ${vars.color.line200}`,
});

export const cancelButton = style([
  typography.f16R,
  {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    borderRight: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const submitButton = style([
  typography.f16R,
  {
    flex: 2,
    padding: '12px 0',
    border: 'none',
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
