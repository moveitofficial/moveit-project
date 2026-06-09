import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const loadingRow = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '12px',
  color: vars.color.gray400,
});

export const list = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  overflowY: 'auto',
  gap: '24px',
  padding: '40px',
});
