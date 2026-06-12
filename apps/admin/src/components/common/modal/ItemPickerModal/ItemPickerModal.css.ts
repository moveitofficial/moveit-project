import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '32px',
  gap: '31px',
});

export const modalTitle = style([
  typography.f16EB,
  {
    color: vars.color.black500,
    margin: 0,
  },
]);

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  gap: '75px',
});

export const searchWrap = style({
  width: '509px',
  flexShrink: 0,
});

export const sortGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginLeft: 'auto',
  flexShrink: 0,
});

export const sortButton = style([
  typography.f16R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const sortButtonActive = style([
  typography.f16EB,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const sortDivider = style([
  typography.f16R,
  {
    color: vars.color.line200,
  },
]);

export const tableSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const tableContainer = style({
  height: '336px',
});

export const statusMessage = style([
  typography.f16R,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '336px',
    color: vars.color.gray400,
  },
]);

export const registeredSummary = style([
  typography.f14B,
  {
    margin: 0,
    color: vars.color.gray400,
    wordBreak: 'keep-all',
  },
]);

export const errorMessage = style([
  typography.f14R,
  {
    color: vars.color.red200,
    textAlign: 'center',
    margin: 0,
  },
]);

export const footer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  marginTop: '25px',
});

export const confirmButton = style([
  typography.f16B,
  {
    width: '318px',
    padding: '14px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
    selectors: {
      '&:disabled': {
        backgroundColor: vars.color.gray200,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const cancelButton = style([
  typography.f16EB,
  {
    padding: '4px',
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);
