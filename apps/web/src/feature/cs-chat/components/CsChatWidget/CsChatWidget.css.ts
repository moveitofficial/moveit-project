import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

import { LAUNCHER_SIZE } from '../../constants';

export const wrapper = style({
  position: 'fixed',
  right: 32,
  bottom: 32,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 16,
});

export const launcher = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-end',
  width: LAUNCHER_SIZE,
  height: LAUNCHER_SIZE,
  borderRadius: '50%',
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  boxShadow: '0 6px 20px rgba(27, 146, 255, 0.4)',
  cursor: 'pointer',
});
