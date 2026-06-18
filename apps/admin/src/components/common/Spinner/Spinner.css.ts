import { vars } from '@repo/styles/tokens';
import { keyframes, style } from '@vanilla-extract/css';

const spin = keyframes({
  to: { transform: 'rotate(360deg)' },
});

export const wrapper = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const spinner = style({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: `3px solid ${vars.color.line200}`,
  borderTopColor: vars.color.blue300,
  animation: `${spin} 0.7s linear infinite`,
});
