import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'sticky',
  top: 0,
  height: '64px',
  flexShrink: 0,
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.line200}`,
  padding: '0 32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  zIndex: 10,
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const breadcrumb = style({
  color: vars.color.gray400,
});

export const title = style({
  color: vars.color.black500,
});
