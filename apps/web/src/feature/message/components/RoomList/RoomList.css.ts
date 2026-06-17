import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const listPane = style({
  width: '320px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minHeight: 0,
});

export const searchWrapper = style({
  position: 'relative',
  flexShrink: 0,
});

export const searchInput = style([
  typography.f14R,
  {
    width: '100%',
    height: '44px',
    boxSizing: 'border-box',
    padding: '0 44px 0 16px',
    borderRadius: '12px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    '::placeholder': {
      color: vars.color.gray200,
    },
  },
]);

export const searchIcon = style({
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: vars.color.gray400,
});

export const listBox = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  padding: '12px',
  boxSizing: 'border-box',
});

export const stateText = style([
  typography.f14R,
  {
    margin: 0,
    padding: '24px 0',
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const emptyState = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  height: '100%',
  padding: '24px',
});

export const emptyIcon = style({
  color: vars.color.blue300,
});

export const emptyText = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.gray400,
    textAlign: 'center',
    lineHeight: 1.6,
  },
]);

export const roomList = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const roomCard = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '12px',
  background: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  selectors: {
    '&:hover': {
      backgroundColor: vars.color.background100,
    },
  },
});

export const roomCardActive = style({
  backgroundColor: vars.color.blue50,
});

export const avatar = style({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  objectFit: 'cover',
  flexShrink: 0,
});

export const avatarFallback = style([
  typography.f14B,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: vars.color.blue400,
    color: vars.color.white,
    flexShrink: 0,
  },
]);

export const roomBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
});

export const roomTopRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
});

export const roomName = style([
  typography.f16B,
  {
    color: vars.color.black500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
]);

export const roomTime = style([
  typography.f12R,
  {
    color: vars.color.gray400,
    flexShrink: 0,
  },
]);

export const roomPreviewRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
});

export const roomPreview = style([
  typography.f14R,
  {
    flex: 1,
    minWidth: 0,
    color: vars.color.gray400,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
]);

export const unreadDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: vars.color.red200,
  flexShrink: 0,
});
