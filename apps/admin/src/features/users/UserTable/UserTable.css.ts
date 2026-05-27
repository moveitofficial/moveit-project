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
  width: '120px',
});

export const colCompanyName = style({
  ...cellBase,
  width: '200px',
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

export const colServiceType = style({
  ...cellBase,
  width: '150px',
});

export const colProvider = style({
  ...cellBase,
  width: '120px',
});

export const colStatus = style({
  ...cellBase,
  width: '120px',
});

export const colRegion = style({
  ...cellBase,
  width: '120px',
});

export const colCount = style({
  ...cellBase,
  width: '100px',
});

export const colReport = style({
  ...cellBase,
  width: '80px',
});

export const colDate = style({
  ...cellBase,
  width: '150px',
  borderRight: 'none',
});

export const reportRed = style({
  color: vars.color.red200,
});

export const reportGray = style({
  color: vars.color.gray300,
});
