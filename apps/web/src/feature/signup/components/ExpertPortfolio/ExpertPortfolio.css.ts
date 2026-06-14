import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '1176px',
  padding: '120px 0 120px 0',
});

export const titleWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  marginBottom: '56px',
});

export const title = style([
  typography.f32R,
  {
    textAlign: 'center',
    color: vars.color.black500,
  },
]);

export const sectionTitle = style([
  typography.f20EB,
  {
    color: vars.color.black500,
    width: '100%',
    marginBottom: '20px',
  },
]);

export const form = style({
  width: '100%',
});

export const emptyBox = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  width: '100%',
  height: '448px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
});

export const emptyDesc = style([
  typography.f16B,
  {
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const addBtn = style([
  typography.f16EB,
  {
    width: '375px',
    padding: '14px 0',
    backgroundColor: vars.color.black500,
    border: 'none',
    borderRadius: '12px',
    color: vars.color.white,
    cursor: 'pointer',
  },
]);

export const submitArea = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  marginTop: '96px',
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

export const skipDesc = style([
  typography.f14R,
  {
    color: vars.color.gray300,
    textAlign: 'center',
  },
]);

export const skipBtn = style([
  typography.f16B,
  {
    background: 'none',
    border: 'none',
    color: vars.color.blue300,
    cursor: 'pointer',
    padding: 0,
  },
]);
