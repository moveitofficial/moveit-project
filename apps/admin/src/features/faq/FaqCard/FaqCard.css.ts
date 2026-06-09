import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const item = style({
  padding: '0 24px',
  borderBottom: `1px solid ${vars.color.line200}`,
  ':last-child': {
    borderBottom: 'none',
  },
});

export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '20px 0',
});

export const toggleButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
});

export const checkboxWrapper = style({
  flexShrink: 0,
  cursor: 'pointer',
  display: 'flex',
});

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  border: 0,
});

export const checkIcon = style({
  width: '20px',
  height: '20px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '4px',
});

export const checkIconSelected = style({
  width: '20px',
  height: '20px',
  backgroundColor: vars.color.blue300,
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.white,
});

export const question = style({
  flex: 1,
  color: vars.color.black400,
});

export const chevron = style({
  flexShrink: 0,
  width: '20px',
  height: '20px',
  color: vars.color.gray400,
  transition: 'transform 0.2s ease',
});

export const chevronOpen = style({
  transform: 'rotate(180deg)',
});

export const answer = style({
  padding: '0 32px 20px',
  color: vars.color.black300,
  lineHeight: '1.7',
});
