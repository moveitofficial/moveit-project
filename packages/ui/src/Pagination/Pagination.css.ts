import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const root = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

const cell = style([
  typography.f12B,
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '32px',
    height: '32px',
    aspectRatio: '1 / 1',
    boxSizing: 'border-box',
    padding: 0,
    borderRadius: '4px',
    border: `1px solid ${vars.color.line200}`,
    backgroundColor: vars.color.white,
    color: vars.color.black500,
    textAlign: 'center',
    lineHeight: '22px',
    cursor: 'pointer',
  },
]);

export const navButton = cell;

export const pageButton = style([
  cell,
  {
    paddingTop: '1px',
  },
]);

export const pageButtonActive = style({
  backgroundColor: vars.color.blue300,
  borderColor: vars.color.blue300,
  color: vars.color.white,
});

export const navButtonDisabled = style({
  color: vars.color.gray300,
  cursor: 'default',
});
