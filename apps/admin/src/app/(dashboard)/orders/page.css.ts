import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const filterSection = style({
  marginBottom: '24px',
});

export const listSection = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: '0 40px 40px',
});
