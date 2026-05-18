import { vars } from '@repo/styles/tokens';
import { typography } from '@repo/styles/typography';
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const wrapper = recipe({
  base: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  variants: {
    spacing: {
      default: { marginTop: '88px' },
      none: { marginTop: 0 },
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
});

export const titleGroup = recipe({
  base: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  variants: {
    hasDescription: {
      true: { alignItems: 'flex-end' },
      false: { alignItems: 'center' },
    },
  },
  defaultVariants: {
    hasDescription: false,
  },
});

export const title = style([
  typography.f24EB,
  {
    color: vars.color.black500,
  },
]);
export const description = style({
  color: vars.color.gray400,
  marginTop: '4px',
});

export const linkGroup = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
  color: vars.color.gray400,
  cursor: 'pointer',
});
