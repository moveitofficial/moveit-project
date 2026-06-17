import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
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
  gap: '24px',
  flexWrap: 'wrap',
  padding: '1rem 1.5rem',

  borderRadius: '0.75rem',
  border: `1px solid var(--Line-Line-200, #E6E6E6)`,
});

export const categoryTabs = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '24px',
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
  gap: '24px',
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
  gap: '16px',
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
