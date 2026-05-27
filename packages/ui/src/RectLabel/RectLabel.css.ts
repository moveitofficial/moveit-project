import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { recipe } from '@vanilla-extract/recipes';

export const rectLabelContainer = recipe({
  base: [
    typography.f12EB,
    {
      display: 'inline-flex',
      padding: '3px 8px',

      borderRadius: 4,
    },
  ],

  variants: {
    color: {
      blue50: {
        color: vars.color.blue300,
        backgroundColor: vars.color.blue100,
      },
      yellow: {
        color: vars.color.blue400,
        backgroundColor: vars.color.yellow100,
      },
      blue400: {
        color: 'white',
        backgroundColor: vars.color.blue400,
      },
      blue100: {
        color: vars.color.black100,
        backgroundColor: vars.color.blue100,
      },
      red: {
        color: 'white',
        backgroundColor: vars.color.red200,
      },
    },
  },
});
