import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const thumb = style({
  position: 'relative',
  width: '176px',
  height: '176px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
  overflow: 'hidden',
});

export const image = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

export const removeBtn = style({
  position: 'absolute',
  bottom: '8px',
  right: '8px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: vars.color.white,
  cursor: 'pointer',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,

  selectors: {
    [`${thumb}:hover &`]: {
      display: 'flex',
    },
  },
});
