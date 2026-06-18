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
});

export const title = style({
  color: vars.color.black500,
});

export const subtitle = style({
  color: vars.color.gray400,
});

export const listWrapper = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  overflowX: 'auto',
});

export const listScroll = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
});

const rowBase = style({
  display: 'flex',
  alignItems: 'center',
  height: '56px',
  flexShrink: 0,
  gap: '12px',
});

export const listHeader = style([
  rowBase,
  {
    backgroundColor: vars.color.adminBackground,
  },
]);

export const listItem = style([
  rowBase,
  {
    borderBottom: `1px solid ${vars.color.line200}`,

    selectors: {
      '&:last-child': {
        borderBottom: 'none',
      },
    },
  },
]);

const cellBase = {
  textAlign: 'center' as const,
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

export const colBadge = style({
  ...cellBase,
  width: '110px',
});

export const colRequester = style({
  ...cellBase,
  width: '120px',
});

export const colDate = style({
  ...cellBase,
  width: '120px',
  paddingRight: '16px',
});

export const colTitle = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const colTitleHeader = style([
  colTitle,
  {
    textAlign: 'center',
  },
]);

export const loadingRow = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '12px',
});
