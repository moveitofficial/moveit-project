import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

const listToggleButtonBase = style([
  typography.f14R,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    height: '40px',
    marginTop: '8px',
    borderRadius: '8px',
    backgroundColor: vars.color.white,
    cursor: 'pointer',
    padding: 0,
  },
]);

export const sidebar = style({
  width: '244px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const headerTitle = style([
  typography.f24EB,
  {
    color: vars.color.black500,
  },
]);

export const resetButton = style([
  typography.f14R,
  {
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
    padding: 0,
  },
]);

export const activeTags = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const activeTag = style([
  typography.f16R,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '100px',
    border: 'none',
    backgroundColor: vars.color.blue100,
    color: vars.color.black500,
    cursor: 'pointer',
  },
]);

export const activeTagIcon = style({
  flexShrink: 0,
  color: vars.color.gray400,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  borderTop: `1px solid ${vars.color.line200}`,
  paddingTop: '16px',
});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
});

export const sectionTitleGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
});

export const sectionTitle = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const sectionBadge = style([
  typography.f12B,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    borderRadius: '999px',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
  },
]);

export const sectionChevronIcon = style({
  flexShrink: 0,
  color: vars.color.gray400,
});

export const optionList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '16px',
});

export const optionRow = style({
  display: 'grid',
  gridTemplateColumns: '16px 1fr auto',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
});

export const checkbox = style({
  width: '16px',
  height: '16px',
  margin: 0,
  accentColor: vars.color.blue300,
});

export const optionLabel = style([
  typography.f16R,
  {
    color: vars.color.black500,
  },
]);

export const optionCount = style([
  typography.f16R,
  {
    color: vars.color.gray400,
  },
]);

export const listToggleButtonCollapse = style([
  listToggleButtonBase,
  {
    border: `1px solid ${vars.color.blue300}`,
    color: vars.color.blue300,
  },
]);

export const listToggleButtonExpand = style([
  listToggleButtonBase,
  {
    border: `1px solid ${vars.color.line200}`,
    color: vars.color.black500,
  },
]);
