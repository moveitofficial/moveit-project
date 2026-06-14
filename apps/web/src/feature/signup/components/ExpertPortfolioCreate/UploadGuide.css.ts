import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const guide = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '14px 24px',
  border: `1px solid ${vars.color.blue200}`,
  borderRadius: '8px',
  backgroundColor: vars.color.blue50,
});

export const text = style([
  typography.f12B,
  {
    color: vars.color.blue200,
  },
]);
