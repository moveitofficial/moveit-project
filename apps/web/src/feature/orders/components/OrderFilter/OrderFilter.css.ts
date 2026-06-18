import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${vars.color.line200}`,
  padding: '16px 40px',
});

export const tabs = style({
  display: 'flex',
  gap: '20px',
});

export const tab = style([
  typography.f16R,
  {
    cursor: 'pointer',
    color: vars.color.gray400,
    whiteSpace: 'nowrap',
    background: 'none',
    border: 'none',
    padding: 0,
  },
]);

export const tabActive = style({
  fontWeight: vars.font.weight.extraBold,
  color: vars.color.black500,
});

export const sortGroup = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

export const sortTab = style([
  typography.f12R,
  {
    cursor: 'pointer',
    color: vars.color.gray400,
    background: 'none',
    border: 'none',
    whiteSpace: 'nowrap',
    padding: 0,
  },
]);

export const sortTabActive = style({
  fontWeight: vars.font.weight.extraBold,
  color: vars.color.blue300,
});

export const searchWrapper = style({
  margin: '0 40px',
});
