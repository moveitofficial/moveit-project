import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const card = style({
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  width: '100%',
  padding: 24,
  textAlign: 'left',
  cursor: 'pointer',
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const cardSelected = style({
  backgroundColor: vars.color.blue50,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

export const nameRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const nameDate = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  minWidth: 0,
});

export const name = style([
  typography.f14EB,
  { color: vars.color.black500, whiteSpace: 'nowrap' },
]);

export const date = style([
  typography.f12R,
  { color: vars.color.gray400, whiteSpace: 'nowrap', flexShrink: 0 },
]);

export const status = style([
  typography.f12R,
  { color: vars.color.gray400, whiteSpace: 'nowrap', flexShrink: 0 },
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
    wordBreak: 'break-word',
  },
]);
