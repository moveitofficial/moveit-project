import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { createVar } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const bgColor = createVar();
const bgAlpha = createVar();

export const roundContainer = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: `color-mix(in srgb, ${bgColor} ${bgAlpha}, transparent)`,
  },

  variants: {
    size: {
      admin: [
        typography.f12B,
        {
          padding: '4px 12px',
          border: 'none',
          borderRadius: 100,
          color: vars.color.white,
          cursor: 'default',
        },
      ],
      web: {
        padding: '8px 16px',
        border: '1px solid transparent',
        borderRadius: 100,
        cursor: 'pointer',
      },
      order: [
        typography.f12EB,
        {
          padding: '2px 8px',
          border: 'none',
          borderRadius: 4,
          color: vars.color.white,
          cursor: 'default',
        },
      ],
    },
    color: {
      labelWhite: [typography.f14B, { vars: { [bgColor]: vars.color.white } }],
      white: {
        borderColor: vars.color.line200,
        vars: { [bgColor]: vars.color.white },
      },
      blue100: {
        vars: { [bgColor]: vars.color.blue100 },
      },
      blue300: {
        vars: { [bgColor]: vars.color.blue300 },
      },
      blue400: {
        vars: { [bgColor]: vars.color.blue400 },
      },
      red200: {
        vars: { [bgColor]: vars.color.red200 },
      },
      yellow100: {
        vars: { [bgColor]: vars.color.yellow100 },
      },
    },
    opacity: {
      full: { vars: { [bgAlpha]: '100%' } },
      half: [
        typography.f16EB,
        { vars: { [bgAlpha]: '20%' }, color: vars.color.white },
      ],
    },
  },
  defaultVariants: {
    color: 'white',
    opacity: 'full',
  },
});
