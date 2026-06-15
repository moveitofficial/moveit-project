import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

import { INPUT_MAX_HEIGHT, INPUT_MIN_HEIGHT } from '../../constants';

export const outer = style({
  padding: '8px 24px 24px',
});

export const box = style({
  position: 'relative',
  minHeight: INPUT_MIN_HEIGHT,
  maxHeight: INPUT_MAX_HEIGHT,
  padding: 16,
  borderRadius: 8,
  backgroundColor: vars.color.blue50,
});

export const textarea = style([
  typography.f16R,
  {
    width: '100%',
    minHeight: INPUT_MIN_HEIGHT - 32,
    maxHeight: INPUT_MAX_HEIGHT - 32,
    resize: 'none',
    border: 'none',
    outline: 'none',
    paddingRight: 28,
    color: vars.color.black500,
    backgroundColor: 'transparent',
    overflowY: 'auto',
    '::placeholder': {
      color: vars.color.gray400,
    },
  },
]);

export const sendButton = style({
  position: 'absolute',
  right: 12,
  bottom: 12,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 4,
  backgroundColor: vars.color.blue300,
  color: vars.color.white,
  cursor: 'pointer',
  selectors: {
    '&:disabled': {
      backgroundColor: vars.color.gray200,
      cursor: 'not-allowed',
    },
  },
});
