import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  width: '256px',
  flexShrink: 0,
  height: '100vh',
  overflowY: 'auto',
  backgroundColor: vars.color.adminMenuBackground,
  display: 'flex',
  flexDirection: 'column',
});

export const brand = style({
  padding: '24px 16px 16px',
  borderBottom: `1px solid ${vars.color.line300}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const logo = style({
  color: vars.color.blue300,
});

export const email = style({
  color: vars.color.gray100,
});

export const menu = style({
  padding: '16px 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const groupTitle = style({
  color: vars.color.textGray,
  padding: '8px 32px',
});

export const itemList = style({
  display: 'flex',
  flexDirection: 'column',
});

export const item = style({
  display: 'block',
  margin: '0 16px',
  padding: '8px 16px',
  color: vars.color.textGray,
  borderRadius: '8px',
  ':hover': {
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
  },
});

export const itemActive = style([
  typography.f16EB,
  {
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
  },
]);
