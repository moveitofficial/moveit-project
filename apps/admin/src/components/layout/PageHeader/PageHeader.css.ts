import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'sticky',
  top: 0,
  height: '64px',
  flexShrink: 0,
  backgroundColor: '#ffffff',
  borderBottom: `1px solid ${vars.color.line200}`,
  padding: '0 32px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '4px',
  zIndex: 10,
});

export const breadcrumb = style({
  color: vars.color.gray400,
});

export const title = style({
  color: vars.color.black500,
});
