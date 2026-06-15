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
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  height: '72px',
  color: vars.color.black400,
});

export const navLinkActive = style({
  color: vars.color.black500,
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '-1px',
      height: '4px',
      backgroundColor: vars.color.blue300,
    },
  },
});

export const signUpButton = style({
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  padding: '8px 16px',
  borderRadius: '8px',
});

export const iconLink = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  color: vars.color.black400,
});

export const profileIcon = style({
  display: 'block',
  width: '24px',
  height: '24px',
});

export const badge = style({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: vars.color.red200,
});

export const profileMenu = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
});

export const profileButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
});

export const dropdown = style({
  position: 'absolute',
  top: 'calc(100% + 28px)',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '248px',
  paddingTop: '16px',
  paddingBottom: '6px',
  paddingInline: '4px',
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '16px',
  boxShadow: '2px 2px 4px rgba(224, 224, 224, 0.2)',
  zIndex: 100,
});

export const dropdownName = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingBlock: '14px',
  paddingLeft: '24px',
  paddingRight: '12px',
  color: vars.color.black300,
});

export const dropdownItem = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  paddingBlock: '14px',
  paddingLeft: '24px',
  paddingRight: '12px',
  color: vars.color.black400,
});

export const dropdownItemLast = style({
  paddingBottom: '24px',
});

export const dropdownLogout = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  paddingTop: '14px',
  paddingBottom: '8px',
  paddingInline: '12px',
  borderTop: `1px solid ${vars.color.line100}`,
  color: vars.color.gray500,
  cursor: 'pointer',
});

export const iconButton = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  color: vars.color.black400,
  cursor: 'pointer',
});
