import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const blockButton = style({
  padding: '10px 16px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
  cursor: 'pointer',
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const unblockButton = style({
  padding: '10px 16px',
  borderRadius: '8px',
  backgroundColor: vars.color.red200,
  color: vars.color.white,
  cursor: 'pointer',
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
});

export const blockMeta = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  color: vars.color.gray400,
  textAlign: 'center',
});
