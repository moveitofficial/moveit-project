import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const browseCard = recipe({
  base: {
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
    borderRadius: '24px',
  },

  variants: {
    tone: {
      blue: {
        backgroundColor: vars.color.blue300,
      },
      dark: {
        backgroundColor: vars.color.black500,
      },
    },
  },

  defaultVariants: {
    tone: 'blue',
  },
});

export const caption = recipe({
  base: {
    color: vars.color.gray50,
  },
  variants: {
    kind: {
      label: typography.f14EB,
      description: typography.f14R,
    },
  },
});

export const textGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const title = style([typography.f24EB, { color: vars.color.white }]);

export const tagGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '24px',
});

export const tag = style({
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
});
