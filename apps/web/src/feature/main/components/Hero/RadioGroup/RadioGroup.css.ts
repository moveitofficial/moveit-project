import { vars } from '@repo/styles/tokens';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '16px',
  marginBottom: '16px',
});

export const label = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
});

export const text = style({
  lineHeight: 'normal',
});

export const radio = style({
  appearance: 'none',
  margin: 0,
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: '#ffffff',
  cursor: 'pointer',

  ':checked': {
    backgroundColor: vars.color.blue200,
    boxShadow: 'inset 0 0 0 3px #ffffff',
  },
});
