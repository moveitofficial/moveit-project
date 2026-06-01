import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

const cellBase = {
  flexShrink: 0,
  textAlign: 'center' as const,
  borderRight: `1px solid ${vars.color.line200}`,
  alignSelf: 'stretch',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const colNo = style({
  ...cellBase,
  width: '80px',
});

export const colTitleHeader = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  padding: '0 16px',
});

export const colTitle = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  justifyContent: 'flex-start',
  padding: '0 16px',
});

export const titleText = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  textAlign: 'left',
});

export const colCategory = style({
  ...cellBase,
  width: '140px',
});

export const colName = style({
  ...cellBase,
  width: '180px',
});

export const colStatus = style({
  ...cellBase,
  width: '150px',
});

export const statusDeleted = style({
  color: vars.color.red200,
});

export const colPrice = style({
  ...cellBase,
  width: '200px',
});

export const colDate = style({
  ...cellBase,
  width: '140px',
});

export const colSalesCount = style({
  ...cellBase,
  width: '140px',
  borderRight: 'none',
});
