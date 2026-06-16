import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '448px',
});

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '20px 24px 16px',
  borderBottom: `1px solid ${vars.color.line200}`,
  flexShrink: 0,
});

export const headerTitle = style({
  color: vars.color.black400,
});

export const headerSubtitle = style({
  color: vars.color.gray400,
});

export const chartArea = style({
  flex: 1,
  minHeight: 0,
  padding: '16px 24px 24px',
  display: 'flex',
});

export const svg = style({
  flex: 1,
  display: 'block',
});

export const empty = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.gray400,
});
