import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const LoginContainer = style({
  width: '375px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const LoginLogoWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '24px',
  marginBottom: '32px',
});

export const LoginText = style([typography.f32EB]);

export const SignUpHint = style([
  typography.f14R,
  {
    marginTop: '14px',
    color: vars.color.black500,
  },
]);

export const SignUpLink = style([
  typography.f14B,
  {
    color: vars.color.blue300,
    textDecoration: 'underline',
  },
]);

export const SnsWrapper = style({
  marginTop: '66px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '14px',
});

export const SnsTitle = style([typography.f16R]);
