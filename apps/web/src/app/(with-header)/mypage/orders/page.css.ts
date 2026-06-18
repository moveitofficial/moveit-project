import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const title = style({
  margin: 0,
  color: vars.color.black500,
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  width: '876px',
  height: '686px',
  overflow: 'hidden',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '12px',
});

export const filterSection = style({
  flexShrink: 0,
  paddingBottom: '24px',
});

export const listHost = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  minHeight: 0,
  padding: '0 40px 40px',
});
