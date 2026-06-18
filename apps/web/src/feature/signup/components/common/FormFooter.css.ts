import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  marginTop: '40px',
});

export const submitBtn = style([
  typography.f16EB,
  {
    width: '375px',
    padding: '14px 0',
    backgroundColor: vars.color.gray50,
    border: 'none',
    borderRadius: '12px',
    color: vars.color.white,
    cursor: 'not-allowed',

    selectors: {
      '&:not(:disabled)': {
        backgroundColor: vars.color.blue300,
        cursor: 'pointer',
      },
    },
  },
]);

export const skipDesc = style([
  typography.f14R,
  {
    color: vars.color.gray300,
    textAlign: 'center',
  },
]);

export const skipBtn = style([
  typography.f16B,
  {
    background: 'none',
    border: 'none',
    color: vars.color.blue300,
    cursor: 'pointer',
    padding: 0,
  },
]);
