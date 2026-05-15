import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

const TEXT_COLOR = '#667388';
const BORDER_COLOR = '#192031';
const ACTIVE_BG = '#1B233A';

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
  borderBottom: `1px solid ${BORDER_COLOR}`,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const logo = style({
  color: vars.color.blue300,
});

export const email = style({
  color: TEXT_COLOR,
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
  color: TEXT_COLOR,
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
  color: TEXT_COLOR,
  borderRadius: '8px',
  ':hover': {
    backgroundColor: ACTIVE_BG,
    color: vars.color.white,
  },
});

export const itemActive = style({
  backgroundColor: ACTIVE_BG,
  color: vars.color.white,
});
