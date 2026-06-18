import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

export const slot = style({
  display: 'flex',
  gap: '24px',
});

export const placeholder = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '14px',
  width: '176px',
  height: '176px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  cursor: 'pointer',
  padding: 0,
});

export const placeholderText = style([
  typography.f14R,
  {
    color: vars.color.gray400,
    textAlign: 'center',
  },
]);

export const hiddenInput = style({
  display: 'none',
});
