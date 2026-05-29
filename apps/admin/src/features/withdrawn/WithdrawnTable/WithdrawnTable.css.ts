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

export const colEmailHeader = style({
  ...cellBase,
  width: '380px',
  padding: '0 16px',
});

export const colEmail = style({
  ...cellBase,
  width: '380px',
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

export const colReasonHeader = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  padding: '0 16px',
});

export const colReason = style({
  ...cellBase,
  flex: 1,
  minWidth: 0,
  justifyContent: 'flex-start',
  padding: '0 16px',
});

export const colProvider = style({
  ...cellBase,
  width: '140px',
});

export const colDate = style({
  ...cellBase,
  width: '220px',
});

export const colWithdrawnDate = style({
  ...cellBase,
  width: '220px',
  borderRight: 'none',
});
