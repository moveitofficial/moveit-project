import { vars } from '@repo/styles/tokens';
import { style, styleVariants } from '@vanilla-extract/css';

export const wrapper = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
  minHeight: '448px',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px 16px',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const headerLeft = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const headerTitle = style({
  color: vars.color.black400,
});

export const headerSubtitle = style({
  color: vars.color.gray400,
});

export const tabs = style({
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
});

export const tab = styleVariants({
  active: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: vars.color.blue300,
    padding: 0,
  },
  inactive: {
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    color: vars.color.gray400,
    padding: 0,
  },
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '25px 24px',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const rowLeft = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: '8px',
});

export const rowName = style({
  color: vars.color.black400,
});

export const rowCount = style({
  color: vars.color.gray400,
});

export const rowAmount = style({
  color: vars.color.black400,
});

export const empty = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '120px',
  color: vars.color.gray400,
});
