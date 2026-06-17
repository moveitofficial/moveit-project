import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const pane = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  boxSizing: 'border-box',
});

export const emptyState = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '24px',
});

export const emptyIcon = style({
  color: vars.color.blue300,
});

export const emptyTitle = style([
  typography.f16B,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const emptyDescription = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
  },
]);
