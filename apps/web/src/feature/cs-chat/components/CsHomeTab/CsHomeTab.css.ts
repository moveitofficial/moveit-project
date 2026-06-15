import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  flex: 1,
  overflowY: 'auto',
  padding: '16px 24px 24px',
});

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 16,
  borderRadius: 8,
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
});

export const caption = style([
  typography.f12R,
  {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: vars.color.black500,
  },
]);

export const avatar = style([
  typography.f16EB,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    lineHeight: 1,
  },
]);

export const body = style({
  display: 'flex',
  flexDirection: 'column',
});

export const bodyLine = style([
  typography.f16R,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const bodyLineBold = style([
  typography.f16EB,
  {
    margin: 0,
    color: vars.color.black500,
  },
]);

export const inquiryButton = style([
  typography.f16EB,
  {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: vars.color.blue300,
    color: vars.color.white,
    cursor: 'pointer',
  },
]);
