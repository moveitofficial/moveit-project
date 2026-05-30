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

export const colName = style({
  ...cellBase,
  width: '180px',
});

export const colEmailHeader = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  padding: '0 16px',
});

export const colEmail = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  justifyContent: 'flex-start',
  padding: '0 16px',
});

export const emailText = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
  textAlign: 'left',
});

export const colDate = style({
  ...cellBase,
  width: '350px',
});

export const colLastDate = style({
  ...cellBase,
  width: '350px',
  borderRight: 'none',
});
