import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
  backgroundColor: vars.color.white,
  overflow: 'hidden',
  gap: '24px',
  padding: '40px',
});

