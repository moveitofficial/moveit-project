import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  width: '100%',
  height: '72px',
  backgroundColor: vars.color.white,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const inner = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1176px',
  width: '100%',
});

export const logoMenuGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

export const logo = style({
  transform: 'translateY(-4px)',
});

export const navMenu = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '24px',
  marginLeft: '60px',
});

export const userMenuGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '24px',
});

export const navLink = style({
  color: vars.color.black400,
});

export const signUpButton = style({
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  padding: '8px 16px',
  borderRadius: '8px',
});
