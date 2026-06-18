import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const agreeBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  padding: '24px 40px',
  marginTop: '24px',
  backgroundColor: vars.color.blue50,
  borderRadius: '16px',
});

export const agreeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
});

export const checkbox = style({
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const checkboxChecked = style([
  checkbox,
  {
    backgroundColor: vars.color.blue300,
    borderColor: vars.color.blue300,
  },
]);

export const agreeAllText = style([
  typography.f16EB,
  {
    color: vars.color.black500,
  },
]);

export const agreeDesc = style([
  typography.f12R,
  {
    color: vars.color.gray400,
    wordBreak: 'keep-all',
  },
]);

export const agreeUnderline = style({
  textDecoration: 'underline',
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.line200,
  margin: '4px 0',
});

export const agreeItemText = style([
  typography.f16R,
  {
    color: vars.color.black500,
    wordBreak: 'keep-all',
  },
]);
