import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const scroll = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
});

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const loadingRow = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '12px',
});

export const empty = style({
  display: 'flex',
  justifyContent: 'center',
  padding: '80px 0',
  color: vars.color.gray400,
});
