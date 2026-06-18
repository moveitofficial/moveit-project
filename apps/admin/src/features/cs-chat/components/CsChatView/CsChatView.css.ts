import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: 'hidden',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: 12,
});

export const transcript = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: 24,
});
