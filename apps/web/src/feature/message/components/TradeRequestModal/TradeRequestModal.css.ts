import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '32px',
});

export const title = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
    textAlign: 'center',
  },
]);

export const serviceCard = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const thumbnail = style({
  width: '56px',
  height: '56px',
  borderRadius: '8px',
  backgroundColor: vars.color.background300,
  flexShrink: 0,
});

export const thumbnailImage = style({
  width: '56px',
  height: '56px',
  borderRadius: '8px',
  objectFit: 'cover',
  flexShrink: 0,
});

export const serviceInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
});

export const serviceTitle = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
]);

export const servicePrice = style([
  typography.f16EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const label = style([
  typography.f14B,
  {
    color: vars.color.black500,
  },
]);

export const inputWrapper = style({
  position: 'relative',
});

export const input = style([
  typography.f16R,
  {
    width: '100%',
    height: '52px',
    boxSizing: 'border-box',
    padding: '0 40px 0 16px',
    borderRadius: '12px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    textAlign: 'right',
    '::placeholder': {
      color: vars.color.gray200,
    },
  },
]);

export const unit = style([
  typography.f16R,
  {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: vars.color.gray400,
  },
]);

export const footer = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

export const cancelButton = style([
  typography.f16B,
  {
    height: '52px',
    padding: '0 24px',
    borderRadius: '8px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const submitButton = style([
  typography.f16EB,
  {
    flex: 1,
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
