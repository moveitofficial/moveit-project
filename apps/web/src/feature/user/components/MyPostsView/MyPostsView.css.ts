import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const pageTitle = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const toolbar = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: '1rem 1.5rem',
  borderRadius: '0.75rem',
  border: `1px solid ${vars.color.line200}`,
});

export const categoryTabs = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '1.5rem',
});

export const categoryTab = style([
  typography.f16R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const categoryTabActive = style({
  fontWeight: vars.font.weight.extraBold,
  color: vars.color.black500,
});

export const sortTabs = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '1.5rem',
});

export const sortTab = style([
  typography.f16R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const sortTabActive = style({
  fontWeight: vars.font.weight.extraBold,
  color: vars.color.blue300,
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const sentinel = style({
  height: '1px',
});

export const statusMessage = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);

export const errorMessage = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.red200,
  },
]);
