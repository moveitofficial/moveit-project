import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  height: 'min(90vh, 820px)',
  overflow: 'hidden',
});

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderBottom: `1px solid ${vars.color.line200}`,
  padding: '16px 40px',
});

export const tabs = style({
  display: 'flex',
  gap: '20px',
  overflowX: 'auto',
});

export const tab = style([
  typography.f16R,
  {
    border: 'none',
    background: 'none',
    padding: 0,
    cursor: 'pointer',
    color: vars.color.gray400,
    whiteSpace: 'nowrap',
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
  flexShrink: 0,
});

export const sortTab = style([
  typography.f12R,
  {
    cursor: 'pointer',
    color: vars.color.gray400,
    backgroundColor: 'transparent',
    border: 'none',
    whiteSpace: 'nowrap',
  },
]);

export const sortTabActive = style({
  fontWeight: vars.font.weight.extraBold,
  color: vars.color.blue300,
});

export const searchWrapper = style({
  flexShrink: 0,
  padding: '24px 40px 0',
});

export const list = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '24px 40px',
});

export const emptyText = style({
  margin: 0,
  padding: '40px 0',
  textAlign: 'center',
  color: vars.color.gray400,
});

export const loadingRow = style([
  typography.f14R,
  {
    display: 'flex',
    justifyContent: 'center',
    padding: '12px',
    color: vars.color.gray400,
  },
]);

export const footer = style({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'center',
  padding: '24px 40px 40px',
});

export const confirmButton = style([
  typography.f16EB,
  {
    width: '293px',
    maxWidth: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);
