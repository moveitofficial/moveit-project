import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const section = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
  minHeight: 0,
});

export const titleGroup = style({
  display: 'flex',
  flexDirection: 'column',
  padding: '24px 16px',
  gap: '2px',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const title = style({
  color: vars.color.black400,
});

export const subtitle = style({
  color: vars.color.gray400,
});

export const list = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  minHeight: 0,
});

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  height: '56px',
  flexShrink: 0,
  borderBottom: `1px solid ${vars.color.line200}`,

  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
});

export const badgeWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  width: '130px',
  flexShrink: 0,
});

export const message = style({
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: vars.color.black500,
});

export const metaGroup = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  flexShrink: 0,
  gap: '4px',
  padding: '0 16px',
  minWidth: '100px',
});

export const adminName = style({
  color: vars.color.black500,
});

export const date = style({
  color: vars.color.gray400,
});

export const loadingRow = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '12px',
});
