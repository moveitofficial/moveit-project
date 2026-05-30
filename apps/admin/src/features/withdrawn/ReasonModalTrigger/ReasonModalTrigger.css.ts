import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const reasonButton = style({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  textAlign: 'left',
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'inherit',
  fontSize: 'inherit',
  fontFamily: 'inherit',
});

export const modalReason = style({
  display: 'block',
  textAlign: 'left',
  color: vars.color.black500,
  wordBreak: 'break-all',
});
