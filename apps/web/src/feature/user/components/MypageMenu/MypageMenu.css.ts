import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const sidebar = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

export const sidebarTitle = style([
  typography.f18B,
  {
    margin: '0 0 16px',
    color: vars.color.black500,
    wordBreak: 'keep-all',
  },
]);

export const sidebarDivider = style({
  width: '100%',
  height: '1px',
  margin: '0 0 8px',
  border: 'none',
  backgroundColor: vars.color.line200,
});

export const menuList = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const menuLink = style([
  typography.f16R,
  {
    display: 'block',
    padding: '14px 16px',
    color: vars.color.black500,
    textDecoration: 'none',
    wordBreak: 'keep-all',
  },
]);

export const menuLinkActive = style({
  fontWeight: vars.font.weight.extraBold,
});
