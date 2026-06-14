import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const error = style([
  typography.f12R,
  {
    color: vars.color.red200,
    alignSelf: 'flex-end',
  },
]);
