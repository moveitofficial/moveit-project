import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const actionsRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const actionButton = style([
  typography.f12R,
  {
    padding: 0,
    border: 'none',
    background: 'none',
    color: vars.color.gray400,
    cursor: 'pointer',
  },
]);

export const actionButtonDisabled = style({
  cursor: 'not-allowed',
  opacity: 0.5,
});

export const postLink = style({
  display: 'block',
  color: 'inherit',
  textDecoration: 'none',
});
