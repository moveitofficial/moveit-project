import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  width: '100%',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  padding: '64px 0',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const inner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  maxWidth: '1176px',
  width: '100%',
});

export const topSection = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const brand = style({
  display: 'flex',
  flexDirection: 'column',
});

export const decText = style({
  marginTop: '14px',
  color: vars.color.gray500,
});

export const menuColumns = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '120px',
});

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const columnList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const columnLink = style({
  color: vars.color.black400,
});

export const divider = style({
  width: '100%',
  height: '1px',
  backgroundColor: vars.color.line200,
});

export const bottomInfo = style({
  color: vars.color.gray400,
});
