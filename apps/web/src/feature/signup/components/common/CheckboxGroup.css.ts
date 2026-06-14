import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const box = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '16px 0',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  backgroundColor: vars.color.white,
});

export const boxScrollable = style([
  box,
  {
    overflowY: 'auto',
  },
]);

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 24px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',

  ':hover': {
    backgroundColor: vars.color.blue50,
  },
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

export const label = style([
  typography.f16R,
  {
    color: vars.color.black500,
  },
]);

export const helperText = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    alignSelf: 'flex-end',
  },
]);

export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  width: '100%',
});

export const chipBtn = style({
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
});
