import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const panel = style({
  position: 'absolute',
  top: 'calc(100% + 28px)',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '406px',
  height: '463px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
  zIndex: 100,
});

export const title = style({
  padding: '31px 31px 0',
  color: vars.color.black500,
});

export const tabBar = style({
  display: 'flex',
  flexShrink: 0,
});

export const tab = style({
  flex: 1,
  padding: '16px 10px',
  border: 'none',
  background: 'none',
  borderBottom: `1px solid ${vars.color.line200}`,
  color: vars.color.gray400,
  cursor: 'pointer',
});

export const tabActive = style({
  borderBottom: `2px solid ${vars.color.blue300}`,
  color: vars.color.black500,
});

export const list = style({
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  margin: 0,
  padding: '24px 31px 16px',
  listStyle: 'none',
});

export const empty = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  padding: '40px 31px',
});

export const emptyText = style({
  color: vars.color.gray400,
});

export const item = style({
  display: 'flex',
  gap: '12px',
});

export const avatar = style({
  position: 'relative',
  flexShrink: 0,
  width: '40px',
  height: '40px',
});

export const avatarImage = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
});

export const unreadDot = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: vars.color.red200,
});

export const itemBody = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const content = style({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  color: vars.color.black500,
});

export const meta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: vars.color.gray400,
});

export const deleteButton = style({
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
});

export const footer = style({
  display: 'flex',
  flexShrink: 0,
  borderTop: `1px solid ${vars.color.line200}`,
});

export const footerButton = style({
  flex: 1,
  padding: '16px 10px',
  border: 'none',
  background: 'none',
  color: vars.color.gray400,
  cursor: 'pointer',
});

export const footerDivider = style({
  borderLeft: `1px solid ${vars.color.line200}`,
});
