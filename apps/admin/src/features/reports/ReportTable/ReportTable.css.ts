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

export const colUser = style({
  ...cellBase,
  width: '200px',
});

export const colUserText = style({
  ...cellBase,
  width: '200px',
  color: vars.color.blue300,
});

export const colDetailHeader = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  padding: '0 16px',
});

export const colDetail = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  justifyContent: 'flex-start',
  padding: '0 16px',
});

export const detailText = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  textAlign: 'left',
  color: vars.color.blue300,
});

export const colReason = style({
  ...cellBase,
  width: '240px',
});

export const colDate = style({
  ...cellBase,
  width: '200px',
  borderRight: 'none',
});
