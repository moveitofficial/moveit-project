import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const list = style({
  display: 'flex',
  flexDirection: 'column',
  borderTop: `1px solid ${vars.color.line200}`,
});

export const item = style({
  borderBottom: `1px solid ${vars.color.line200}`,
});

export const questionButton = style([
  typography.f16R,
  {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    width: '100%',
    padding: '20px 0',
    border: 'none',
    background: 'none',
    color: vars.color.black500,
    textAlign: 'left',
    cursor: 'pointer',
  },
]);

export const answer = style([
  typography.f14R,
  {
    margin: 0,
    padding: '0 0 20px',
    color: vars.color.black300,
    whiteSpace: 'pre-line',
  },
]);
