import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  padding: 16,
  borderRadius: 8,
  border: `1px solid ${vars.color.line200}`,
  backgroundColor: vars.color.white,
  textAlign: 'left',
  cursor: 'pointer',
});

export const head = style([
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

export const preview = style([
  typography.f14R,
  {
    margin: 0,
    color: vars.color.black500,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
]);
