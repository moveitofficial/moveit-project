import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
});

export const section = style({});

export const sectionHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
});

export const buttonGroup = style({
  display: 'flex',
  gap: '14px',
});

export const button = style({
  padding: '12px 30px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  cursor: 'pointer',
  ':disabled': {
    cursor: 'default',
  },
  selectors: {
    '&:hover:not(:disabled)': {
      border: `1px solid ${vars.color.blue300}`,
    },
  },
});

export const list = style({
  maxHeight: 'calc(100vh - 202px)',
  overflowY: 'auto',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  listStyle: 'none',
  margin: 0,
});

export const emptyState = style({
  padding: '40px 24px',
  textAlign: 'center',
  color: vars.color.gray400,
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
});
