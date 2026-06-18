import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
});

export const pageTitle = style([
  typography.f18EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const sortTabs = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

export const sortTab = style([
  typography.f12R,
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
