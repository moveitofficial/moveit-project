import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
});

export const title = style({});

export const tableContainer = style({
  height: '616px',
});

export const emptyText = style({
  color: vars.color.gray400,
  marginTop: '16px',
  textAlign: 'center',
});
