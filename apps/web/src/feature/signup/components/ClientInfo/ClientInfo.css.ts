import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const Container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '576px',
  padding: '120px 0 120px 0',
});

export const sectionTitle = style([
  typography.f20EB,
  {
    color: vars.color.black500,
    width: '100%',
    marginBottom: '20px',
  },
]);

export const formBox = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  padding: '52px 40px',
  border: `1px solid ${vars.color.line200}`,
  borderRadius: '8px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
});

export const label = style([
  typography.f16B,
  {
    color: vars.color.black500,
  },
]);

export const input = style([
  typography.f16R,
  {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${vars.color.line200}`,
    borderRadius: '12px',
    color: vars.color.black500,
    backgroundColor: vars.color.white,

    selectors: {
      '&::placeholder': {
        color: vars.color.gray400,
      },
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 1000px ${vars.color.white} inset`,
        WebkitTextFillColor: vars.color.black500,
      },
    },
  },
]);

