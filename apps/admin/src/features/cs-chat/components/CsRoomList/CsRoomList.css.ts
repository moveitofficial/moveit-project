import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  width: 376,
  flexShrink: 0,
  minHeight: 0,
});

export const panel = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: 12,
});
