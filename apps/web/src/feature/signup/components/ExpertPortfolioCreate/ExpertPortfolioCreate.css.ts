import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '776px',
  padding: '120px 0',
  gap: '20px',
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
});

export const label = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const labelCount = style([
  typography.f16B,
  {
    color: vars.color.gray300,
  },
]);

export const input = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const textareaWrapper = style({
  position: 'relative',
  width: '100%',
});

export const textarea = style([
  typography.f16R,
  {
    width: '100%',
    height: '298px',
    padding: '16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,
    resize: 'none',

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
    },
  },
]);

export const counter = style([
  typography.f16R,
  {
    position: 'absolute',
    right: '16px',
    bottom: '16px',
    color: vars.color.gray400,
  },
]);

export const submitArea = style({
  display: 'flex',
  justifyContent: 'center',
  marginTop: '40px',
});

export const submitBtn = style([
  typography.f16EB,
  {
    width: '375px',
    padding: '14px 0',
    backgroundColor: vars.color.gray50,
    border: 'none',
    borderRadius: '12px',
    color: vars.color.white,
    cursor: 'not-allowed',

    selectors: {
      '&:not(:disabled)': {
        backgroundColor: vars.color.blue300,
        cursor: 'pointer',
      },
    },
  },
]);

export const formError = style([
  typography.f12B,
  {
    color: vars.color.red200,
    width: '100%',
  },
]);
